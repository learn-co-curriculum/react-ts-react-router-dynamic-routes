import { Route } from "react-router-dom";
import MoviesList from "./MoviesList";
import { MovieList } from "../types";

interface Props {
  movies: MovieList;
}

function MoviesPage({ movies }: Props) {
  return (
    <div>
      <MoviesList movies={movies} />
    </div>
  );
}
export default MoviesPage;
