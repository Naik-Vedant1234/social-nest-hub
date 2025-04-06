
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error };
    }
  };

  const register = async ({ email, password, username }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success('Registration successful! Check your email for confirmation.');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
      console.error(error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error };
    }
  };

  const resetPassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      
      if (signInError) throw new Error('Current password is incorrect');
      
      // Change password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
