
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  // Sample settings state - in a real app, these would be stored in localStorage or a backend
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    followUpInterval: "30",
    exportContacts: false,
    syncLinkedIn: true,
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to localStorage or a backend
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully."
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your application preferences and account settings.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how and when you'd like to be reminded about your contacts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Enable notifications</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="followUpInterval">Default follow-up interval</Label>
              <Select
                value={settings.followUpInterval}
                onValueChange={(value) => setSettings({ ...settings, followUpInterval: value })}
              >
                <SelectTrigger id="followUpInterval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">6 months</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark mode</Label>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Connect with third-party services to enhance your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="syncLinkedIn">Sync with LinkedIn</Label>
              <Switch
                id="syncLinkedIn"
                checked={settings.syncLinkedIn}
                onCheckedChange={(checked) => setSettings({ ...settings, syncLinkedIn: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="exportContacts">Export contacts</Label>
              <Switch
                id="exportContacts"
                checked={settings.exportContacts}
                onCheckedChange={(checked) => setSettings({ ...settings, exportContacts: checked })}
              />
            </div>

            <Separator className="my-4" />
            
            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
