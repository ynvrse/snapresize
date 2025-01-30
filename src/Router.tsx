import { createBrowserRouter } from 'react-router-dom';

import { Applayout } from './components/layouts/AppLayout';

import NotFoundPage from './pages/404';

import Dashboard from './pages/Dashboard';

import Setting from './pages/Setting';

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Applayout />,
            children: [
                {
                    path: '',
                    element: <Dashboard />,
                },
                {
                    path: 'master-data/products/:id?',
                    element: <NotFoundPage />,
                },
                {
                    path: 'master-data/products/:id?/details',
                    element: <NotFoundPage />,
                },
                {
                    path: 'master-data/products/:id?/add-images',
                    element: <NotFoundPage />,
                },
                {
                    path: 'carts',
                    element: <NotFoundPage />,
                },
                {
                    path: 'history-transactions',
                    element: <NotFoundPage />,
                },
                {
                    path: 'settings',
                    element: <Setting />,
                },
            ],
        },
        {
            path: '*',
            element: <NotFoundPage />,
        },
    ],
    {
        basename: global.basename,
    },
);
