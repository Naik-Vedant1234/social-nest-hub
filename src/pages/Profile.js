
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import api from '../utils/api';
import { Grid, List, Image as ImageIcon, Video, UserPlus, UserCheck } from 'lucide-react';

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const [viewMode, setViewMode] = useState('grid');
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchUserProfile(username),
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', username, activeTab],
    queryFn: () => fetchUserContent(username, activeTab),
  });

  const fetchUserProfile = async (username) => {
    try {
      const response = await api.get(`/api/users/${username}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  };

  const fetchUserContent = async (username, type) => {
    try {
      const endpoint = type === 'posts' ? 'posts' : 'reels';
      const response = await api.get(`/api/users/${username}/${endpoint}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user ${type}`);
    }
  };

  // Mock data for demonstration purposes
  const mockProfile = {
    _id: 'user1',
    username: username || 'johndoe',
    name: 'John Doe',
    profilePicture: 'https://via.placeholder.com/150',
    bio: 'Developer | Photographer | Coffee Lover',
    postsCount: 42,
    followersCount: 1024,
    followingCount: 256,
    isFollowing: false
  };

  const mockPosts = Array(9).fill(null).map((_, index) => ({
    _id: `post${index}`,
    image: `https://via.placeholder.com/300?text=Post${index + 1}`,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
    type: index % 5 === 0 ? 'video' : 'image'
  }));

  const mockReels = Array(4).fill(null).map((_, index) => ({
    _id: `reel${index}`,
    thumbnail: `https://via.placeholder.com/300?text=Reel${index + 1}`,
    views: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 100),
    type: 'video'
  }));

  const userData = profile || mockProfile;
  const contentData = posts?.data || (activeTab === 'posts' ? mockPosts : mockReels);
  const isLoading = profileLoading || postsLoading;

  const handleFollow = async () => {
    try {
      // In a real app, toggle the follow status
      // await api.post(`/api/users/${userData._id}/follow`);
      console.log(`Followed ${userData.username}`);
    } catch (error) {
      console.error('Failed to follow user');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="bg-card rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center">
                {/* Profile Image */}
                <img 
                  src={userData.profilePicture} 
                  alt={userData.username} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                />
                
                {/* Profile Info */}
                <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <h1 className="text-2xl font-bold mr-4">{userData.username}</h1>
                    <button 
                      className={`mt-2 md:mt-0 flex items-center space-x-1 px-4 py-1 rounded-md ${
                        userData.isFollowing
                          ? 'bg-gray-200 dark:bg-gray-800 text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                      onClick={handleFollow}
                    >
                      {userData.isFollowing ? (
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
                  
                  <div className="flex justify-center md:justify-start space-x-6 mb-4">
                    <div>
                      <span className="font-bold">{userData.postsCount}</span> posts
                    </div>
                    <div>
                      <span className="font-bold">{userData.followersCount}</span> followers
                    </div>
                    <div>
                      <span className="font-bold">{userData.followingCount}</span> following
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-md font-medium">{userData.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{userData.bio}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content Tabs */}
            <div className="bg-card rounded-lg overflow-hidden">
              <div className="flex border-b border-border">
                <button 
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'posts' ? 'text-primary border-b-2 border-primary' : ''
                  }`}
                  onClick={() => setActiveTab('posts')}
                >
                  Posts
                </button>
                <button 
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'reels' ? 'text-primary border-b-2 border-primary' : ''
                  }`}
                  onClick={() => setActiveTab('reels')}
                >
                  Reels
                </button>
              </div>
              
              {/* View Options */}
              <div className="p-4 border-b border-border flex justify-end">
                <div className="flex space-x-2">
                  <button 
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-secondary' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button 
                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-secondary' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Content Display */}
              {contentData.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    No {activeTab} to show yet.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-1">
                  {contentData.map((item) => (
                    <div key={item._id} className="aspect-square relative group overflow-hidden">
                      <img 
                        src={item.image || item.thumbnail} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                      {item.type === 'video' && (
                        <div className="absolute top-2 right-2">
                          <Video className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <div className="flex items-center text-white">
                          <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                          {item.likes || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {contentData.map((item) => (
                    <div key={item._id} className="p-4 flex space-x-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img 
                          src={item.image || item.thumbnail} 
                          alt="" 
                          className="w-full h-full object-cover rounded-md"
                        />
                        {item.type === 'video' && (
                          <div className="relative bottom-6 left-2">
                            <Video className="w-5 h-5 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex space-x-4 mb-1">
                          <span className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                            {item.likes || 0} likes
                          </span>
                          {activeTab === 'reels' && (
                            <span className="flex items-center text-sm">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {item.views || 0} views
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Posted {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
