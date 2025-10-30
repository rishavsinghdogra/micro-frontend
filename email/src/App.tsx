import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Emails from "./pages/Emails";
export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Emails />
    </QueryClientProvider>
  );
}
