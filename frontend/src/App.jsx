import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import Navbar from './components/Navbar/Navbar';
import SearchResults from './pages/SearchResults/SearchResults';
import MoviePage from './pages/Movies/MoviePage';
import Login from './pages/Login/Login';
import Account from './pages/Account/Account';
import SwipePage from './pages/Swipe/SwipePage';

function App() {
  console.log('App rendered !');

  return (
    <Layout>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="counter" element={<Counter />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="login" element={<Login />} />
        <Route path="account" element={<Account />} />
        <Route path="/swipe" element={<SwipePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
