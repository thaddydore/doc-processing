import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const processFile = async (file, config) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('config', JSON.stringify(config));

  try {
    const response = await axios.post(`${API_BASE_URL}/process-file`, formData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    // If the error response is a blob, parse it as JSON
    if (error.response && error.response.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const errorData = JSON.parse(text);
        // Re-throw with parsed error data
        throw new Error(errorData.detail || errorData.error || 'An error occurred');
      } catch (parseError) {
        // If parsing fails, use the text as-is
        throw new Error(text || 'An error occurred');
      }
    }
    // Re-throw original error if not a blob
    throw error;
  }
};
