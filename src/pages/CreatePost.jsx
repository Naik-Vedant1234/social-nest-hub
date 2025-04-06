
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../utils/api';
import Layout from '../components/Layout';
import { toast } from 'sonner';
import { Image as ImageIcon, X, Loader } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success('Post created successfully!');
      queryClient.invalidateQueries(['posts']);
      navigate('/');
    },
    onError: (error) => {
      toast.error('Failed to create post');
      console.error(error);
    },
  });
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };
  
  const removeImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      toast.error('Please add some content or an image to your post');
      return;
    }
    
    setIsUploading(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if there is one
      if (image) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        
        // Check if posts bucket exists, if not create it
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('posts');
        
        if (bucketError && bucketError.message.includes('does not exist')) {
          await supabase.storage.createBucket('posts', {
            public: true,
          });
        }
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, image);
          
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: urlData } = await supabase.storage
          .from('posts')
          .getPublicUrl(fileName);
          
        imageUrl = urlData.publicUrl;
      }
      
      // Create post
      await createPostMutation.mutateAsync({ 
        content, 
        imageUrl 
      });
      
    } catch (error) {
      toast.error('Error creating post');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        
        <div className="card overflow-hidden">
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <textarea
              className="w-full min-h-[150px] p-4 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            
            {/* Image preview */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-[300px] object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                {/* Image upload button */}
                <label htmlFor="image-upload" className="cursor-pointer flex items-center space-x-2 p-2 hover:bg-secondary rounded-md">
                  <ImageIcon size={20} />
                  <span>Add Photo</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isUploading || createPostMutation.isPending}
                className="btn-primary"
              >
                {isUploading || createPostMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <Loader className="animate-spin h-4 w-4" />
                    <span>Posting...</span>
                  </div>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
