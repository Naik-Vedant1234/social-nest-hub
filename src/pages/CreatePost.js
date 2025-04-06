
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from 'sonner';
import { Image, Video, X, Upload } from 'lucide-react';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    
    if (validImageTypes.includes(file.type)) {
      setMediaType('image');
    } else if (validVideoTypes.includes(file.type)) {
      setMediaType('video');
    } else {
      toast.error('Unsupported file format');
      return;
    }
    
    setMediaFile(file);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setMediaPreview(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    setMediaType('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content && !mediaFile) {
      toast.error('Please add a caption or media to your post');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (mediaFile) {
        formData.append('media', mediaFile);
      }
      
      await api.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <div className="p-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full min-h-[150px] p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            {mediaPreview && (
              <div className="p-4 border-t border-border relative">
                <button 
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-6 right-6 bg-black/70 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                
                {mediaType === 'image' ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="rounded-lg max-h-[400px] mx-auto"
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    controls 
                    className="rounded-lg max-h-[400px] w-full"
                  />
                )}
              </div>
            )}
            
            <div className="p-4 border-t border-border flex flex-wrap">
              <div className="relative">
                <input 
                  type="file" 
                  id="mediaUpload"
                  accept="image/*,video/*" 
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="mediaUpload"
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-secondary transition-colors"
                >
                  <Image className="h-5 w-5 text-green-500" />
                  <span>Photo</span>
                </label>
              </div>
              
              <div className="relative ml-4">
                <input 
                  type="file" 
                  id="videoUpload"
                  accept="video/*" 
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label 
                  htmlFor="videoUpload"
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-secondary transition-colors"
                >
                  <Video className="h-5 w-5 text-blue-500" />
                  <span>Video</span>
                </label>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex justify-center items-center space-x-2"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Create Post</span>
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePost;
