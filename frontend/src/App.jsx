import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import Navbar from './components/Navbar/Navbar';
import { LoginForm } from './pages/Login/Login';
import Account from './pages/Account/Account';

function App() {
  console.log('App rendered !');

  return (
    <Layout>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="counter" element={<Counter />} />
        <Route path="user" element={<Users />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="about" element={<About />} />
        <Route path="account" element={<Account />} />
      </Routes>
    </Layout>
  );
}

export default App;
