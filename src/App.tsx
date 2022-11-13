import React from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
