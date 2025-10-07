import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createBrowserRouter, Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import * as Sentry from "@sentry/react";




const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);
const App = () => {
  return (
     <>
     <SignedIn>
      <SentryRoutes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/auth' element={<Navigate to={"/"} replace />}/>
      </SentryRoutes>
      </SignedIn>
      <SignedOut>
        <SentryRoutes>
          <Route path='/auth' element={<AuthPage />}/>
          <Route path='*' element={<Navigate to={"/auth"} replace />}/>
        </SentryRoutes>
      </SignedOut>
      
    </>
  )
}

export default App