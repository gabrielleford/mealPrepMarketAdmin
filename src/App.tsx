import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, MantineProvider } from '@mantine/core';
import Navbar from './components/Navbar';
import Login from './components/Auth';
import Users from './components/Users';
import Listings from './components/Listings';
import Orders from './components/Orders';

function App() {
  return (
    <MantineProvider theme={{
      fontFamily: 'Open Sans, sans-serif',
      headings: {fontFamily: 'Montserrat'},
      colors: {
        primary: ['#c0f1d6', '#abedc9', '#96e8bb',  '#82e3ae', '#5cdb95', '#43d685', '#2ed177', '#29bc6b', '#209254', '#1c7d48'   ],
        secondary: ['#cee6fd', '#b6d9fc', '#9eccfa', '#6db3f8', '#05386b', '#0b80f4', '#0966c3', '#074d92', '#3c99f6', '#053361']
      },
      primaryColor: 'primary',
    }}>
      <Container>
        <Router>
          <Navbar />

          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/users' element={<Users />} />
            <Route path='/listings' element={<Listings />} />
            <Route path='/orders' element={<Orders />} />
          </Routes>
        </Router>
      </Container>
    </MantineProvider>
  );
}

export default App;
