# Nested Routes

## Learning Goals

- Create nested routes in React Router
- Use URL parameters in React Router
- Use the `useRouteMatch` and `useParams` hooks to access information about
  React Router's internal state

## Introduction

Have you ever used Apple's Messages app for your Mac? What about YouTube? These
apps use a type of **list/detail** interface which consists of a list of all
instances of a resource (messages, videos, emails, etc.) from which we can
select specific items. Clicking on one will trigger a more detailed display of
that specific item on **another portion of the screen** instead of displaying an
entirely new page. (You may also see this pattern referred to as the
master/detail pattern.) With this design, a user can navigate through many items
in a list, looking at item details without ever leaving the page they are on.

Consider how we might create this sort of design in regular React, without using
`Route`s: we could create two sibling components, one for the list, and the
other for the details of a specific item. We could call them `List` and `Item`.
Then, we create _one_ parent component for both that handles state. The parent
component could keep track of all the list data and which particular item is
currently selected, and pass down props to both components.

This would work, but there are limitations. One problem with this approach is
that changing state won't change the URL, meaning there is no way to provide a
link directly to one particular item from our list of resources.

Apps like YouTube display a list of videos, and clicking on any one video will
load it, but every time you open a particular video, _the URL changes_. YouTube
assigns unique values to each video (something like `dQw4w9WgXcQ`). When viewing
that video, the value is listed as part of the URL. This value is a URL
parameter and allows for convenient sharing and bookmarking.

```txt
https://www.youtube.com/watch?v=dQw4w9WgXcQ

https    :// www.youtube.com / watch ? v             = dQw4w9WgXcQ

protocol :// domain          / path  ? parameter_key = parameter_value
```

In this lesson, we will learn how to use React Router to set up the list/detail
pattern. Specifically, we will learn how to:

- set up nested `Route`s for list and item components such that clicking on an
  item will display its details _along with_ the list
- set up our `Route`s to produce shareable URLs, i.e., URLs that contain a
  parameter corresponding to the specific resource we want to display

Our final component hierarchy will look like this:

```txt
└── App
    ├── NavBar
    └── MoviesPage
        |   MoviesList
        └── MovieShow
```

The `App` component will render the `NavBar` and `MoviesPage` components and is
where we'll define our top-level `Routes`. The `MoviesPage` component will be
the parent with an `Outlet` for the two presentational components, `MoviesList`
and `MovieShow`, and is where we'll set up our nested route.

## Nesting

In this lesson, when a list item is clicked, we want to see the details of that
item, but **we still want the list to display**.

In a previous lesson, we learned how to nest routes that allowed two components
to be displayed at the same time. However, in that case we knew exactly what the
nested routes and their paths were going to be. What if we want our nested
routes and paths to be more variable?

Think of YouTube again for a moment. Let's pretend that visiting `/videos`
displays a `List` of videos. Clicking on any video should keep our list of
videos on the page, but also display details for the selected video. In
addition, the URL should be updated to `/videos/:videoId`, where `:videoId` is a
unique value that identifies the selected video. (Note that this isn't exactly
how YouTube works but the concepts are similar.) Using nested React Router, we
can write our application so one component — the `List` of videos — renders
using a Route that matches the path `/videos`. Then, within the `List`, we can
nest a second Route that renders the appropriate `Item` when the path matches
`/videos/:videoId`.

Let's build this out!

## Rendering Our List

To begin, let's take a look at our starter code. First, we have our `App`
component. `App` has some dummy movie data provided in state for us (normally,
we would likely be fetching this info):

```jsx
// src/components/App.tsx
  const [movies, setMovies] = useState<Movie[]>([
    { id: 1, title: "A River Runs Through It" },
    { id: 2, title: "Se7en" },
    { id: 3, title: "Inception" },
  ]);
```

> **Note**: The `Movie` type is an interface provided in `src/types.ts`.

Looking at the `index.tsx` file, we see that we have `Router` wrapping our
`App`. All JSX wrapped within `Router` can use `Route`s, including the JSX from
any child components. In our case, that is _all_ of our components.

`App` has two `Route` elements:

```jsx
// src/components/App.tsx
<Routes>
  <Routes>
    <Route path="/movies" element={<MoviesPage movies={movies} />} />
    <Route path="/" element={<div>Home</div>} />
  </Routes>
</Routes>
```

