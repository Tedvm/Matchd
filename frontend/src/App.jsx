import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import Navbar from './components/Navbar/Navbar';
import SearchResults from './pages/SearchResults/SearchResults';
import MoviePage from './pages/Movies/MoviePage'; // adapte le chemin si tu changes

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
      </Routes>
    </Layout>
  );
}

export default App;
