
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { UserPlus, UserCheck, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Followers = () => {
  const [activeTab, setActiveTab] = useState('followers');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const { data: followers, isLoading: followersLoading } = useQuery({
    queryKey: ['followers', user?._id],
    queryFn: () => fetchFollowers(user?._id),
    enabled: !!user,
  });

  const { data: following, isLoading: followingLoading } = useQuery({
    queryKey: ['following', user?._id],
    queryFn: () => fetchFollowing(user?._id),
    enabled: !!user,
  });

  const fetchFollowers = async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/followers`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch followers');
    }
  };

  const fetchFollowing = async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}/following`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch following');
    }
  };

  const handleFollow = async (userId) => {
    try {
      // In a real app, toggle the follow status
      // await api.post(`/api/users/${userId}/follow`);
      console.log(`Followed user ${userId}`);
    } catch (error) {
      console.error('Failed to follow user');
    }
  };

  // Mock data for demonstration
  const mockFollowers = Array(15).fill(null).map((_, index) => ({
    _id: `follower${index}`,
    username: `user${index}`,
    name: `User ${index}`,
    profilePicture: `https://via.placeholder.com/40?text=F${index}`,
    isFollowing: index % 3 === 0
  }));

  const mockFollowing = Array(10).fill(null).map((_, index) => ({
    _id: `following${index}`,
    username: `friend${index}`,
    name: `Friend ${index}`,
    profilePicture: `https://via.placeholder.com/40?text=F${index}`,
    isFollowing: true
  }));

  const isLoading = followersLoading || followingLoading;
  
  const activeData = activeTab === 'followers' 
    ? followers?.data || mockFollowers 
    : following?.data || mockFollowing;

  // Filter by search query if present
  const filteredData = searchQuery 
    ? activeData.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeData;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Connections</h1>
        
        <div className="bg-card rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border">
            <button 
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'followers' ? 'text-primary border-b-2 border-primary' : ''
              }`}
              onClick={() => setActiveTab('followers')}
            >
              Followers
            </button>
            <button 
              className={`flex-1 py-3 px-4 text-center font-medium ${
                activeTab === 'following' ? 'text-primary border-b-2 border-primary' : ''
              }`}
              onClick={() => setActiveTab('following')}
            >
              Following
            </button>
          </div>
          
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 input w-full"
              />
            </div>
          </div>
          
          {/* User List */}
          {isLoading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery 
                  ? 'No users found matching your search' 
                  : `You don't have any ${activeTab} yet`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredData.map((user) => (
                <div key={user._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={user.profilePicture} 
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.name}</p>
                    </div>
                  </div>
                  
                  <button 
                    className={`flex items-center space-x-1 px-4 py-1 rounded-md text-sm ${
                      user.isFollowing
                        ? 'bg-gray-200 dark:bg-gray-800 text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                    onClick={() => handleFollow(user._id)}
                  >
                    {user.isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Followers;
