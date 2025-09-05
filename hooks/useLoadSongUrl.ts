import { useSessionContext } from "@supabase/auth-helpers-react";
import { Tables } from "@/types_db";
import { useMemo } from "react";

const useLoadSongUrl = (song: Tables<'songs'> | undefined) => {
  const { supabaseClient } = useSessionContext();

  const songUrl = useMemo(() => {
    // If the song object doesn't exist, return an empty string
    if (!song) {
      return '';
    }

    // Check for an external URL first
    if (song.song_url) {
        return song.song_url;
    }

    // If there is no external URL, check for a file path
    if (song.song_path) {
        const { data: songData } = supabaseClient
          .storage
          .from('songs')
          .getPublicUrl(song.song_path);

        return songData.publicUrl;
    }

    // Fallback if neither exists
    return '';

  }, [song, supabaseClient]);

  return songUrl;
};

export default useLoadSongUrl;