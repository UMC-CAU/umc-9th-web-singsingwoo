import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';


//BrowuserRouter v5
//createBrowserRouter v6

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
    errorElement: <NotFoundPage/>,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage/>,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage/>,
      }
    ]  
  },
]);  



export default function App(){

    return <RouterProvider router={router} />;


}
