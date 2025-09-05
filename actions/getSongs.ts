import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database, Tables } from "@/types_db"; // Correctly import Database and Tables
import { error } from "console";

// Define the correct return type using the generated Tables helper
const getSongs = async (): Promise<Tables<'songs'>[] | null> => {
  const supabase = createServerComponentClient<Database>({
    cookies: cookies,
  });

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message); // Use .message for better logging
    return null;
  }

  // No need for 'as any' since the return type is now correct
  return data;
};

export default getSongs;