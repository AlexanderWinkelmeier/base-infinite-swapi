import InfiniteScroll from 'react-infinite-scroller';
import { Species } from './Species';
import { useInfiniteQuery } from '@tanstack/react-query';

const initialUrl = 'https://swapi.dev/api/species/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['sw-species'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined;
    },
  });
  // EARLY RETURNS
  // if cache is empty
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  // if error
  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }
  return (
    <>
      {/* if cache is not empty */}
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll
        loadMore={() => {
          // prevents double call to the API
          if (!isFetching) {
            fetchNextPage();
          }
        }}
        hasMore={hasNextPage}
      >
        {/* data has the pages-property that is an array*/}
        {/* mapping over this array */}
        {data.pages.map((pageData) => {
          // mapping over each element of the array over the results and returns Species-Objekts
          return pageData.results.map((species) => {
            return (
              <Species
                key={species.name}
                name={species.name}
                language={species.language}
                averageLifespan={species.averageLifespan}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
