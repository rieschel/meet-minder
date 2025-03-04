
export interface Contact {
  id: string;
  name: string;
  linkedInUrl?: string;
  linkedInUsername?: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  lastContactDate?: string;
  nextContactDate?: string;
  notes: Note[];
  tags: string[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  date: string;
  type: 'meeting' | 'call' | 'email' | 'other';
  location?: string;
  topics?: string[];
}

const STORAGE_KEY = 'personal-networking-crm';

export const defaultContacts: Contact[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    linkedInUrl: 'https://linkedin.com/in/alexjohnson',
    linkedInUsername: 'alexjohnson',
    email: 'alex@example.com',
    company: 'TechCorp',
    position: 'Product Manager',
    lastContactDate: '2023-05-15',
    nextContactDate: '2023-08-15',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    notes: [
      {
        id: '1-1',
        content: 'Met at TechConf 2023. Discussed potential collaboration on new product launch.',
        date: '2023-05-15',
        type: 'meeting',
        location: 'San Francisco',
        topics: ['product launch', 'collaboration']
      }
    ],
    tags: ['tech', 'product'],
    createdAt: '2023-01-10',
    updatedAt: '2023-05-15'
  },
  {
    id: '2',
    name: 'Samantha Lee',
    linkedInUrl: 'https://linkedin.com/in/samanthaleee',
    linkedInUsername: 'samanthaleee',
    email: 'sam@example.com',
    company: 'DesignStudio',
    position: 'Creative Director',
    lastContactDate: '2023-06-20',
    nextContactDate: '2023-09-20',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    notes: [
      {
        id: '2-1',
        content: 'Coffee meeting. She offered to introduce me to her network in the design industry.',
        date: '2023-06-20',
        type: 'meeting',
        location: 'Downtown Cafe',
        topics: ['design industry', 'networking']
      }
    ],
    tags: ['design', 'creative'],
    createdAt: '2023-02-15',
    updatedAt: '2023-06-20'
  },
  {
    id: '3',
    name: 'Michael Zhang',
    linkedInUrl: 'https://linkedin.com/in/michaelzhang',
    linkedInUsername: 'michaelzhang',
    email: 'michael@example.com',
    company: 'Investors Ltd',
    position: 'Angel Investor',
    lastContactDate: '2023-03-10',
    nextContactDate: '2023-07-10',
    profileImage: 'https://randomuser.me/api/portraits/men/67.jpg',
    notes: [
      {
        id: '3-1',
        content: 'Pitch meeting. Interested in our SaaS product, requested more financial projections.',
        date: '2023-03-10',
        type: 'meeting',
        location: 'Virtual Call',
        topics: ['investment', 'pitch', 'financials']
      }
    ],
    tags: ['investor', 'finance'],
    createdAt: '2022-11-05',
    updatedAt: '2023-03-10'
  }
];

export const getContacts = (): Contact[] => {
  const contacts = localStorage.getItem(STORAGE_KEY);
  if (!contacts) {
    // Initialize with some sample data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContacts));
    return defaultContacts;
  }
  return JSON.parse(contacts);
};

export const saveContacts = (contacts: Contact[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

export const addContact = (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact => {
  const contacts = getContacts();
  const now = new Date().toISOString();
  const newContact: Contact = {
    ...contact,
    id: Date.now().toString(),
    notes: contact.notes || [],
    tags: contact.tags || [],
    createdAt: now,
    updatedAt: now
  };
  
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
};

export const updateContact = (contact: Contact): Contact => {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === contact.id);
  
  if (index !== -1) {
    const updatedContact = {
      ...contact,
      updatedAt: new Date().toISOString()
    };
    contacts[index] = updatedContact;
    saveContacts(contacts);
    return updatedContact;
  }
  
  throw new Error(`Contact with ID ${contact.id} not found`);
};

export const deleteContact = (id: string): void => {
  const contacts = getContacts();
  const updatedContacts = contacts.filter(c => c.id !== id);
  saveContacts(updatedContacts);
};

export const addNote = (contactId: string, note: Omit<Note, 'id'>): Note => {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === contactId);
  
  if (index !== -1) {
    const newNote: Note = {
      ...note,
      id: Date.now().toString()
    };
    
    contacts[index].notes.push(newNote);
    contacts[index].updatedAt = new Date().toISOString();
    
    // Update lastContactDate if this note's date is more recent
    if (!contacts[index].lastContactDate || 
        new Date(note.date) > new Date(contacts[index].lastContactDate)) {
      contacts[index].lastContactDate = note.date;
    }
    
    saveContacts(contacts);
    return newNote;
  }
  
  throw new Error(`Contact with ID ${contactId} not found`);
};

export const getContact = (id: string): Contact | undefined => {
  const contacts = getContacts();
  return contacts.find(c => c.id === id);
};

export const getContactsDueForFollowUp = (): Contact[] => {
  const contacts = getContacts();
  const today = new Date();
  
  return contacts.filter(contact => {
    if (!contact.nextContactDate) return false;
    const nextContactDate = new Date(contact.nextContactDate);
    return nextContactDate <= today;
  });
};