> **Note**: Notice how the `element` prop can accept components even with props
> passed down to them and regular HTML elements.

Looking at the `MoviesPage` component, this component is responsible for loading
our `MoviesList` component and passing in the `movies` prop we received from
`App`.

```jsx
// src/components/MoviesPage.tsx
import { Route } from "react-router-dom";
import MoviesList from "./MoviesList";
import { Movie } from "../types";

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
```

At the moment, our `MoviesPage` component doesn't do much. It is simply the
middle component between `App` and `MoviesList`, but we will come back to this
component in a moment. Right now, if we try to run our React app, we get an
error because `MoviesList` is not defined yet!

Let's create our `MoviesList` component to render a `<Link>` for each movie:

```jsx
// src/components/MoviesList.tsx
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
```

A few things are going on here, so let's break it down.

The `movies` prop is an array containing each `movie` object. To iterate over
this object, we are using `map`, which gives us access to each individual
`movie`. With that access, we use the `movie.id` as the `key` value and later on
again in our `Link`.

Speaking of, notice how we're using the `Link` component as opposed to the
`NavLink` we learned about before. Remember, the key difference is that
`NavLink`'s know when they are active by applying a class of `active` to the
link. `Link` is more like your normal link that doesn't need to know when it's
the active one. Otherwise, providing the link path is similar, by using the `to`
prop.

In the `Link`, we've used interpolation to insert `movie.id` into our path to
make it dynamic:

```jsx
to={`${movie.id}`}
```

Now, if we start up the app, we'll see that if a user goes to the `/movies`
route, `MoviesList` will render a list of clickable router links. Clicking on
one of the movie names will update the URL to display _that_ movie's id, such as
`/movies/1`.

But wait, how does the path have the `/movies` prefix even though we didn't
specify it in our `Link`? Just like `Route path`, `Link to` is _relative_ **when
the leading `/` is left off.** This means it automatically uses the parent's
path as a prefix to add the child's path onto. If that behavior is not desired,
simply add the leading `/` and it will treat it as an exact path instead. Try it
out by changing the path to `/${movie.id}` and see for yourself (but don't
forget to change it back afterwards)!

Next, we'll add in our nested route within `MoviesPage` so that going to
`/movies/:movieId` will display details about a given movie using a `MovieShow`
component.

### Linking to the Individual Movie Page

To start, let's create our `MovieShow` component. Later on, we will see that
this component will need to dynamically figure out which movie it should render.

```jsx
// ./src/components/MovieShow.tsx
function MovieShow() {
  return (
    <div>
      <h3>Movies Show Component!</h3>
    </div>
  );
}

export default MovieShow;
```

Next, we'll import `MovieShow` into `App` and add a nested route in our
`src/components/App.tsx` file. We want to display the `MovieShow` container
within the `MoviesPage` component when the route matches `/movies/:movieId`.

```jsx
// .src/components/App.tsx

// ... Other imports

// Step 1. Import the MovieShow component
import MovieShow from "./MovieShow";

function App() {
  // ... Movie data

  return (
    <div>
      <NavBar />
      <Routes>
        {/* Step 2. Refactor the MoviesPage route to be non-self-closing so it can accept a nested route */}
        <Route path="/movies" element={<MoviesPage movies={movies} />}>
          {/* Step 3. Nest the MovieShow route */}
          <Route path={`:movieId`} element={<MovieShow />} />
        </Route>
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </div>
  );
}

export default MoviesPage;
```

Remember, `Route path` is relative if we leave out the leading `/`. As we can
see above, the path to the `MoviesPage` component is `/movies`. Any nested
`Route path` within the `MoviesPage` component will automatically take on the
prefix of `/movies`. So we leave off the `/` to append the `:movieId` of the
particular video we want to display onto `/movies`.

The `:` syntax in front of `:movieId` represents a parameter, meaning this part
of the URL will be variable. For example, if we visit
`http://localhost:3000/movies/1`, the value of `movieId` will be `"1"`. This is
what allows us to make our paths variable.

Going back to our `MoviesList` component, remember that when `movies` is mapped,
our `Link`s are each getting a unique path in the `to={...}` attribute, since
each `movieID` is different.

```jsx
// src/components/MoviesList.tsx
// Note: No code changes here, just a reminder of what the component looks like
import { Link } from "react-router-dom";

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
```

