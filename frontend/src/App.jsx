import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import Navbar from './components/Navbar/Navbar';

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
      </Routes>
    </Layout>
  );
}

export default App;
