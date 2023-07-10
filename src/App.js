import React, { useState, useEffect } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [films, setFilms] = useState([]);
  const [err, setErr] = useState(null);
  const [start, setStart] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState(null);
  const [formdata, setFromData] = useState({
    title: "",
    director: "",
  });

  useEffect(() => {
    setStart(true);
    getData();
  }, []);
  async function getData() {
    try {
      setIsLoading(true);
      const response = await fetch("https://swapi.dev/api/films/");
      const data = await response.json();
      const results = data.results;
      setFilms(results);
    } catch (error) {
      setErr(error.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if ((!isLoading && err) || (!isLoading && films.length === 0)) {
        getData();
        console.log("sett");
      }
    }, 3000);

    setTimeoutRef(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [isLoading, err, films]);
  function cancelTrying() {
    clearTimeout(timeoutRef);
    setStart(false);
  }
  function handleChange(e) {
    setFromData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }
  return (
    <div>
      <form>
        <label>Title</label>
        <input name="title" value={formdata.title} onChange={handleChange} />
        <label>Director</label>
        <input
          name="director"
          value={formdata.director}
          onChange={handleChange}
        />
      </form>
      <button
        onClick={() => console.log(`${formdata.title}-${formdata.director}`)}
      >
        add movie
      </button>
      <br />
      <button>Get Movies</button>
      <div>
        {start && isLoading && films.length > 0 && (
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
        )}
        {start && !isLoading && err && (
          <div>
            <h1>error loading films</h1>
            <h2>Retrying...</h2>
            <button onClick={cancelTrying}>Cancel Retrying</button>
          </div>
        )}
        {start && isLoading && films.length === 0 && (
          <div style={{ margin: "auto", fontSize: "5rem" }}>Loading...</div>
        )}
      </div>
    </div>
  );
}
