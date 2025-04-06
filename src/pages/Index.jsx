
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      // If authenticated, redirect to home, otherwise to login
      if (isAuthenticated) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">SocialNest</h1>
        <p className="text-xl text-muted-foreground mb-4">Connect with friends and share your moments</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
