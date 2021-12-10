import './App.css';
import Navbar from './components/Nav/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LadingPage from './pages/LadingPage';
import Articles from './pages/Articles';
import { ProtectedRoutes } from './routes/ProtectedRoutes';
import ArticlesPlan from './pages/ArticlesPlan';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<LadingPage />} />
        <Route path='/articles' element={<ProtectedRoutes />}>
          <Route path='/articles' element={<Articles />} />
        </Route>
        <Route path='/article-plan' element={<ProtectedRoutes />}>
          <Route path='/article-plan' element={<ArticlesPlan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
