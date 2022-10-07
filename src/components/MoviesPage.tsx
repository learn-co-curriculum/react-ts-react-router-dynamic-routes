import { Outlet, useMatch } from "react-router-dom";
import MoviesList from "./MoviesList";

import { Movie } from "../types";

interface Props {
  movies: Movie[];
}

function MoviesPage({ movies }: Props) {
  const match = useMatch("/movies");

  return (
    <div>
      <MoviesList movies={movies} />
      {match ? <h3>Choose a movie from the above list</h3> : <Outlet />}
    </div>
  );
}
export default MoviesPage;
