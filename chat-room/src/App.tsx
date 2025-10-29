import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatApp from "./pages/ChatApp";
export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChatApp />
    </QueryClientProvider>
  );
}
