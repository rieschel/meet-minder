
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contact, addContact } from '@/utils/storage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { calculateNextContactDate } from '@/utils/dateUtils';
import { Plus } from 'lucide-react';

const AddContactForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    linkedInUrl: '',
    linkedInUsername: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    lastContactDate: new Date().toISOString().split('T')[0],
    notes: [],
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special case for LinkedIn URL to extract username
    if (name === 'linkedInUrl' && value.includes('linkedin.com/in/')) {
      const username = value.split('linkedin.com/in/')[1].split('/')[0].split('?')[0];
      setNewContact({
        ...newContact,
        linkedInUrl: value,
        linkedInUsername: username
      });
    } else {
      setNewContact({
        ...newContact,
        [name]: value
      });
    }
    
    // Auto-calculate next contact date when last contact date changes
    if (name === 'lastContactDate') {
      setNewContact({
        ...newContact,
        lastContactDate: value,
        nextContactDate: calculateNextContactDate(value)
      });
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !newContact.tags.includes(tagInput.trim())) {
      setNewContact({
        ...newContact,
        tags: [...newContact.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setNewContact({
      ...newContact,
      tags: newContact.tags.filter(t => t !== tag)
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContact.name.trim()) {
      toast.error('Contact name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const contact = addContact(newContact);
      toast.success('Contact added successfully!');
      navigate(`/contacts/${contact.id}`);
    } catch (error) {
      toast.error('Failed to add contact');
      setIsSubmitting(false);
    }
  };
  
  const handleGenerateRandomAvatar = () => {
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const id = Math.floor(Math.random() * 99) + 1;
    setNewContact({
      ...newContact,
      profileImage: `https://randomuser.me/api/portraits/${gender}/${id}.jpg`
    });
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/contacts')}
            className="glass-card"
          >
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add New Contact</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the contact's details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={newContact.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={newContact.email || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 555 123 4567"
                  value={newContact.phone || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
                <Input
                  id="linkedInUrl"
                  name="linkedInUrl"
                  placeholder="https://linkedin.com/in/username"
                  value={newContact.linkedInUrl || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Acme Inc."
                  value={newContact.company || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Product Manager"
                  value={newContact.position || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Contact Timeline</CardTitle>
            <CardDescription>When did you meet this person?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastContactDate">Last Contact Date</Label>
                <Input
                  id="lastContactDate"
                  name="lastContactDate"
                  type="date"
                  value={newContact.lastContactDate || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextContactDate">Next Contact Date</Label>
                <Input
                  id="nextContactDate"
                  name="nextContactDate"
                  type="date"
                  value={newContact.nextContactDate || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="initialNote">Initial Notes (Optional)</Label>
              <Textarea
                id="initialNote"
                name="initialNote"
                placeholder="How did you meet? What did you discuss? Any key information to remember?"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Tags & Categorization</CardTitle>
            <CardDescription>Add tags to help organize your contacts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newContact.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  onClick={handleAddTag}
                  type="button"
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="profileImage"
                  name="profileImage"
                  placeholder="https://example.com/photo.jpg"
                  value={newContact.profileImage || ''}
                  onChange={handleChange}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleGenerateRandomAvatar}
                  type="button"
                >
                  Generate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate('/contacts')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !newContact.name.trim()}
          >
            {isSubmitting ? 'Adding...' : 'Add Contact'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddContactForm;
