# Data Processing Backend

FastAPI backend for processing Excel and CSV files with dynamic filtering and column selection.

## Setup

### 1. Create conda environment

```bash
conda env create -f environment.yml
```

### 2. Activate environment

```bash
conda activate doc_processing
```

## Running the server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Interactive API docs available at: `http://localhost:8000/docs`

## API Endpoint

### POST /process-file

Process an uploaded file with filters and column selection.

**Request:**
- `file`: Excel or CSV file (multipart/form-data)
- `config`: JSON string with configuration

**Config format:**
```json
{
  "filters": {
    "column_name": "value"
  },
  "columns": ["col1", "col2"],
  "output_format": "csv" | "xlsx"
}
```

**Response:**
- Downloadable file in requested format

## Example using curl

```bash
curl -X POST http://localhost:8000/process-file \
  -F "file=@sample.csv" \
  -F 'config={"filters":{"status":"active"},"columns":["name","email"],"output_format":"csv"}' \
  -o output.csv
```
