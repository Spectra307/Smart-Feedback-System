import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, GraduationCap } from "lucide-react";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import FacultyDashboard from "@/components/dashboard/FacultyDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("student");

  const { data: userRole } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      return data?.role || 'student';
    },
    enabled: !!user,
  });

  const isAdmin = userRole === 'admin';
  const isFaculty = userRole === 'faculty';

  const getPortalTitle = () => {
    if (isAdmin) return "Administrator Dashboard";
    if (isFaculty) return "Faculty Portal";
    return "Student Portal";
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Faculty Feedback System</h1>
              <p className="text-sm text-muted-foreground">
                {getPortalTitle()}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isAdmin ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="student">Student View</TabsTrigger>
              <TabsTrigger value="admin">Admin Panel</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <StudentDashboard />
            </TabsContent>
            <TabsContent value="admin">
              <AdminDashboard />
            </TabsContent>
          </Tabs>
        ) : isFaculty ? (
          <FacultyDashboard />
        ) : (
          <StudentDashboard />
        )}
      </main>
    </div>
  );
};

export default Dashboard;