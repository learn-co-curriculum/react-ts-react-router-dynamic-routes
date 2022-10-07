import { Link } from "react-router-dom";
import { Movie } from "../types";

interface Props {
  movies: Movie[];
}

function MoviesList({ movies }: Props) {
  const renderMovies = movies.map((movie) => (
    <li key={movie.id}>
      <Link to={`${movie.id}`}>{movie.title}</Link>
    </li>
  ));

  return <ul>{renderMovies}</ul>;
}

export default MoviesList;
