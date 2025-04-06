
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

// Posts
export const fetchPosts = async ({ pageParam = 0 }) => {
  try {
    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        likes:likes (user_id),
        comments:comments (*)
      `)
      .order('created_at', { ascending: false })
      .range(pageParam * 10, (pageParam + 1) * 10 - 1);
      
    if (error) throw error;
    
    return {
      data: data || [],
      nextPage: data?.length === 10 ? pageParam + 1 : undefined,
      totalCount: count || 0
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = async ({ content, imageUrl = null }) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const userId = userData.user.id;
    
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content,
        image_url: imageUrl
      })
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const userId = userData.user.id;
    
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', userId);
      
    if (existingLike?.length > 0) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
        
      if (error) throw error;
      return { action: 'unliked' };
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: userId
        });
        
      if (error) throw error;
      return { action: 'liked' };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

export const addComment = async (postId, content) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const userId = userData.user.id;
    
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content
      })
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// User profile
export const fetchUserProfile = async (username) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        followers:followers!follower_id (follower_id),
        following:followers!following_id (following_id)
      `)
      .eq('username', username)
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      followersCount: data.followers?.length || 0,
      followingCount: data.following?.length || 0
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const userId = userData.user.id;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const followUser = async (targetUserId) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    const userId = userData.user.id;
    
    // Check if already following
    const { data: existingFollow } = await supabase
      .from('followers')
      .select()
      .eq('follower_id', userId)
      .eq('following_id', targetUserId);
      
    if (existingFollow?.length > 0) {
      // Unfollow
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', targetUserId);
        
      if (error) throw error;
      return { action: 'unfollowed' };
    } else {
      // Follow
      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: userId,
          following_id: targetUserId
        });
        
      if (error) throw error;
      return { action: 'followed' };
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    throw error;
  }
};

export default {
  fetchPosts,
  createPost,
  likePost,
  addComment,
  fetchUserProfile,
  updateProfile,
  followUser
};
