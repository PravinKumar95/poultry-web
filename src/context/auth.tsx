import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import * as React from "react";

export interface AuthContext {
  isAuthenticated: boolean;
  signup: (username: string, password: string) => Promise<void>;
  signin: (username: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);

  const isAuthenticated = !!session;

  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signout = async () => {
    await supabase.auth.signOut();
  };

  const signin = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({ email, password });
  };

  const signup = async (email: string, password: string) => {
    await supabase.auth.signUp({
      email,
      password,
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signin, signout, signup }}>
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
