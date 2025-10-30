import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, FileText } from 'lucide-react';
import RemoteApp from 'chat_app/App';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const navItems = [
  {
    title: 'Chat Room',
    url: '/chat-room',
    icon: Home,
  },
  {
    title: 'Email',
    url: '/email',
    icon: FileText,
  },
];

const ChatRoom: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Chat Room</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sample Chat Interface</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="font-medium">User 1:</p>
            <p>Hello! How can I help you today?</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="font-medium">You:</p>
            <p>I'm looking for information about your services.</p>
          </div>
          <div className="mt-6">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Email: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Email</h1>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sample Email Interface</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="font-medium">John Doe</p>
              <span className="text-sm text-gray-500">10:30 AM</span>
            </div>
            <p className="text-gray-600">Meeting scheduled for tomorrow</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="font-medium">Jane Smith</p>
              <span className="text-sm text-gray-500">9:15 AM</span>
            </div>
            <p className="text-gray-600">Project update and deliverables</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="font-medium">Team Updates</p>
              <span className="text-sm text-gray-500">Yesterday</span>
            </div>
            <p className="text-gray-600">Weekly team newsletter</p>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Compose New Email
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Welcome to Your App
          </h2>
          <p className="text-muted-foreground">
            This is the main content area where you can render your components.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Chat Room</h3>
              <p className="text-sm text-muted-foreground">
                Real-time messaging and communication
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground">
                Send and receive messages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppSidebar: React.FC = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <main className="flex flex-1 flex-col">
            {/* Header */}
            <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Main Content Area</h1>
            </header>
            
            {/* Routes */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat-room" element={<RemoteApp />} />
              <Route path="/email" element={<Email />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
};

export default App;