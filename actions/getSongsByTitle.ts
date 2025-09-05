import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";
import { Database, Tables } from "@/types_db"; 
// The `error` from 'console' is not needed, as the function is global.

// Correctly handle the return type, returning an empty array on error
const getSongsByTitle = async (title: string): Promise<Tables<'songs'>[]> => {
  const supabase = createServerComponentClient<Database>({
    cookies: cookies,
  });

  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    // Correctly use a template literal to embed the 'title' variable.
    .ilike('title', `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    // Return an empty array to prevent client-side errors
    return [];
  }

  // No need for `as any` or null checks since we handle the error case above.
  return data;
};

export default getSongsByTitle;
