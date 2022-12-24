import {
    createBrowserRouter,
} from 'react-router-dom';
import Error from './error';
import App from '../App';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Error />,
    },
]);

export default router;