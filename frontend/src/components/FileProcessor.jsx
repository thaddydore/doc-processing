import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { processFile } from '../api/processFile';
import FilterBuilder from './FilterBuilder';

export default function FileProcessor() {
  const [file, setFile] = useState(null);
  const [filters, setFilters] = useState([]);
  const [columns, setColumns] = useState('');
  const [deduplicateOn, setDeduplicateOn] = useState('');
  const [outputFormat, setOutputFormat] = useState('csv');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: ({ file, config }) => processFile(file, config),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `processed.${outputFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setError('');
    },
    onError: (err) => {
      setError(err.message || 'An error occurred');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!columns.trim()) {
      setError('Please specify columns to include');
      return;
    }

    // Build config
    const filtersObj = {};
    filters.forEach(f => {
      if (f.column && f.value) {
        filtersObj[f.column] = f.value;
      }
    });

    const columnsList = columns
      .split(',')
      .map(c => c.trim())
      .filter(c => c);

    const deduplicateList = deduplicateOn
      .split(',')
      .map(c => c.trim())
      .filter(c => c);

    const config = {
      filters: filtersObj,
      columns: columnsList,
      output_format: outputFormat,
      deduplicate_on: deduplicateList.length > 0 ? deduplicateList : null,
    };

    mutation.mutate({ file, config });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (!['csv', 'xlsx', 'xls'].includes(ext)) {
        setError('Only CSV and Excel files are supported');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Data Processing Tool
          </h1>
          <p className="text-gray-400">
            Upload, filter, and process your CSV and Excel files
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                />
              </div>
              {file && (
                <p className="mt-2 text-sm text-green-400">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Filters */}
            <FilterBuilder filters={filters} setFilters={setFilters} />

            {/* Columns */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Columns to Include *
              </label>
              <input
                type="text"
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                placeholder="e.g., first_name, last_name, email"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Comma-separated list of column names
              </p>
            </div>

            {/* Deduplicate On */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Remove Duplicates Based On (Optional)
              </label>
              <input
                type="text"
                value={deduplicateOn}
                onChange={(e) => setDeduplicateOn(e.target.value)}
                placeholder="e.g., email"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Comma-separated column names to check for duplicates. Leave empty to skip deduplication.
              </p>
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Output Format
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (XLSX)</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-600 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Process & Download'
              )}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">How to use:</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>1. Upload a CSV or Excel file</li>
            <li>2. Add filters to narrow down rows (optional)</li>
            <li>3. Specify which columns to include in the output</li>
            <li>4. Select your preferred output format</li>
            <li>5. Click "Process & Download" to get your processed file</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
