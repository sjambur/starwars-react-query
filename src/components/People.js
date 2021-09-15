import React, { useState } from "react";
import { useQuery } from "react-query";
import Person from "./Person";

const fetchPeople = async (page = 1) => {
  const res = await fetch(`http://swapi.dev/api/people/?page=${page}`);
  return await res.json();
};

const People = () => {
  const [page, setPage] = useState(1);
  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery(["people", page], () => fetchPeople(page), {
      keepPreviousData: true,
    });

  return (
    <div>
      <h2>People</h2>
      <span>Current Page: {page}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 1))}
        disabled={page === 1}
      >
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPreviousData && data.next) {
            setPage((old) => old + 1);
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPreviousData || !data?.next}
      >
        Next Page
      </button>
      {isFetching ? <span> Fetching...</span> : null}{" "}
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.results.map((person) => (
            <Person key={person.name} person={person} />
          ))}
        </div>
      )}
    </div>
  );
};

export default People;
