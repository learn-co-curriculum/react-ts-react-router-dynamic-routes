import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import MoviesPage from "./MoviesPage";
import { MovieList } from "../types";

function App() {
  const [movies, setMovies] = useState<MovieList>({
    1: { id: 1, title: "A River Runs Through It" },
    2: { id: 2, title: "Se7en" },
    3: { id: 3, title: "Inception" },
  });

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/movies">
          <MoviesPage movies={movies} />
        </Route>
        <Route path="/">
          <div>Home</div>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
