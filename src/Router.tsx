import { createBrowserRouter } from 'react-router-dom';

import { Applayout } from './components/layouts/AppLayout';

import NotFoundPage from './pages/404';

import Dashboard from './pages/Dashboard';
import ImageUploader from './pages/ImageUploader';

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
                    path: 'cameras',
                    element: <ImageUploader />,
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
