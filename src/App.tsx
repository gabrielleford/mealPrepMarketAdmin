import React, { useEffect, useState } from 'react';
import './App.css';
import APIURL from './components/helpers/environment';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, MantineProvider } from '@mantine/core';
import Navbar from './components/Navbar';
import Login from './components/Auth';
import Users from './components/Users';
import Listings from './components/Listings';
import Orders from './components/Orders';
import UserInfo from './components/Users/UserInfo';

export type AppProps = {
  sessionToken: string | null,
  active: string
  user: {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string,
    profileDescription: string,
    role: string
  },
  clearToken: () => void,
  updateToken: (newToken: string) => void,
  setSessionToken: (sessionToken: string | null) => void,
  setActive: (active:string) => void,
  setUser: (user: {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string,
    profileDescription: string,
    role: string
  }) => void,
}

function App() {
  const [sessionToken, setSessionToken] = useState<string | null>('');
  const [active, setActive] = useState<string>('');
  // const [what, setWhat] = useState<string>('');
  // const [dlt, setDelete] = useState<boolean>(false);
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  // const [response, setResponse] = useState<number>(0);
  const [user, setUser] = useState<{
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string,
    profileDescription: string,
    role: string}>({
      userId: '',
      firstName: '', 
      lastName: '', 
      email: '', 
      profilePicture: '', 
      profileDescription: '', 
      role: ''});

  const updateToken = (newToken:string) => {
    localStorage.setItem('Authorization', newToken);
    setSessionToken(newToken);
  }
  
  const clearToken = () => {
    localStorage.clear();
    setSessionToken('');
    // setWhat('');
    // setDelete(false);
    setUser({
      userId: '',
      firstName: '', 
      lastName: '', 
      email: '', 
      profilePicture: '', 
      profileDescription: '', 
      role: ''});
  }

  useEffect(() => {
    if (localStorage.getItem('Authorization'))
    setSessionToken(localStorage.getItem('Authorization')); 

      const fetchData = async ():Promise<void> => {
        if (sessionToken !== '' && user.userId === '') {
          await fetch(`${APIURL}/user/checkToken`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionToken}`
            }
          })
          .then(res => {
            return res.json()
          })
          .then(res => {
            setUser(res)
          })
          .then(() => user)
          .catch(error => console.log(error))
        } else if (user.userId !== '' && sessionToken === '') {
          setUser({
            userId: '',
            firstName: '', 
            lastName: '', 
            email: '', 
            profilePicture: '', 
            profileDescription: '', 
            role: ''});
        }
      }

      fetchData()

  }, [user, sessionToken])

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
          <Navbar 
            sessionToken={sessionToken}
            active={active}
            clearToken={clearToken}
            setActive={setActive}
          />

          <Routes>
            <Route path='/' element={<Login
                sessionToken={sessionToken}
                updateToken={updateToken}
                setSessionToken={setSessionToken}
                setUser={setUser}
              />} 
            />
            <Route path='/users' element={<Users 
                sessionToken={sessionToken}
                user={user}
                setActive={setActive} 
              />} 
              />
            <Route path='/user/:id' element={
              <UserInfo
              />} 
            />
            <Route path='/listings' element={
              <Listings 
                
                setActive={setActive} 
              />} 
            />
            <Route path='/orders' element={
              <Orders 
                setActive={setActive} 
              />} 
            />
          </Routes>
        </Router>
      </Container>
    </MantineProvider>
  );
}

export default App;
