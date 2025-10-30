import React from 'react';
import { Home, FileText, } from 'lucide-react';
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
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Main Content Area</h1>
          </header>
          
          {/* Main Content - Empty area ready for components */}
          <div className="flex-1 overflow-auto p-6">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Welcome to Your App
                </h2>
                <p className="text-muted-foreground">
                  This is the main content area where you can render your components.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default App;