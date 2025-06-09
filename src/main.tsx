import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import './index.css'
import App from './App.tsx'
import NotFound from './pages/NotFound.tsx';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Profile from './pages/Profile.tsx';

Amplify.configure(outputs);

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path={`/`} element={<App/>}>
                
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home />}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Route>

            </Route>
        </>
    )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Authenticator><RouterProvider router={router}/></Authenticator>
  </StrictMode>,
)
