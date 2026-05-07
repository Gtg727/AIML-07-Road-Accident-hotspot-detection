import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  Settings,
  LogOut,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

export const B2BDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_analyses: 0,
    total_alerts: 0,
    active_reports: 0,
    api_calls: 0,
  });

  useEffect(() => {
    // Load team members and stats
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      // Fetch team members
      const teamResponse = await fetch('http://localhost:5000/api/b2b/team', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (teamResponse.ok) {
        const team = await teamResponse.json();
        setTeamMembers(team);
      }

      // Fetch stats
      const statsResponse = await fetch('http://localhost:5000/api/b2b/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load team data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/b2b/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">B2B Portal</h1>
              <p className="text-sm text-gray-500">{user.company_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </p>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users size={16} />
              Team
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Building2 size={16} />
              Company
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Analyses</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.total_analyses}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <TrendingUp className="text-blue-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Active Alerts</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.total_alerts}
                      </p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <AlertCircle className="text-red-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Active Reports</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.active_reports}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CheckCircle2 className="text-green-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">API Calls</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {stats.api_calls}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <BarChart3 className="text-purple-600" size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access key features and data</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start" onClick={() => navigate('/')}>
                  View Hotspot Analysis
                </Button>
                <Button variant="outline" className="justify-start">
                  Download Reports
                </Button>
                <Button variant="outline" className="justify-start">
                  API Documentation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your team and access permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No team members added yet. You can add team members from settings.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Team Member</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => setActiveTab('settings')}>
                  Manage in Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile/Company Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {user.company_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Company Type</p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {user.company_type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employees</p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {user.employees_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact Person</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-lg font-medium text-gray-900">
                          {user.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={18} />
                    Address
                  </h3>
                  <div className="text-gray-900 space-y-1">
                    <p>{user.address}</p>
                    <p>
                      {user.city}, {user.state} {user.postal_code}
                    </p>
                    <p>{user.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Edit Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setActiveTab('settings')} className="w-full">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API access and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Your API Key</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 p-2 rounded text-sm font-mono text-gray-900">
                      {import.meta.env.VITE_API_KEY || 'API_KEY_NOT_CONFIGURED'}
                    </code>
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Generate New Key
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Control how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Email Alerts</p>
                      <p className="text-sm text-gray-500">Receive alerts via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Weekly Reports</p>
                      <p className="text-sm text-gray-500">Get weekly summary reports</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default B2BDashboard;
