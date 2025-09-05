import Header from "@/components/Header";
import getSongsByTitle from "@/actions/getSongsByTitle";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";

export const revalidate = 3600;

// Next.js App Router async page props
type SearchPageProps = {
  searchParams: { title?: string } | Promise<{ title?: string }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  // Await if searchParams is a Promise
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  const title = params.title ?? "";
  const songs = await getSongsByTitle(title);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} />
    </div>
  );
};

export default SearchPage;
