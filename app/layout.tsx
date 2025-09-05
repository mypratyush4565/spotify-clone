import { Figtree } from 'next/font/google';
import ToasterProvider from '@/providers/ToasterProvider';
import SupabaseProvider from '@/providers/SupabaseProvider';
import UserProvider from '@/providers/UserProvider';
import ModalProvider from '@/providers/ModalProvider';
import Player from '@/components/Player';
import PlayerProvider from '@/providers/PlayerProvider';
import Sidebar from '@/components/Sidebar';
import getSongsByUserId from '@/actions/getSongsByUserId'; // Import the data fetching function
import './globals.css';

const font = Figtree({ subsets: ['latin'] });
export const metadata = {
  title: 'Spotify Clone',
  description: 'Listen to music',
};
export const revalidate= 3600;
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user songs on the server
  const userSongs = await getSongsByUserId();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <PlayerProvider>
              <ModalProvider />
              {/* Pass the songs to the Sidebar component */}
              <Sidebar songs={userSongs}>{children}</Sidebar>
              <Player />
            </PlayerProvider>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}