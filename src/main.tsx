import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
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
import BreatheHomepage from './pages/Home/Home.tsx';
import FourSevenEight from './pages/FourSevenEight/FourSevenEight.tsx';
import ResonanceBreathing from './pages/ResonanceBreathing/ResonanceBreathing.tsx';
import PursedLipBreathing from './pages/PursedLipBreathing/PursedLipBreathing.tsx';
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme.ts";

Amplify.configure(outputs);

export default function ThemedRoutes() {
  return (
    <ThemeProvider theme={theme}>
      <Outlet />
    </ThemeProvider>
  );
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path={`/`} element={<App/>}>
                
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home />}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route element={<ThemedRoutes />}>
                        <Route path="breathe">
                            <Route index element={<BreatheHomepage/>}/>
                            <Route path="478-breathing" element={<FourSevenEight/>}/>
                            <Route path="resonance-breathing" element={<ResonanceBreathing/>}/>
                            <Route path="pursed-lip-breathing" element={<PursedLipBreathing/>}/>
                            {/* Add more breathing routes as needed */}
                        </Route>
                    </Route>
                    {/* Add more routes as needed */}
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
