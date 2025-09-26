import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store } from './app/store.js';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SignUp from './components/SignUp.jsx';

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
