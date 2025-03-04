
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContactsDueForFollowUp, Contact } from '@/utils/storage';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from '@/utils/dateUtils';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationBell = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadContacts = () => {
      const dueContacts = getContactsDueForFollowUp();
      setContacts(dueContacts);
    };
    
    loadContacts();
    
    // Set up an interval to check for new notifications
    const interval = setInterval(loadContacts, 60000); // Every minute
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);
  
  const hasNotifications = contacts.length > 0;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {hasNotifications && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 glass-card" align="end">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Reminders</h3>
          <p className="text-sm text-muted-foreground">
            {hasNotifications 
              ? `${contacts.length} contact${contacts.length === 1 ? '' : 's'} due for follow-up`
              : 'No reminders at this time'}
          </p>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {hasNotifications ? (
            contacts.map(contact => (
              <div 
                key={contact.id}
                className="p-3 border-b border-border last:border-0 flex items-center gap-3 hover:bg-muted/20 cursor-pointer"
                onClick={() => navigate(`/contacts/${contact.id}`)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contact.profileImage} alt={contact.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {contact.position}{contact.position && contact.company && ' at '}{contact.company}
                  </p>
                </div>
                
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  Due: {formatDate(contact.nextContactDate)}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>You're all caught up!</p>
            </div>
          )}
        </div>
        
        {hasNotifications && (
          <div className="p-3 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full text-primary"
              onClick={() => navigate('/notifications')}
            >
              View All Reminders
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
