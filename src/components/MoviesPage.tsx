import { Movie } from "../types";
import MoviesList from "./MoviesList";

interface Props {
  movies: Movie[];
}

function MoviesPage({ movies }: Props) {
  return (
    <div>
      <MoviesList movies={movies} />
    </div>
  );
}
export default MoviesPage;
