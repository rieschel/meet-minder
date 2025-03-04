
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Contact, getContact, updateContact, addNote, deleteContact, Note } from '@/utils/storage';
import { formatDate, calculateNextContactDate } from '@/utils/dateUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { 
  User, Calendar, Mail, Phone, Building, Clock, 
  Edit, Trash2, Linkedin, Plus, MessageCircle
} from 'lucide-react';

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact | null>(null);
  const [newNote, setNewNote] = useState<Omit<Note, 'id'>>({
    content: '',
    date: new Date().toISOString().split('T')[0],
    type: 'meeting',
    topics: []
  });
  const [newNoteTopicInput, setNewNoteTopicInput] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundContact = getContact(id);
      if (foundContact) {
        setContact(foundContact);
        setEditedContact(foundContact);
      } else {
        navigate('/contacts');
        toast.error('Contact not found');
      }
    }
  }, [id, navigate]);
  
  if (!contact) return null;
  
  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditedContact(contact);
    }
  };
  
  const handleSaveContact = () => {
    if (editedContact) {
      try {
        const updatedContact = updateContact(editedContact);
        setContact(updatedContact);
        setIsEditMode(false);
        toast.success('Contact updated successfully');
      } catch (error) {
        toast.error('Failed to update contact');
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedContact) {
      setEditedContact({
        ...editedContact,
        [e.target.name]: e.target.value
      });
    }
  };
  
  const handleTagChange = (tag: string) => {
    if (editedContact) {
      const updatedTags = editedContact.tags.includes(tag)
        ? editedContact.tags.filter(t => t !== tag)
        : [...editedContact.tags, tag];
      
      setEditedContact({
        ...editedContact,
        tags: updatedTags
      });
    }
  };
  
  const handleAddTag = (tag: string) => {
    if (editedContact && tag.trim() && !editedContact.tags.includes(tag.trim())) {
      setEditedContact({
        ...editedContact,
        tags: [...editedContact.tags, tag.trim()]
      });
    }
  };
  
  const handleNewNoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewNote({
      ...newNote,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAddNoteTopic = () => {
    if (newNoteTopicInput.trim() && newNote.topics) {
      if (!newNote.topics.includes(newNoteTopicInput.trim())) {
        setNewNote({
          ...newNote,
          topics: [...newNote.topics, newNoteTopicInput.trim()]
        });
      }
      setNewNoteTopicInput('');
    }
  };
  
  const handleRemoveNoteTopic = (topic: string) => {
    if (newNote.topics) {
      setNewNote({
        ...newNote,
        topics: newNote.topics.filter(t => t !== topic)
      });
    }
  };
  
  const handleSaveNote = () => {
    if (newNote.content.trim()) {
      try {
        addNote(contact.id, newNote);
        
        // Update the local contact state
        const updatedContact = getContact(contact.id);
        setContact(updatedContact || null);
        
        // Reset new note form
        setNewNote({
          content: '',
          date: new Date().toISOString().split('T')[0],
          type: 'meeting',
          topics: []
        });
        
        toast.success('Note added successfully');
      } catch (error) {
        toast.error('Failed to add note');
      }
    } else {
      toast.error('Note content cannot be empty');
    }
  };
  
  const handleDeleteContact = () => {
    try {
      deleteContact(contact.id);
      navigate('/contacts');
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contact');
      setIsDeleteDialogOpen(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/contacts')}
            className="glass-card"
          >
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Contact Details</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleEditToggle}
            className="glass-card"
          >
            {isEditMode ? 'Cancel' : 'Edit'}
            <Edit size={16} className="ml-2" />
          </Button>
          
          {isEditMode ? (
            <Button onClick={handleSaveContact}>Save Changes</Button>
          ) : (
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the contact 
                    and all associated notes.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteContact}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <div className="flex flex-col-reverse lg:flex-row gap-6">
        <div className="flex-1">
          <Tabs defaultValue="info">
            <TabsList className="glass-card">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="animate-fade-in">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>View and edit contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditMode ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={editedContact?.name || ''}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={editedContact?.email || ''}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={editedContact?.phone || ''}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="linkedInUsername">LinkedIn Username</Label>
                          <Input
                            id="linkedInUsername"
                            name="linkedInUsername"
                            value={editedContact?.linkedInUsername || ''}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            name="company"
                            value={editedContact?.company || ''}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            name="position"
                            value={editedContact?.position || ''}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastContactDate">Last Contact Date</Label>
                          <Input
                            id="lastContactDate"
                            name="lastContactDate"
                            type="date"
                            value={editedContact?.lastContactDate || ''}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nextContactDate">Next Contact Date</Label>
                          <Input
                            id="nextContactDate"
                            name="nextContactDate"
                            type="date"
                            value={editedContact?.nextContactDate || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {editedContact?.tags.map(tag => (
                            <Badge 
                              key={tag} 
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => handleTagChange(tag)}
                            >
                              {tag}
                              <span className="ml-1">×</span>
                            </Badge>
                          ))}
                          <div className="flex items-center">
                            <Input
                              placeholder="Add a tag..."
                              className="w-32 h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag(e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="profileImage">Profile Image URL</Label>
                        <Input
                          id="profileImage"
                          name="profileImage"
                          value={editedContact?.profileImage || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <Avatar className="h-24 w-24 border-2 border-white shadow-sm">
                          <AvatarImage src={contact.profileImage} alt={contact.name} />
                          <AvatarFallback className="text-xl bg-primary/10 text-primary">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-2 flex-1">
                          <h2 className="text-2xl font-bold">{contact.name}</h2>
                          <p className="text-muted-foreground">
                            {contact.position}{contact.position && contact.company && ' at '}{contact.company}
                          </p>
                          {contact.linkedInUsername && (
                            <a 
                              href={`https://linkedin.com/in/${contact.linkedInUsername}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-primary hover:underline"
                            >
                              <Linkedin size={16} className="mr-1" />
                              linkedin.com/in/{contact.linkedInUsername}
                            </a>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {contact.tags.map(tag => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={18} className="text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p>{contact.email}</p>
                            </div>
                          </div>
                        )}
                        
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={18} className="text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Phone</p>
                              <p>{contact.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        {contact.company && (
                          <div className="flex items-center gap-2">
                            <Building size={18} className="text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Company</p>
                              <p>{contact.company}</p>
                            </div>
                          </div>
                        )}
                        
                        {contact.position && (
                          <div className="flex items-center gap-2">
                            <User size={18} className="text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Position</p>
                              <p>{contact.position}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Last Contact</p>
                            <p>{formatDate(contact.lastContactDate)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Next Contact</p>
                            <p>{formatDate(contact.nextContactDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-6 animate-slide-up">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Add a New Note</CardTitle>
                  <CardDescription>Record your interactions with {contact.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="note-date">Date</Label>
                        <Input
                          id="note-date"
                          name="date"
                          type="date"
                          value={newNote.date}
                          onChange={handleNewNoteChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="note-type">Interaction Type</Label>
                        <Select 
                          value={newNote.type} 
                          onValueChange={(value) => 
                            setNewNote({...newNote, type: value as 'meeting' | 'call' | 'email' | 'other'})
                          }
                        >
                          <SelectTrigger id="note-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="note-location">Location (Optional)</Label>
                      <Input
                        id="note-location"
                        name="location"
                        placeholder="Where did you meet?"
                        value={newNote.location || ''}
                        onChange={handleNewNoteChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Topics Discussed</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newNote.topics?.map(topic => (
                          <Badge 
                            key={topic} 
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleRemoveNoteTopic(topic)}
                          >
                            {topic}
                            <span className="ml-1">×</span>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a topic..."
                          value={newNoteTopicInput}
                          onChange={(e) => setNewNoteTopicInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNoteTopic();
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          onClick={handleAddNoteTopic}
                          type="button"
                        >
                          <Plus size={18} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="note-content">Note Content</Label>
                      <Textarea
                        id="note-content"
                        name="content"
                        placeholder="What did you discuss? What follow-up is needed?"
                        rows={5}
                        value={newNote.content}
                        onChange={handleNewNoteChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNote}>Save Note</Button>
                </CardFooter>
              </Card>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Previous Notes</h3>
                
                {contact.notes.length > 0 ? (
                  <div className="space-y-4">
                    {[...contact.notes]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(note => (
                        <Card key={note.id} className="glass-card">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">
                                  <span className="capitalize">{note.type}</span> on {formatDate(note.date)}
                                </CardTitle>
                                {note.location && (
                                  <CardDescription>Location: {note.location}</CardDescription>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="whitespace-pre-line">{note.content}</p>
                            
                            {note.topics && note.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {note.topics.map(topic => (
                                  <Badge key={topic} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">No notes yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="animate-slide-up">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Contact Timeline</CardTitle>
                  <CardDescription>View the history of your interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add a timeline here in a future enhancement */}
                  <div className="text-center py-12 text-muted-foreground">
                    Timeline functionality coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full lg:w-80">
          <Card className="glass-card sticky top-6">
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
              <CardDescription>Stay in touch with {contact.name.split(' ')[0]}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Next Contact</Label>
                  {contact.nextContactDate && isEditMode && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        if (editedContact && editedContact.lastContactDate) {
                          const nextDate = calculateNextContactDate(editedContact.lastContactDate);
                          setEditedContact({
                            ...editedContact,
                            nextContactDate: nextDate
                          });
                        }
                      }}
                    >
                      Auto-calculate
                    </Button>
                  )}
                </div>
                <div className="p-3 bg-muted/30 rounded-md flex items-center gap-2">
                  <Calendar size={18} className="text-muted-foreground" />
                  <span>{formatDate(contact.nextContactDate)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Last Contact</Label>
                <div className="p-3 bg-muted/30 rounded-md flex items-center gap-2">
                  <Clock size={18} className="text-muted-foreground" />
                  <span>{formatDate(contact.lastContactDate)}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  Mark as Contacted Today
                </Button>
              </div>
              
              <div className="pt-2">
                <Button className="w-full">
                  Set Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
