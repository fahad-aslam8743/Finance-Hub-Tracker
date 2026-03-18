import { useEffect, useState } from 'react'
import { supabase } from '../API/supabase';

const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession(); 
        setSession(currentSession);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  return { session, loading }; 
}

export default useAuth;