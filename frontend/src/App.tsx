import { StrictMode } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@utils/queryClient';
import { Header } from '@components/Header';
import { Login } from '@pages/Login';
import { Register } from '@pages/Register';
import { Home } from '@pages/Home';
import { Profile } from '@pages/Profile';
import PrivateRoutes from '@components/PrivateRoutes';

const Root = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main>
          <Outlet />
        </main>
      </QueryClientProvider>
    </StrictMode>
  );
};

const App = () => {
  const router = createBrowserRouter([
    {
      children: [
        {
          element: <PrivateRoutes />,
          children: [
            {
              path: '/profile',
              element: <Profile />,
            },
          ],
        },
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/register',
          element: <Register />,
        },
      ],
      element: <Root />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
