import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import Navbar from './components/Navbar/Navbar';
import SearchResults from './pages/SearchResults/SearchResults';
<<<<<<< HEAD
import MoviePage from './pages/Movies/MoviePage'; // adapte le chemin si tu changes
=======
>>>>>>> 1ecf4a947633253a4de52726faa2a3f1272ea814
import Login from './pages/Login/Login';
import Account from './pages/Account/Account';

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
<<<<<<< HEAD
        <Route path="/movie/:id" element={<MoviePage />} />
=======
>>>>>>> 1ecf4a947633253a4de52726faa2a3f1272ea814
        <Route path="login" element={<Login />} />
        <Route path="account" element={<Account />} />
      </Routes>
    </Layout>
  );
}

export default App;
