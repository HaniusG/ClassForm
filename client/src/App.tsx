import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Register from './pages/Register/Register';

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
  return <RouterProvider router={router} />;
}

export default App
