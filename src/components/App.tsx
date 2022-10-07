import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import MoviesPage from "./MoviesPage";
import { Movie } from "../types";

function App() {
  const [movies, setMovies] = useState<Movie[]>([
    { id: 1, title: "A River Runs Through It" },
    { id: 2, title: "Se7en" },
    { id: 3, title: "Inception" },
  ]);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/movies" element={<MoviesPage movies={movies} />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </div>
  );
}

export default App;
