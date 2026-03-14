import { supabase } from './supabase';

// Create user profile after signup
const createUserProfile = async (userId: string, email: string, fullName: string) => {
  const { error } = await supabase
    .from('users')
    .insert([
      {
        id: userId,
        email: email,
        full_name: fullName,
      }
    ]);
  
  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  
  // Create user profile if signup successful
  if (data.user && !error) {
    await createUserProfile(data.user.id, email, fullName);
  }
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};