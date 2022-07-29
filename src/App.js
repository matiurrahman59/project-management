import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
// styles
import './App.css';

// pages and component
import Dashboard from './pages/dashboard';
import Create from './pages/create';
import Login from './pages/login';
import Signup from './pages/signup';
import Project from './pages/project';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import RequireAuth from './component/RequireAuth';

function App() {
  const { authIsReady } = useAuthContext();
  return (
    <div className='App'>
      {authIsReady && (
        <>
          <Sidebar />
          <div className='container'>
            <Navbar />
            <Routes>
              {/* Protect this route if user not loged in */}
              <Route element={<RequireAuth />}>
                <Route path='/' element={<Dashboard />} />
                <Route path='/create' element={<Create />} />
              </Route>
              <Route path='/projects/:id' element={<Project />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />

              {/* catch all */}
              <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
