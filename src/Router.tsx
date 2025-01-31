import { createBrowserRouter } from 'react-router-dom';

import { Applayout } from './components/layouts/AppLayout';

import NotFoundPage from './pages/404';

import ImageUploader from './pages/ImageUploader';
import SavedImages from './pages/SavedImages';
import Setting from './pages/Setting';

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Applayout />,
            children: [
                {
                    path: '',
                    element: <ImageUploader />,
                },
                {
                    path: 'saved-images',
                    element: <SavedImages />,
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
