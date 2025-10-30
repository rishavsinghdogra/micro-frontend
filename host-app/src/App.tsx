import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home, FileText } from "lucide-react";
const RemoteChatApp = lazy(() => import("chat_app/App"));
const RemoteEmailApp = lazy(() => import("email_app/App"));

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
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Chat Room",
    url: "/chat-room",
    icon: Home,
  },
  {
    title: "Email",
    url: "/email",
    icon: FileText,
  },
];

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
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
            <Suspense fallback={<div>Loading Chat App...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat-room" element={<RemoteChatApp />} />
                <Route path="/email" element={<RemoteEmailApp />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
};

export default App;
