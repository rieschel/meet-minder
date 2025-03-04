
import Layout from "@/components/Layout";
import { getContactsDueForFollowUp } from "@/utils/storage";
import { formatDistanceToNow } from "date-fns";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const contactsDueForFollowUp = getContactsDueForFollowUp();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground mt-2">
            Contacts that are due for a follow-up based on your reminder settings.
          </p>
        </div>

        {contactsDueForFollowUp.length === 0 ? (
          <Card className="bg-white/60 backdrop-blur-sm border border-border/30">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No reminders</h3>
              <p className="text-muted-foreground">
                You don't have any contacts that need follow-up at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contactsDueForFollowUp.map((contact) => (
              <Card key={contact.id} className="card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    {contact.name}
                  </CardTitle>
                  <CardDescription>
                    {contact.lastContactDate ? (
                      <>Last contacted {formatDistanceToNow(new Date(contact.lastContactDate), { addSuffix: true })}</>
                    ) : (
                      "No recent contact"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end space-x-2">
                    <Link to={`/contacts/${contact.id}`}>
                      <Button variant="secondary" size="sm">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
