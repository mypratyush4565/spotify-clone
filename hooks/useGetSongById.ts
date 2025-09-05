import { useEffect, useMemo, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Tables } from "@/types_db";
import toast from "react-hot-toast";

// The hook now correctly expects a string ID
const useGetSongById = (id?: string) => {
  // isLoading is a boolean, not a song object
  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useState<Tables<'songs'> | undefined>(undefined);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) {
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      // No need for type casting here
      setSong(data);
      setIsLoading(false);
    }
    
    fetchSong();
  }, [id, supabaseClient]);

  return useMemo(() => ({
    isLoading,
    song,
  }), [isLoading, song]);
};

export default useGetSongById;
