import { supabase } from "@/lib/supabase";

import * as React from "react";

interface SignUpOptions {
  username?: string;
  company?: string;
}

export interface AuthContext {
  signup: (
    email: string,
    password: string,
    options: SignUpOptions
  ) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const signout = async () => {
    await supabase.auth.signOut();
  };

  const signin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  };

  const signup = async (
    email: string,
    password: string,
    options: SignUpOptions
  ) => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options,
      },
    });
  };

  return (
    <AuthContext.Provider value={{ signin, signout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
