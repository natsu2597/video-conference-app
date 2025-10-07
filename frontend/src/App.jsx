import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createBrowserRouter, Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import * as Sentry from "@sentry/react";
import { useAuth } from '@clerk/clerk-react';
import CallPage from './pages/CallPage.jsx';



const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);
const App = () => {

  const {isSignedIn, isLoaded} = useAuth();
  if(!isLoaded) return null;
  
  return (
      <SentryRoutes>
          <Route path='/' element={isSignedIn ? <HomePage /> : <Navigate to={"/auth"} replace />}/>
          <Route path='/auth' element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}/>
          <Route path='/call/:id' element={isSignedIn ? <CallPage /> : <Navigate to={"/auth"} replace />}/>

          <Route path='*' element={isSignedIn ? <Navigate to={"/"} replace /> : <Navigate to={"/auth"} replace />}/>
        </SentryRoutes>
  )
}

export default App