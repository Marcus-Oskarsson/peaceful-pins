import { StrictMode } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@utils/queryClient';
import { PositionProvider } from '@contexts/PositionContext';
import { UserProvider } from '@contexts/UserContext';

import { Header } from '@components/Header';
import { Login } from '@pages/Login';
import { Register } from '@pages/Register';
import { Home } from '@pages/Home';
import { Profile } from '@pages/Profile';
import { PostsMap } from '@pages/PostsMap';
import { Messages } from '@pages/Messages';
import { Write } from '@pages/Write';
import { About } from '@pages/About';
import { Privacy } from '@pages/Privacy';
import PrivateRoutes from '@components/PrivateRoutes';

const Root = () => {
  return (
    <StrictMode>
      <PositionProvider>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <Header />
            <main>
              <Outlet />
            </main>
          </QueryClientProvider>
        </UserProvider>
      </PositionProvider>
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
            {
              path: '/map',
              element: <PostsMap />,
            },
            {
              path: '/messages',
              element: <Messages />,
            },
            {
              path: '/write',
              element: <Write />,
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
          path: '/about',
          element: <About />,
        },
        {
          path: '/privacy',
          element: <Privacy />,
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
