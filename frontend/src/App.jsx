import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ErrorPage from "./pages/error"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import Landingpage from "./pages/landingpage"
import Location from "./pages/location"
import Weather from "./pages/weather"
import History from "./pages/history"
import PrivateRoute from "./components/privateRouter"

const apiRouter = createBrowserRouter([
  {
    path: "/",
    element: <Landingpage />, 
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/location",
    element: (
      <PrivateRoute>
        <Location />
      </PrivateRoute>
    ),
  },
  {
    path: "/weather/:id",
    element: (
      <PrivateRoute>
        <Weather />
      </PrivateRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <PrivateRoute>
        <History />
      </PrivateRoute>
    ),
  },
])

const App = () => {
  return <RouterProvider router={apiRouter} />
}

export default App
