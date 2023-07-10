import React, { useState, useEffect } from "react";

const api =
  "https://react-http-f5f3d-default-rtdb.asia-southeast1.firebasedatabase.app";
export default function App() {
  const [update, setUpdate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [films, setFilms] = useState([]);
  const [err, setErr] = useState(null);
  const [start, setStart] = useState(false);
  const [timeoutRef, setTimeoutRef] = useState(null);
  const [formdata, setFormData] = useState({
    title: "",
    director: "",
  });
  async function addMovieHandler() {
    const response = await fetch(`${api}/movies.json`, {
      method: "POST",
      body: JSON.stringify(formdata),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response.json();
  }

  useEffect(() => {
    setStart(true);
    getData();
  }, [update]);
  async function getData() {
    try {
      setIsLoading(true);
      const response = await fetch(`${api}/movies.json`);
      const data = await response.json();
      const results = Object.entries(data).map(([key, value]) => ({
        key,
        ...value,
      }));
      setFilms(results);
      console.log(results);
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
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  async function deleteMovie(id) {
    await fetch(`${api}/movies/${id}.json`, {
      method: "DELETE",
    });
    setUpdate((prev) => prev + 1);
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
      <button onClick={addMovieHandler}>add movie</button>
      <br />
      <button>Get Movies</button>
      <div>
        {start && isLoading && films.length > 0 && (
          <div>
            <h1>Movies</h1>
            <div>
              {films.map((filmObj, i) => (
                <div key={i}>
                  <span style={{ fontWeight: "bolder", margin: "1rem" }}>
                    {filmObj.title}
                  </span>
                  <span>{filmObj.director}</span>
                  <span>{filmObj.key}</span>
                  <button onClick={() => deleteMovie(filmObj.key)}>
                    delete movie
                  </button>
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
