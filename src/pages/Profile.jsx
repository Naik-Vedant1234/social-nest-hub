
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { fetchUserProfile, followUser } from '../utils/api';
import { Grid, List, Image as ImageIcon, Video, UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const [viewMode, setViewMode] = useState('grid');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Get user's posts
  const fetchUserPosts = async (userId) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        likes:likes (user_id),
        comments:comments (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  };
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchUserProfile(username),
    enabled: !!username,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', profile?.id],
    queryFn: () => fetchUserPosts(profile?.id),
    enabled: !!profile?.id,
  });
  
  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', username]);
      toast.success(`You ${isFollowing ? 'unfollowed' : 'followed'} ${username}`);
    },
    onError: (error) => {
      toast.error('Failed to update follow status');
      console.error(error);
    },
  });
  
  const isCurrentUser = user && profile && user.id === profile.id;
  const isFollowing = profile?.followers?.some(follower => follower.follower_id === user?.id);
  
  const isLoading = profileLoading || postsLoading;
  
  const handleFollow = async () => {
    if (!user) {
      toast.error('You must be logged in to follow users');
      return;
    }
    
    if (isCurrentUser) {
      return;
    }
    
    followMutation.mutate(profile.id);
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
                  src={profile?.avatar_url || 'https://via.placeholder.com/150'} 
                  alt={profile?.username} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                />
                
                {/* Profile Info */}
                <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <h1 className="text-2xl font-bold mr-4">{profile?.username}</h1>
                    {!isCurrentUser && (
                      <button 
                        className={`mt-2 md:mt-0 flex items-center space-x-1 px-4 py-1 rounded-md ${
                          isFollowing
                            ? 'bg-gray-200 dark:bg-gray-800 text-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                        onClick={handleFollow}
                      >
                        {isFollowing ? (
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
                    )}
                  </div>
                  
                  <div className="flex justify-center md:justify-start space-x-6 mb-4">
                    <div>
                      <span className="font-bold">{posts?.length || 0}</span> posts
                    </div>
                    <div>
                      <span className="font-bold">{profile?.followersCount || 0}</span> followers
                    </div>
                    <div>
                      <span className="font-bold">{profile?.followingCount || 0}</span> following
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-md font-medium">{profile?.full_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.bio || 'No bio yet.'}</p>
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
                    activeTab === 'saved' ? 'text-primary border-b-2 border-primary' : ''
                  }`}
                  onClick={() => setActiveTab('saved')}
                >
                  Saved
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
              {activeTab === 'posts' && (
                <>
                  {posts?.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        No posts to show yet.
                      </p>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-3 gap-1">
                      {posts?.map((post) => (
                        <div key={post.id} className="aspect-square relative group overflow-hidden">
                          <img 
                            src={post.image_url || 'https://via.placeholder.com/300?text=Post'} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <div className="flex items-center text-white">
                              <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                              </svg>
                              {post.likes?.length || 0}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {posts?.map((post) => (
                        <div key={post.id} className="p-4 flex space-x-4">
                          <div className="w-24 h-24 flex-shrink-0">
                            <img 
                              src={post.image_url || 'https://via.placeholder.com/300?text=Post'} 
                              alt="" 
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <p className="line-clamp-2 mb-1">{post.content}</p>
                            <div className="flex space-x-4 mb-1">
                              <span className="flex items-center text-sm">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                </svg>
                                {post.likes?.length || 0} likes
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Posted {new Date(post.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'saved' && (
                <div className="p-8 text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Saved posts feature coming soon.
                  </p>
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
