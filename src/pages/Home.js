
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import Layout from '../components/Layout';
import { MessageCircle, Heart, Share2, Bookmark } from 'lucide-react';
import { toast } from 'sonner';

const Home = () => {
  const [page, setPage] = useState(1);
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
  });

  const fetchPosts = async (pageNum) => {
    try {
      const response = await api.get(`/api/posts?page=${pageNum}&limit=10`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch posts');
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/like`);
      toast.success('Post liked!');
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  // Mock data for demonstration (will be replaced with actual API data)
  const mockPosts = [
    {
      _id: '1',
      user: {
        _id: 'user1',
        username: 'johndoe',
        profilePicture: 'https://via.placeholder.com/40'
      },
      content: 'Just launched my new website! Check it out at example.com #webdev #programming',
      image: 'https://via.placeholder.com/600x400',
      likes: 42,
      comments: 8,
      createdAt: '2023-04-05T12:00:00.000Z'
    },
    {
      _id: '2',
      user: {
        _id: 'user2',
        username: 'janedoe',
        profilePicture: 'https://via.placeholder.com/40'
      },
      content: 'Beautiful sunset at the beach today! #nature #sunset #peace',
      image: 'https://via.placeholder.com/600x400',
      likes: 128,
      comments: 24,
      createdAt: '2023-04-04T18:30:00.000Z'
    },
    {
      _id: '3',
      user: {
        _id: 'user3',
        username: 'techguru',
        profilePicture: 'https://via.placeholder.com/40'
      },
      content: 'Just got the new gadget everyone's been talking about. Initial thoughts: it's amazing! #tech #review',
      image: 'https://via.placeholder.com/600x400',
      likes: 76,
      comments: 15,
      createdAt: '2023-04-03T09:15:00.000Z'
    }
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
        
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 my-8">
            Failed to load posts. Please try again.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Use either the actual posts data or mock data */}
            {(posts?.data || mockPosts).map((post) => (
              <div key={post._id} className="card overflow-hidden">
                {/* Post header */}
                <div className="p-4 flex items-center space-x-3 border-b border-border">
                  <img 
                    src={post.user.profilePicture} 
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{post.user.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Post image */}
                {post.image && (
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="w-full object-cover max-h-[500px]"
                  />
                )}

                {/* Post content */}
                <div className="p-4">
                  <p className="mb-4">{post.content}</p>
                  
                  {/* Interaction buttons */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-4">
                      <button 
                        className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        onClick={() => handleLike(post._id)}
                      >
                        <Heart className="w-5 h-5" />
                        <span>{post.likes}</span>
                      </button>
                      
                      <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                      
                      <button className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {posts?.totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button 
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                
                <button 
                  onClick={() => setPage(prev => Math.min(prev + 1, posts.totalPages))}
                  disabled={page === posts.totalPages}
                  className="px-4 py-2 border border-border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
