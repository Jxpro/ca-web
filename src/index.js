import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // StrictMode导致的额外渲染引起了一些莫名其妙的bug
    // 比如使用useState中的state改变有延迟，导致页面显示不正确
    // 可以采用useEffect来解决，详见Header/index.js
    // 但是在开发环境下，StrictMode建议使用，所以这里还是使用了React.StrictMode
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