There's one more thing we have to do - set up an `Outlet` component. Recall from
a previous lesson, the `Outlet` component is how we tell the parent app where to
render nested components.

In our case, the parent component is `MoviesPage`, so we need to import the
`Outlet` component there. Then, we can render it inside the component wherever
we want. Let's put it underneath the `MoviesList`:

```jsx
// src/components/MoviesPage.tsx

// Step 1. Import Outlet
import { Outlet } from "react-router-dom";

// .. Other imports and the Props type interface

function MoviesPage({ movies }: Props) {
  return (
    <div>
      <MoviesList movies={movies} />
      {/* Step 2. Render the Outlet component */}
      <Outlet />
    </div>
  );
}
export default MoviesPage;
```

We have now set up the receiving end of the movie links so React knows what
component to render and where when an individual movie's link is clicked.

Refresh the page at `/movies`. Now, clicking a link changes the route, but we're
not actually seeing any content about that movie on our MovieShow page. You
should only see the text `Movies Show Component!` under the navigation and movie
links.

The data we want to display on a particular `MovieShow` page is available on the
`App` component. For `MovieShow` to display this content, we will need to make
our `movies` collection available within `MovieShow` by passing it down as a
prop.

```jsx
// .src/components/App.tsx
return (
  <div>
    <NavBar />
    <Routes>
      <Route path="/movies" element={<MoviesPage movies={movies} />}>
        {/* Step 1. Pass the movies as a prop to MovieShow */}
        <Route path={`:movieId`} element={<MovieShow movies={movies} />} />
      </Route>
      <Route path="/" element={<div>Home</div>} />
    </Routes>
  </div>
);
```

This isn't enough though — `MovieShow` now has all the movies, but it doesn't
know _which_ movie it should display. This information is _only available from
the URL_. Remember — when we click a `Link` to a movie, it adds that movie's
`id` to the URL as a **parameter**. We need to get that parameter out of the URL
and into `MovieShow`.

We can use a custom hook provided by React Router to get the dynamic `params`
from the URL: the [`useParams`][use-params] hook!

```jsx
// src/components/MovieShow.tsx

// Step 1. Import the useParams hook and the Movie type interface
import { useParams } from "react-router-dom";
import { Movie } from "../types";

// Step 2. Define the Props interface for movies
interface Props {
  movies: Movie[];
}

// Step 3. Destructure and type the movies prop
function MovieShow({ movies }: Props) {
  // Step 4. Call useParams to access the `params` from the url
  const params = useParams();
  console.log(params);

  // Step 5. Find the movie with a matching id using find
  const foundMovie = movies.find(
    (movie) => movie.id === parseInt(params.movieId!)
  );
  console.log(foundMovie);

  return (
    <div>
      {/* Step 6. Display the found movie's title */}
      <h3>{foundMovie!.title}</h3>
    </div>
  );
}

export default MovieShow;
```

Again, a lot is going on here! Let's break it all down.

The `useParams` hook returns an object with the parameters of the current URL.
The `console.log` of what the hook returns is there for your benefit, check out
what the object looks like in your browser console. We can see that it uses the
name we originally gave our param when we defined the `Route path` for
`MovieShow`: `movieId`.

Knowing that, we are then able to use the `params.movieId` to find a match in
the `movies` array using the built-in JavaScript `find()` method. For our case,
we know that `MoviesPage` will only ever render when there is a `movieId`
present, so we assure TypeScript that `params.movieId` will never be undefined
by using the bang `!` syntax.

Again, the `console.log` of `foundMovie` is there for your benefit, so check out
what it returns in the browser console. We can now be sure we're getting back a
movie object.

Finally, we render that movie's information!

We've succeeded in creating a list/detail interface in which the list of movies
is always present when viewing a particular movie's details. Clicking through
the links changes the URL. With this setup, users of this site could bookmark or
share the URL for a specific movie!

> **Note**: For our sandbox application, we assume the user will use the app
> perfectly correct, so we tell TypeScript that `foundMovie` will never be
> undefined with the bang `!` syntax once again. In reality, a user could
> manually type into the address bar `/movies/5`, which doesn't exist in our
> data and would break our app. We would need to implement some error handling
> to make sure that does not happen, but that is out of the scope for this
> lesson. Feel free to try adding it yourself as a bonus challenge!

