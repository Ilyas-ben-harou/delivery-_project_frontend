import React from 'react';
import { AuthProvider } from './contexts/AuthContext';

import router from './router';
import { RouterProvider } from 'react-router-dom';



const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;