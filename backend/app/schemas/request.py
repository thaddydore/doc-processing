from pydantic import BaseModel, Field
from typing import Dict, List, Optional


class ProcessFileConfig(BaseModel):
    """Configuration for file processing request."""
    
    filters: Dict[str, str] = Field(
        default_factory=dict,
        description="Column-value pairs for filtering rows"
    )
    columns: List[str] = Field(
        ...,
        description="List of column names to include in output",
        min_length=1
    )
    output_format: str = Field(
        ...,
        description="Output format: 'csv' or 'xlsx'",
        pattern="^(csv|xlsx)$"
    )
    deduplicate_on: Optional[List[str]] = Field(
        default=None,
        description="Optional: List of column names to check for duplicates. If not provided, no deduplication is performed."
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "filters": {
                    "email.emails_validator.status": "RECEIVING"
                },
                "columns": [
                    "first_name",
                    "last_name",
                    "phone",
                    "email",
                    "email.emails_validator.status"
                ],
                "output_format": "xlsx",
                "deduplicate_on": ["email"]
            }
        }
