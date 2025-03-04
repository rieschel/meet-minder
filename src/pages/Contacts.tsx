
import Layout from '@/components/Layout';
import ContactList from '@/components/ContactList';

const Contacts = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your professional network
          </p>
        </div>
        
        <ContactList />
      </div>
    </Layout>
  );
};

export default Contacts;
