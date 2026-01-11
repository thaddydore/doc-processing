import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FileProcessor from './components/FileProcessor';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FileProcessor />
    </QueryClientProvider>
  );
}

export default App;
