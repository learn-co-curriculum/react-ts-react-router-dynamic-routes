import { useParams } from "react-router-dom";
import { Movie } from "../types";

interface Props {
  movies: Movie[];
}

function MovieShow({ movies }: Props) {
  const params = useParams();

  const foundMovie = movies.find(
    (movie) => movie.id === parseInt(params.movieId!)
  );

  return (
    <div>
      <h3>{foundMovie!.title}</h3>
    </div>
  );
}

export default MovieShow;
