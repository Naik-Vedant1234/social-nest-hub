
import React from 'react';
import Layout from '../components/Layout';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Heart, MessageCircle, Share2, MusicNote } from 'lucide-react';

const Reels = () => {
  const { data: reels, isLoading, error } = useQuery({
    queryKey: ['reels'],
    queryFn: () => fetchReels(),
  });

  const fetchReels = async () => {
    try {
      const response = await api.get('/api/reels');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reels');
    }
  };

  // Mock data for demonstration
  const mockReels = [
    {
      _id: '1',
      user: {
        _id: 'user1',
        username: 'johndoe',
        profilePicture: 'https://via.placeholder.com/40'
      },
      video: 'https://example.com/video1.mp4', // In a real app, use actual video URLs
      thumbnail: 'https://via.placeholder.com/400x600',
      caption: 'Check out this cool trick! #amazing #skills',
      likes: 1243,
      comments: 89,
      music: 'Original Sound - johndoe',
      createdAt: '2023-04-05T10:30:00.000Z'
    },
    {
      _id: '2',
      user: {
        _id: 'user2',
        username: 'janedoe',
        profilePicture: 'https://via.placeholder.com/40'
      },
      video: 'https://example.com/video2.mp4',
      thumbnail: 'https://via.placeholder.com/400x600',
      caption: 'Beautiful sunset views #sunset #travel',
      likes: 2891,
      comments: 152,
      music: 'Popular Song - Famous Artist',
      createdAt: '2023-04-04T15:20:00.000Z'
    },
    {
      _id: '3',
      user: {
        _id: 'user3',
        username: 'techguru',
        profilePicture: 'https://via.placeholder.com/40'
      },
      video: 'https://example.com/video3.mp4',
      thumbnail: 'https://via.placeholder.com/400x600',
      caption: 'Tech tips and tricks #tech #tutorial',
      likes: 874,
      comments: 63,
      music: 'Trending Sound - techguru',
      createdAt: '2023-04-03T09:15:00.000Z'
    }
  ];

  const reelsData = reels?.data || mockReels;

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Reels</h1>
        
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 my-8">
            Failed to load reels. Please try again.
          </div>
        ) : (
          <div className="space-y-6">
            {reelsData.map((reel) => (
              <div key={reel._id} className="card overflow-hidden">
                {/* Video preview (thumbnail in this mock version) */}
                <div className="relative">
                  <img 
                    src={reel.thumbnail} 
                    alt={reel.caption} 
                    className="w-full aspect-[9/16] object-cover"
                  />
                  
                  {/* User info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={reel.user.profilePicture} 
                        alt={reel.user.username} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-semibold">{reel.user.username}</span>
                    </div>
                    
                    <p className="mt-2 text-sm line-clamp-2">{reel.caption}</p>
                    
                    <div className="flex items-center mt-2 text-xs">
                      <MusicNote className="w-3 h-3 mr-1" />
                      <span>{reel.music}</span>
                    </div>
                  </div>
                  
                  {/* Interactions sidebar */}
                  <div className="absolute right-4 bottom-20 flex flex-col space-y-6">
                    <button className="flex flex-col items-center text-white">
                      <Heart className="w-8 h-8" />
                      <span className="text-xs mt-1">{reel.likes}</span>
                    </button>
                    
                    <button className="flex flex-col items-center text-white">
                      <MessageCircle className="w-8 h-8" />
                      <span className="text-xs mt-1">{reel.comments}</span>
                    </button>
                    
                    <button className="flex flex-col items-center text-white">
                      <Share2 className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reels;
