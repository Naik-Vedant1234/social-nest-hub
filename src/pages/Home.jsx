
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { fetchPosts, likePost } from '../utils/api';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Heart, Share2, Bookmark, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts({ pageParam: page }),
  });
  
  const likeMutation = useMutation({
    mutationFn: (postId) => likePost(postId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['posts']);
      const action = data.action === 'liked' ? 'liked' : 'unliked';
      toast.success(`Post ${action}`);
    },
    onError: (error) => {
      toast.error('Failed to like post');
      console.error(error);
    },
  });
  
  const handleLike = async (postId) => {
    if (!user) {
      toast.error('You must be logged in to like posts');
      return;
    }
    
    likeMutation.mutate(postId);
  };
  
  const handleCommentSubmit = (postId) => {
    toast.success('Comment feature coming soon!');
    setCommentText('');
    setActiveCommentPostId(null);
  };
  
  const toggleCommentInput = (postId) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
    } else {
      setActiveCommentPostId(postId);
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const isPostLikedByUser = (post) => {
    if (!user) return false;
    return post.likes && post.likes.some(like => like.user_id === user.id);
  };

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
            {data?.data?.length === 0 ? (
              <div className="text-center p-8 bg-card rounded-lg">
                <p className="text-lg mb-2">No posts yet!</p>
                <p className="text-gray-500 dark:text-gray-400">Follow some users or create your own post.</p>
              </div>
            ) : (
              data?.data?.map((post) => (
                <div key={post.id} className="card overflow-hidden">
                  {/* Post header */}
                  <div className="p-4 flex items-center space-x-3 border-b border-border">
                    <Link to={`/profile/${post.profiles.username}`}>
                      <img 
                        src={post.profiles.avatar_url || 'https://via.placeholder.com/40'} 
                        alt={post.profiles.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Link>
                    <div>
                      <Link to={`/profile/${post.profiles.username}`} className="font-semibold hover:underline">
                        {post.profiles.username}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(post.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Post image */}
                  {post.image_url && (
                    <img 
                      src={post.image_url} 
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
                          className={`flex items-center space-x-1 ${
                            isPostLikedByUser(post) 
                              ? 'text-red-500 dark:text-red-400' 
                              : 'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                          } transition-colors`}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart className="w-5 h-5" fill={isPostLikedByUser(post) ? 'currentColor' : 'none'} />
                          <span>{post.likes?.length || 0}</span>
                        </button>
                        
                        <button 
                          className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                          onClick={() => toggleCommentInput(post.id)}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.comments?.length || 0}</span>
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
                    
                    {/* Comment input */}
                    {activeCommentPostId === post.id && (
                      <div className="mt-4 flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="input flex-grow"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button 
                          className="p-2 bg-primary text-white rounded-full" 
                          onClick={() => handleCommentSubmit(post.id)}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Comments preview */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="mt-4 border-t border-border pt-3">
                        <h4 className="text-sm font-medium mb-2">Comments</h4>
                        {post.comments.slice(0, 2).map(comment => (
                          <div key={comment.id} className="text-sm mb-2">
                            <span className="font-semibold mr-2">{post.profiles.username}</span>
                            {comment.content}
                          </div>
                        ))}
                        {post.comments.length > 2 && (
                          <button className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
                            View all {post.comments.length} comments
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {/* Pagination */}
            {data?.nextPage !== undefined && (
              <div className="flex justify-center mt-8 space-x-2">
                <button 
                  onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                
                <button 
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={!data?.nextPage}
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
