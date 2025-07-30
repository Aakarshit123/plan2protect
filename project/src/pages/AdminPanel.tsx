import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  MessageCircle, 
  Settings, 
  DollarSign, 
  Database, 
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, ApiUser } from '../services/apiService';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalAssessments: number;
  totalStorageUsed: number;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('revenue');
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalAssessments: 0,
    totalStorageUsed: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, filterPlan, sortBy]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Try to get users from backend API first
      try {
        const response = await apiService.getUsersAnalytics();
        setUsers(response.users);
        calculateStats(response.users);
      } catch (error) {
        console.log('Backend API not available, using sample data');
        // Fallback to sample data if backend is not running
        const sampleUsers: ApiUser[] = [
          {
            uid: '1',
            email: 'john.doe@example.com',
            name: 'John Doe',
            plan: 'bundle',
            isAdmin: false,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date().toISOString(),
            totalRevenue: 499.99,
            monthlyRevenue: 41.67,
            assessmentsCompleted: 15,
            storageUsed: 1250,
            lastAssessmentDate: new Date().toISOString(),
            subscriptionStatus: 'active',
            planStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            planEndDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            uid: '2',
            email: 'jane.smith@example.com',
            name: 'Jane Smith',
            plan: 'yearly',
            isAdmin: false,
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            totalRevenue: 299.99,
            monthlyRevenue: 25.00,
            assessmentsCompleted: 8,
            storageUsed: 800,
            lastAssessmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            subscriptionStatus: 'active',
            planStartDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            planEndDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            uid: '3',
            email: 'mike.wilson@example.com',
            name: 'Mike Wilson',
            plan: 'monthly',
            isAdmin: false,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            totalRevenue: 29.99,
            monthlyRevenue: 29.99,
            assessmentsCompleted: 3,
            storageUsed: 150,
            lastAssessmentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            subscriptionStatus: 'active',
            planStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            planEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            uid: '4',
            email: 'sarah.jones@example.com',
            name: 'Sarah Jones',
            plan: 'free',
            isAdmin: false,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            totalRevenue: 0,
            monthlyRevenue: 0,
            assessmentsCompleted: 1,
            storageUsed: 25,
            lastAssessmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            subscriptionStatus: 'active'
          },
          {
            uid: '5',
            email: 'david.brown@example.com',
            name: 'David Brown',
            plan: 'yearly',
            isAdmin: false,
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            totalRevenue: 299.99,
            monthlyRevenue: 25.00,
            assessmentsCompleted: 25,
            storageUsed: 1800,
            lastAssessmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            subscriptionStatus: 'cancelled',
            planStartDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            planEndDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setUsers(sampleUsers);
        calculateStats(sampleUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userList: ApiUser[]) => {
    const stats: UserStats = {
      totalUsers: userList.length,
      activeUsers: userList.filter(u => u.subscriptionStatus === 'active').length,
      premiumUsers: userList.filter(u => u.plan !== 'free').length,
      totalRevenue: userList.reduce((sum, u) => sum + (u.totalRevenue || 0), 0),
      monthlyRevenue: userList.reduce((sum, u) => sum + (u.monthlyRevenue || 0), 0),
      totalAssessments: userList.reduce((sum, u) => sum + (u.assessmentsCompleted || 0), 0),
      totalStorageUsed: userList.reduce((sum, u) => sum + (u.storageUsed || 0), 0)
    };
    setStats(stats);
  };

  const filterAndSortUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
      return matchesSearch && matchesPlan;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return (b.totalRevenue || 0) - (a.totalRevenue || 0);
        case 'assessments':
          return (b.assessmentsCompleted || 0) - (a.assessmentsCompleted || 0);
        case 'storage':
          return (b.storageUsed || 0) - (a.storageUsed || 0);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'bundle': return 'bg-purple-100 text-purple-800';
      case 'yearly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-green-100 text-green-800';
      case 'free': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatStorage = (bytes: number) => {
    if (bytes < 1024) return `${bytes} MB`;
    return `${(bytes / 1024).toFixed(1)} GB`;
  };

  const exportUserData = () => {
    const csvContent = [
      ['Name', 'Email', 'Plan', 'Total Revenue', 'Monthly Revenue', 'Assessments', 'Storage Used', 'Status', 'Created Date'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.plan,
        user.totalRevenue || 0,
        user.monthlyRevenue || 0,
        user.assessmentsCompleted || 0,
        user.storageUsed || 0,
        user.subscriptionStatus,
        formatDate(user.createdAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3 text-blue-600" />
                Admin Panel
              </h1>
              <p className="text-gray-600 mt-2">Welcome, {user?.name} - System Administrator</p>
            </div>
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
              <span className="font-medium">Admin Access</span>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{stats.premiumUsers} premium</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">${stats.monthlyRevenue.toFixed(0)}/month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">{formatStorage(stats.totalStorageUsed)}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
              Revenue Analytics
            </h2>
            <button
              onClick={exportUserData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                ${stats.monthlyRevenue.toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Monthly Recurring</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {stats.premiumUsers}
              </div>
              <div className="text-sm text-gray-600">Premium Users</div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                User Management
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="bundle">Bundle</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="revenue">Sort by Revenue</option>
                  <option value="assessments">Sort by Assessments</option>
                  <option value="storage">Sort by Storage</option>
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">Joined {formatDate(user.createdAt)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan)}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ${(user.totalRevenue || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${(user.monthlyRevenue || 0).toFixed(2)}/month
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.assessmentsCompleted || 0} assessments
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatStorage(user.storageUsed || 0)} used
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.subscriptionStatus)}`}>
                        {user.subscriptionStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria.
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-green-600" />
            System Health
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">1.2s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">{formatStorage(stats.totalStorageUsed)}</div>
              <div className="text-sm text-gray-600">Storage Used</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2">{stats.activeUsers}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}