# Data Processing Application

A full-stack web application for processing Excel and CSV files with dynamic filtering and column selection.

## Features

- 📁 Upload CSV or Excel files (up to ~50MB)
- 🔍 Dynamic row filtering based on column values
- 📊 Select specific columns to include in output
- 💾 Download processed files in CSV or Excel format
- ⚡ Fast processing with pandas
- 🎨 Clean, modern UI with TailwindCSS

## Project Structure

```
doc_processing/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── services/
│   │   └── schemas/
│   ├── environment.yml
│   └── README.md
├── frontend/         # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
└── sample_data.csv   # Sample test file
```

## Quick Start

### Using Docker (Recommended)

The easiest way to run the application is with Docker:

```bash
docker-compose up --build
```

This will start both the backend and frontend services:

- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

For more Docker options and troubleshooting, see [DOCKER.md](DOCKER.md).

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Create conda environment:

   ```bash
   conda env create -f environment.yml
   ```

3. Activate environment:

   ```bash
   conda activate doc_processing
   ```

4. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

#### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Usage

1. **Upload a file**: Select a CSV or Excel file from your computer
2. **Add filters** (optional): Filter rows by specifying column names and values
3. **Select columns**: Enter comma-separated column names to include in output
4. **Choose format**: Select CSV or Excel as output format
5. **Process & Download**: Click the button to process and download your file

## API Documentation

Interactive API docs available at: `http://localhost:8000/docs`

### Example API Request

```bash
curl -X POST http://localhost:8000/process-file \
  -F "file=@sample_data.csv" \
  -F 'config={"filters":{"status":"active"},"columns":["first_name","last_name","email"],"output_format":"csv"}' \
  -o output.csv
```

## Tech Stack

### Backend

- FastAPI
- pandas
- openpyxl
- Python 3.11

### Frontend

- React 18
- Vite
- TailwindCSS
- Axios
- TanStack React Query

## License

MIT
