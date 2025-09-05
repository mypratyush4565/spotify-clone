import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database, Tables } from "@/types_db"; 

// Update the return type to reflect the 'liked_songs' table
const getLikedSongs = async (): Promise<Tables<'liked_songs'>[]> => {
  const supabase = createServerComponentClient<Database>({
    cookies: cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Return an empty array immediately if there is no session or user
  if (!session || !session.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq('user_id', session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message); 
    // Return an empty array to prevent client-side errors
    return [];
  }
  if(!data){
    return [];
  }

  // Cast the data to the correct type for safety
  return data.map((item)=>({
    ...item.songs
  }))
};

export default getLikedSongs;