import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

import router from './router';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';



const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        richColors 
        position="top-right"
        expand={true}
        closeButton
      />
    </AuthProvider>
  );
};

export default App;