### Bonus: Handling What Happens If We Only Visit the First Route

With our main task completed, let's take a quick step back and ask a question —
what happens in this app when we visit `http://localhost:3000/movies` without a
particular `movieId` parameter? Well, `MoviesPage` still renders due to the
top-level `/movies` `Route`, but it will only render `MoviesList`. The `Outlet`
won't render because there is no nested component to display at just `/movies`.

If we want to specify what users will see by default if they navigate to just
`/movies`, we can do so by utilizing another custom hook that React Router
provides: [useMatch][use-match]. This hook returns data about a route when it
matches a given path.

We want our `MoviesPage` to be the component that displays some default text, so
let's implement it there and then break it down:

```jsx
// .src/components/MoviesPage.tsx

// Step 1. Import the useMatch hook
import { Route, useMatch } from "react-router-dom";

// ... Other imports and the Props type interface

function MoviesPage({ movies }: Props) {
  // Step 2. Save the data returned by the hook to a variable, let's name it match
  // Step 3. Pass the hook a string with the path to match
  const match = useMatch("/movies");

  return (
    <div>
      <MoviesList movies={movies} />
      {/* Step 4. If there is a match returned, render an h3 with the default text, otherwise render the Outlet*/}
      {match ? <h3>Choose a movie from the above list</h3> : <Outlet />}
    </div>
  );
}

export default MoviesPage;
```

As we can see, the `useMatch` hook accepts a string that specifies what `path`
to match. The hook will return an object with the match's data only when the
current URL matches exactly what was passed to it. If there is no match, it will
return `null`. Try console logging `match` and click around to see for yourself.

With that knowledge, we can write a ternary expression to display default text
_or_ render the nested components with `Outlet` based on whether or not a
`match` was returned.

Now, when we visit `http://localhost:3000/movies`, we see a message that only
appears if there is no additional `movieId` at the end of the URL. This is the
nested version of a default route. We can't just write `exact path="/"` since
these `Route`s will only render inside the `/movies` `Route`.

## Conclusion

As we have learned in this section, React Router enables us to set up routes
that allow our users to navigate to different "pages" in our applications. The
routes we define can be static (e.g., `/movies`) or we can include a _parameter_
(e.g., `/movies/:movieId`) to make it dynamic. React Router will also update the
URL in the browser to reflect whichever page the user has navigated to.

We are also able to nest `<Route>` components within each other, which allows us
to build single-page applications in React that _behave_ like they have many
pages. Nesting also extends the URL path of the parent onto any nested children.
We can actually nest `Route`s as many times as we would like, so if we wanted,
we could go fully RESTful and create nested `Route`s inside `MovieShow` as well,
allowing us to write URL paths that would look something like this:

```txt
http://localhost:3000/movies
http://localhost:3000/movies/new
http://localhost:3000/movies/:movieId
http://localhost:3000/movies/:movieId/edit
```

In this lesson, we learned how to set up nested routes to create a
**list/detail** interface. Specifically, we learned how we can display a list of
items along with details about an individual item on the same page. To get this
to work, we needed to complete the following steps:

- In the top-level component (`App` in this case), create our `Routes`,
  including our nested `Route` for `MovieShow`.
- In `MoviesPage`, render `MoviesList` and the nested `MovieShow` component by
  using `Outlet`.
- In `MoviesList`, iterate through the `movies` object and create a dynamic
  `Link` for each movie using its id
- In `MovieShow`, import `useParams`; use the `:movie_id` from the params object
  to access the correct movie from the `movies` object and display it on the
  page

In setting up our nested routes, we made use of two hooks provided by React
Router: `useMatch` and `useParams`. The first is used to return path data when
the the URL of the current page matches a given one, and the second allows us to
access the value of any parameters we're using in our routes. The two together,
along with the `movies` object, gave us all the tools we needed to create
dynamic routes for individual movies and to display a movie's information when
its link is clicked.

In the early days of the internet, we would have had to create separate HTML
pages **for each movie in this application**. Now, with React, we can write
abstract components that fill in the data for each 'page' on demand. Very cool!

## Resources

- [useRouteMatch][use-match]
- [useParams][use-params]

[object destructuring]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[use-match]: https://reactrouter.com/en/main/hooks/use-match
[use-params]: https://reactrouter.com/en/main/hooks/use-params
