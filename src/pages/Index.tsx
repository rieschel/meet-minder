
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact, getContacts, getContactsDueForFollowUp } from '@/utils/storage';
import { sortContactsByDate } from '@/utils/dateUtils';
import { UserPlus, Users, Calendar, Settings, ArrowRight, Linkedin } from 'lucide-react';
import ContactCard from '@/components/ContactCard';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [followUpContacts, setFollowUpContacts] = useState<Contact[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load contacts
    const contacts = getContacts();
    const sortedByRecent = sortContactsByDate(contacts, 'lastContactDate', false).slice(0, 3);
    const followUps = getContactsDueForFollowUp().slice(0, 3);
    
    setRecentContacts(sortedByRecent);
    setFollowUpContacts(followUps);
    setTotalContacts(contacts.length);
  }, []);
  
  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your professional network
            </p>
          </div>
          
          <Button onClick={() => navigate('/contacts/new')}>
            <UserPlus size={16} className="mr-2" />
            Add Contact
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalContacts}</div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <Link to="/contacts" className="text-primary text-sm mt-4 inline-flex items-center hover:underline">
                View all contacts
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Pending Follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{followUpContacts.length}</div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <Link to="/notifications" className="text-primary text-sm mt-4 inline-flex items-center hover:underline">
                View all reminders
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">LinkedIn Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">0</div>
                <Linkedin className="h-8 w-8 text-muted-foreground" />
              </div>
              <Link to="/settings" className="text-primary text-sm mt-4 inline-flex items-center hover:underline">
                Manage integrations
                <ArrowRight size={14} className="ml-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Contacts</CardTitle>
                <Link to="/contacts">
                  <Button variant="ghost" className="h-8 px-2 text-sm">
                    View All
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <CardDescription>
                People you've recently interacted with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContacts.length > 0 ? (
                  recentContacts.map(contact => (
                    <ContactCard 
                      key={contact.id} 
                      contact={contact} 
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No contacts yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/contacts/new')}
                    >
                      Add Your First Contact
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Follow-up Reminders</CardTitle>
                <Link to="/notifications">
                  <Button variant="ghost" className="h-8 px-2 text-sm">
                    View All
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Contacts you should reach out to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {followUpContacts.length > 0 ? (
                  followUpContacts.map(contact => (
                    <ContactCard 
                      key={contact.id} 
                      contact={contact} 
                      onClick={() => navigate(`/contacts/${contact.id}`)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No pending follow-ups</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Setup Guide</CardTitle>
            <CardDescription>
              Get started with your personal networking CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="bg-muted/40 p-3 rounded-full inline-flex">
                  <UserPlus size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold">1. Add Your Contacts</h3>
                <p className="text-sm text-muted-foreground">
                  Start by adding your professional contacts with their details and notes from your meetings.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-muted/40 p-3 rounded-full inline-flex">
                  <Calendar size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold">2. Set Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule when you want to follow up with each contact to maintain your relationships.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-muted/40 p-3 rounded-full inline-flex">
                  <Linkedin size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold">3. Connect LinkedIn</h3>
                <p className="text-sm text-muted-foreground">
                  Add LinkedIn profiles to keep track of your connections' career updates.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
