import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType, } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toaster from "react-hot-toast";
import AuthProvider from './providers/AuthProvider.jsx';
import * as Sentry from "@sentry/react";
import React from 'react';


const queryClient = new QueryClient();


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }

  Sentry.init({
  dsn: "https://09e347b9c956e365104781d2db7dabf3@o4510135752392704.ingest.de.sentry.io/4510149219844176",
  integrations: [
    Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
        <App />
        </AuthProvider>
        <Toaster />
      </QueryClientProvider>
      </BrowserRouter>
    </ClerkProvider>
    
  </StrictMode>,
)
