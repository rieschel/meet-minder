
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Contact, getContacts } from '@/utils/storage';
import { sortContactsByDate } from '@/utils/dateUtils';
import ContactCard from './ContactCard';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, User } from 'lucide-react';

const ContactList = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastContactDate-desc');
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadContacts = () => {
      const allContacts = getContacts();
      setContacts(allContacts);
    };
    
    loadContacts();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', loadContacts);
    
    return () => {
      window.removeEventListener('storage', loadContacts);
    };
  }, []);
  
  const handleContactClick = (id: string) => {
    navigate(`/contacts/${id}`);
  };
  
  const filterContacts = (data: Contact[]) => {
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(contact => 
      contact.name.toLowerCase().includes(term) ||
      (contact.company && contact.company.toLowerCase().includes(term)) ||
      (contact.position && contact.position.toLowerCase().includes(term)) ||
      contact.tags.some(tag => tag.toLowerCase().includes(term))
    );
  };
  
  const sortContacts = (data: Contact[]) => {
    const [field, direction] = sortBy.split('-');
    const ascending = direction === 'asc';
    
    if (field === 'name') {
      return [...data].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return ascending 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      });
    }
    
    if (field === 'company') {
      return [...data].sort((a, b) => {
        const companyA = (a.company || '').toLowerCase();
        const companyB = (b.company || '').toLowerCase();
        return ascending 
          ? companyA.localeCompare(companyB) 
          : companyB.localeCompare(companyA);
      });
    }
    
    // Date fields
    return sortContactsByDate(data, field as string, ascending);
  };
  
  const filteredAndSortedContacts = sortContacts(filterContacts(contacts));
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 sticky top-4 z-10 p-2 glass-card rounded-lg">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <ArrowUpDown size={18} className="text-muted-foreground" />
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastContactDate-desc">Recent Contact ↓</SelectItem>
              <SelectItem value="lastContactDate-asc">Recent Contact ↑</SelectItem>
              <SelectItem value="nextContactDate-asc">Follow-up Date ↑</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="company-asc">Company A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredAndSortedContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
          {filteredAndSortedContacts.map(contact => (
            <ContactCard 
              key={contact.id} 
              contact={contact} 
              onClick={() => handleContactClick(contact.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-scale-in">
          <div className="bg-muted/40 p-5 rounded-full mb-4">
            <User size={36} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? "No contacts match your search criteria" 
              : "Start adding contacts to your network"}
          </p>
          <Button onClick={() => navigate('/contacts/new')}>
            Add Your First Contact
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactList;
