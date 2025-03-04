
import { Contact } from '@/utils/storage';
import { formatDate, getRelativeTimeString, isOverdue } from '@/utils/dateUtils';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MessageCircle } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onClick?: () => void;
}

const ContactCard = ({ contact, onClick }: ContactCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const getLatestNotePreview = () => {
    if (contact.notes && contact.notes.length > 0) {
      const latestNote = contact.notes.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      
      const preview = latestNote.content.substring(0, 60);
      return preview.length < latestNote.content.length ? `${preview}...` : preview;
    }
    return "No notes yet";
  };
  
  const overdue = contact.nextContactDate && isOverdue(contact.nextContactDate);

  return (
    <Card 
      className={`card-hover overflow-hidden border ${overdue ? 'border-primary/20' : 'border-border'} glass-card`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
            <AvatarImage src={contact.profileImage} alt={contact.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {contact.name}
              </h3>
              
              {overdue && (
                <Badge variant="outline" className="ml-2 border-primary/50 text-primary whitespace-nowrap">
                  Follow up
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              {contact.position}{contact.position && contact.company && ' at '}{contact.company}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {contact.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock size={14} className="mr-1.5 text-muted-foreground" />
            <span>Last contact: {getRelativeTimeString(contact.lastContactDate)}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar size={14} className="mr-1.5 text-muted-foreground" />
            <span>Next: {formatDate(contact.nextContactDate)}</span>
          </div>
        </div>
        
        {contact.notes && contact.notes.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-start">
              <MessageCircle size={14} className="mr-1.5 mt-0.5 text-muted-foreground" />
              <p className="line-clamp-2">{getLatestNotePreview()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactCard;
