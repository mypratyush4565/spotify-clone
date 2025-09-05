import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types_db";
import { Tables } from "@/types_db";

const getSongsByUserId = async (): Promise<Tables<'songs'>[] | null> => {
  try {
    const supabase = createServerComponentClient<Database>({
      cookies: cookies
    });
    
    const {
      data: sessionData,
      error: sessionError
    } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log(sessionError.message);
      return [];
    }
    
    // Add this check
    if (!sessionData.session) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('user_id', sessionData.session.user.id) // Removed the '?' now that we've checked for it
      .order('created_at', { ascending: false });
      
    if (error) {
      console.log(error.message);
      return null;
    }
    
    return data as any;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default getSongsByUserId;