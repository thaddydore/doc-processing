import pandas as pd
from io import BytesIO
from typing import Dict, List
from fastapi import HTTPException, UploadFile


class FileProcessor:
    """Service for processing Excel and CSV files."""
    
    SUPPORTED_EXTENSIONS = {'.csv', '.xlsx', '.xls'}
    
    @staticmethod
    async def process_file(
        file: UploadFile,
        filters: Dict[str, str],
        columns: List[str],
        output_format: str,
        deduplicate_on: List[str] = None
    ) -> BytesIO:
        """
        Process uploaded file with filters and column selection.
        
        Args:
            file: Uploaded file (CSV or Excel)
            filters: Dictionary of column-value pairs to filter by
            columns: List of columns to include in output
            output_format: Output format ('csv' or 'xlsx')
            deduplicate_on: Optional list of columns to check for duplicates
            
        Returns:
            BytesIO: Processed file as bytes
            
        Raises:
            HTTPException: If file type unsupported or processing fails
        """
        # Validate file extension
        file_ext = FileProcessor._get_file_extension(file.filename)
        if file_ext not in FileProcessor.SUPPORTED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Supported types: {', '.join(FileProcessor.SUPPORTED_EXTENSIONS)}"
            )
        
        # Read file into DataFrame
        try:
            df = await FileProcessor._read_file(file, file_ext)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error reading file: {str(e)}"
            )
        
        # Normalize missing values
        df = df.fillna("")
        
        # Validate that all filter columns exist
        missing_filter_cols = [col for col in filters.keys() if col not in df.columns]
        if missing_filter_cols:
            raise HTTPException(
                status_code=400,
                detail=f"Filter columns not found in file: {', '.join(missing_filter_cols)}"
            )
        
        # Validate that all requested columns exist
        missing_cols = [col for col in columns if col not in df.columns]
        if missing_cols:
            raise HTTPException(
                status_code=400,
                detail=f"Columns not found in file: {', '.join(missing_cols)}"
            )
        
        # Validate deduplicate_on columns if provided
        if deduplicate_on:
            missing_dedup_cols = [col for col in deduplicate_on if col not in df.columns]
            if missing_dedup_cols:
                raise HTTPException(
                    status_code=400,
                    detail=f"Deduplication columns not found in file: {', '.join(missing_dedup_cols)}"
                )
        
        # Apply filters dynamically
        for col, value in filters.items():
            df = df[df[col] == value]
        
        # Check if result is empty
        if len(df) == 0:
            raise HTTPException(
                status_code=400,
                detail="No rows match the given filters"
            )
        
        # Select requested columns (preserves order)
        df = df[columns]
        
        # Remove duplicate rows based on specified columns
        if deduplicate_on:
            # Validate that deduplicate columns are in selected columns
            invalid_dedup_cols = [col for col in deduplicate_on if col not in columns]
            if invalid_dedup_cols:
                raise HTTPException(
                    status_code=400,
                    detail=f"Deduplication columns must be in selected columns: {', '.join(invalid_dedup_cols)}"
                )
            df = df.drop_duplicates(subset=deduplicate_on)
        
        # Export to requested format
        output = BytesIO()
        if output_format == "csv":
            df.to_csv(output, index=False)
        else:  # xlsx
            df.to_excel(output, index=False, engine='openpyxl')
        
        output.seek(0)
        return output
    
    @staticmethod
    def _get_file_extension(filename: str) -> str:
        """Extract file extension from filename."""
        if '.' not in filename:
            return ''
        return '.' + filename.rsplit('.', 1)[1].lower()
    
    @staticmethod
    async def _read_file(file: UploadFile, file_ext: str) -> pd.DataFrame:
        """Read uploaded file into pandas DataFrame."""
        content = await file.read()
        
        if file_ext == '.csv':
            return pd.read_csv(BytesIO(content))
        else:  # .xlsx or .xls
            return pd.read_excel(BytesIO(content))
