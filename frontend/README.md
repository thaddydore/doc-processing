# Data Processing Frontend

React frontend for the data processing application.

## Setup

### 1. Install dependencies

```bash
npm install
```

## Running the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for production

```bash
npm run build
```

## Features

- **File Upload**: Drag and drop or browse for CSV/Excel files
- **Dynamic Filters**: Add multiple column-value filters
- **Column Selection**: Specify which columns to include in output
- **Format Selection**: Choose between CSV or Excel output
- **Loading States**: Visual feedback during processing
- **Error Handling**: Clear error messages from backend
- **Auto Download**: Processed files download automatically

## Usage

1. Select a CSV or Excel file
2. (Optional) Add filters to narrow down rows
3. Enter comma-separated column names to include
4. Choose output format (CSV or Excel)
5. Click "Process & Download"

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Axios
- TanStack React Query
