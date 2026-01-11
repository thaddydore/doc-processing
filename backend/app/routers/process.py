from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import StreamingResponse
import json
from app.schemas.request import ProcessFileConfig
from app.services.file_processor import FileProcessor


router = APIRouter()


@router.post("/process-file")
async def process_file(
    file: UploadFile = File(..., description="CSV or Excel file to process"),
    config: str = Form(..., description="JSON configuration for processing")
):
    """
    Process uploaded file with filters and column selection.
    
    Returns processed file in requested format (CSV or Excel).
    """
    # Parse and validate config
    try:
        config_dict = json.loads(config)
        config_obj = ProcessFileConfig(**config_dict)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON in config field"}
    except Exception as e:
        return {"error": f"Invalid config: {str(e)}"}
    
    # Process file
    processed_file = await FileProcessor.process_file(
        file=file,
        filters=config_obj.filters,
        columns=config_obj.columns,
        output_format=config_obj.output_format,
        deduplicate_on=config_obj.deduplicate_on
    )
    
    # Determine filename and media type
    output_ext = config_obj.output_format
    output_filename = f"processed.{output_ext}"
    
    media_type = (
        "text/csv" if output_ext == "csv"
        else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    
    # Return as streaming response
    return StreamingResponse(
        processed_file,
        media_type=media_type,
        headers={
            "Content-Disposition": f"attachment; filename={output_filename}"
        }
    )
