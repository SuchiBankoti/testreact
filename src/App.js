import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    async function getMovies() {
      const response = await fetch("https://swapi.dev/api/films/");
      const data = await response.json();
      const results = data.results;
      setFilms(results);
      setIsLoading(true);
    }
    getMovies();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>
          <h1>Movies</h1>
          <div>
            {films.map((film, i) => (
              <div key={i}>
                <span style={{ fontWeight: "bolder", margin: "1rem" }}>
                  {film.title}
                </span>
                <span>{film.director}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ margin: "auto", fontSize: "5rem" }}>Loading...</div>
      )}
    </div>
  );
}
