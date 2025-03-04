
import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, Users, Calendar, Bell, Settings, 
  PlusCircle, Menu, X, LinkedinIcon
} from 'lucide-react';
import { getContactsDueForFollowUp } from '@/utils/storage';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const followUpContacts = getContactsDueForFollowUp();
  const hasNotifications = followUpContacts.length > 0;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-accent/20">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full glass-card"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-all duration-300 ease-in-out bg-white/80 backdrop-blur-md border-r border-border shadow-sm
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-center py-6 mb-6">
            <LinkedinIcon size={28} className="text-primary mr-2" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">ConnectPro</h1>
          </div>
          
          <nav className="space-y-1 flex-1">
            <Link to="/">
              <Button
                variant={isActive('/') ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isActive('/') ? 'bg-accent text-primary font-medium' : ''}`}
              >
                <Users size={18} className="mr-2" />
                Dashboard
              </Button>
            </Link>
            
            <Link to="/contacts">
              <Button
                variant={isActive('/contacts') ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isActive('/contacts') ? 'bg-accent text-primary font-medium' : ''}`}
              >
                <User size={18} className="mr-2" />
                Contacts
              </Button>
            </Link>
            
            <Link to="/notifications">
              <Button
                variant={isActive('/notifications') ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isActive('/notifications') ? 'bg-accent text-primary font-medium' : ''}`}
              >
                <div className="relative">
                  <Bell size={18} className="mr-2" />
                  {hasNotifications && (
                    <span className="absolute -top-1 -right-1 bg-primary w-2 h-2 rounded-full animate-pulse" />
                  )}
                </div>
                Reminders
                {hasNotifications && (
                  <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    {followUpContacts.length}
                  </span>
                )}
              </Button>
            </Link>
            
            <Separator className="my-4" />
            
            <Link to="/settings">
              <Button
                variant={isActive('/settings') ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${isActive('/settings') ? 'bg-accent text-primary font-medium' : ''}`}
              >
                <Settings size={18} className="mr-2" />
                Settings
              </Button>
            </Link>
          </nav>
          
          <div className="pt-6">
            <Link to="/contacts/new">
              <Button className="w-full">
                <PlusCircle size={18} className="mr-2" />
                Add Contact
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        <main className="container py-6 md:py-10 px-4 md:px-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
