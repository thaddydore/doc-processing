---
description: Project Plan
---

Build a full-stack data-processing web application that allows users to upload an Excel or CSV file, filter rows dynamically based on user-supplied conditions, select which columns to return, and download the processed file in a user-specified format.

**Backend requirements (FastAPI):**

* Use **FastAPI** as the backend framework.
* Expose a single main API endpoint:
  `POST /process-file`
 * The endpoint must accept:

* A file upload (`.xlsx`, `.xls`, or `.csv`)
* A JSON payload containing:
* `filters`: key-value pairs where:
* key = column name
* value = exact value to filter by (string match, after handling nulls)
* `columns`: list of column names to include in the output
* `output_format`: `"xlsx"` or `"csv"`
* Use **pandas** for file processing.
* Handle missing values safely (e.g., `fillna("")` before filtering).
 * Apply all filters dynamically (not hardcoded).
 * Ensure the downloaded file:

 * Has **no serial/index column**
* Preserves column order as supplied by the user
* Return the processed file as a downloadable response.
* Validate inputs:

 * File type
 * Column existence
 * Filter keys must exist in the uploaded dataset
* Return meaningful error messages for invalid input.

**Frontend requirements (React):**

* Use **plain React** (no Next.js).
* Use:

* `axios` for HTTP requests
 * `@tanstack/react-query (useQuery / useMutation)`
  * `tailwindcss` for styling
* UI flow:

1. File upload (Excel or CSV)
  2. Dynamic input fields for:

 * Filters (column + value)
   * Columns to return (multi-select or comma-separated)
 * Output format selector (CSV or Excel)
 3. Submit button
 4. Download processed file
* No authentication required.
* Minimal UI, functional and clean.

**Performance & UX constraints:**

* Must handle files up to ~50MB efficiently.
* Backend should stream file responses (not load entire response into memory).
* Frontend should show loading and error states.

**Deliverables:**

 * FastAPI backend with clear folder structure
 * React frontend with Tailwind styling
* Example request/response payload
* Instructions to run locally

---

## 2. DEVELOPMENT PLAN (STEP-BY-STEP)

### PHASE 1 — Backend (FastAPI)

#### 1. Project setup

```
backend/
├── app/
│   ├── main.py
│   ├── routers/
│   │   └── process.py
│   ├── services/
│   │   └── file_processor.py
│   └── schemas/
│       └── request.py
├── requirements.txt
```

Dependencies:

```
fastapi
uvicorn
pandas
openpyxl
python-multipart
```

---

#### 2. API contract

**Endpoint**

```
POST /process-file
```

**Multipart form-data**

* `file`: uploaded CSV or Excel file
* `config`: JSON string

**Config JSON example**

```json
{
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
  "output_format": "xlsx"
}
```

---

#### 3. File processing logic (core)

* Detect file type:

  * `.csv` → `pd.read_csv`
  * `.xlsx/.xls` → `pd.read_excel`
* Normalize dataframe:

  * `df = df.fillna("")`
* Apply filters dynamically:

  ```python
  for col, value in filters.items():
      df = df[df[col] == value]
  ```
* Select requested columns:

  ```python
  df = df[columns]
  ```
* Export:

  * CSV → `df.to_csv(index=False)`
  * Excel → `df.to_excel(index=False)`
* Return as streamed file response.

---

#### 4. Validation & errors

* Reject unsupported file types
* Reject missing columns
* Reject empty results
* Clear error messages using `HTTPException`

---

### PHASE 2 — Frontend (React)

#### 1. Project setup

```
frontend/
├── src/
│   ├── api/
│   │   └── processFile.js
│   ├── components/
│   │   └── FileProcessor.jsx
│   ├── App.jsx
│   └── main.jsx
```

Dependencies:

```
axios
@tanstack/react-query
tailwindcss
```

---

#### 2. UI components

* File input
* Filter builder:

  * Column name input
  * Value input
  * Add/remove filter rows
* Columns input:

  * Comma-separated or checkbox list
* Output format dropdown (`csv | xlsx`)
* Submit button
* Download link/button

---

#### 3. Data flow

* Use `useMutation` for file upload
* Build `FormData`:

  ```js
  const formData = new FormData();
  formData.append("file", file);
  formData.append("config", JSON.stringify(config));
  ```
* Axios POST request
* Handle blob response:

  * Create downloadable file URL
  * Trigger browser download

---

### PHASE 3 — Performance & UX

* Loading spinner during processing
* Disable submit while uploading
* Show validation errors from backend
* Clear success feedback

---

### PHASE 4 — Testing

* CSV upload test
* Excel upload test
* Missing column error test
* Empty result set test
* Large file test

---

## 3. EXPECTED OUTCOME

* User uploads Excel/CSV
* User defines:

  * Filter conditions
  * Columns to return
  * Output format
* Backend processes with pandas
* Clean downloadable file:

  * No index/serial number
  * Only requested columns
  * Filtered rows only