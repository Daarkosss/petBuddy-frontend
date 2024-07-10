import Home from './pages/Home';
import LoginPage from './pages/LoginPage'
import { Route, Routes, Navigate } from 'react-router-dom';

function App() {

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
