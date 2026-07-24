import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register/Register';
import { useAppDispatch } from './store/hooks';
import { fetchCurrentUser } from './store/slices/authSlice';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {

    const token = localStorage.getItem('access_token');

    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App
