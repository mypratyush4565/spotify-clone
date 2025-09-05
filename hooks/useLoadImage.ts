import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Database } from "@/types_db";
import { Tables } from "@/types_db";

const useLoadImage = (song: Tables<'songs'>) => {
  const supabaseClient = createClientComponentClient<Database>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!song.image_path) {
      return;
    }

    const { data: imageData } = supabaseClient
      .storage
      .from('images')
      .getPublicUrl(song.image_path);

    setImageUrl(imageData.publicUrl);
  }, [song.image_path, supabaseClient]);

  return imageUrl;
};

export default useLoadImage;