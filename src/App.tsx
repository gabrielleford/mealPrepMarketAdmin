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
import UserInfo from './components/Users/UserByID/UserInfo';
import ListingById from './components/Listings/ListingByID';
import CreateListing from './components/Listings/Create';

export type AppProps = {
  sessionToken: string | null,
  active: string
  what: string
  dlt: boolean
  response: number,
  endpointID: string,
  prevPath: string,
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
  setWhat: (what: string) => void,
  setDlt: (dlt: boolean) => void,
  setResponse: (response: number) => void,
  setEndpointID: (endpointID: string) => void,
  setPrevPath: (prevPath: string) => void,
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
  const [active, setActive] = useState<string>(!localStorage.getItem('Authorization') ? '' : 'users');
  const [what, setWhat] = useState<string>('');
  const [dlt, setDlt] = useState<boolean>(false);
  const [endpointID, setEndPointID] = useState<string>('');
  const [response, setResponse] = useState<number>(0);
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
    setWhat('');
    setDlt(false);
    setResponse(0);
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
        primary: ['#c0f1d6', '#abedc9', '#96e8bb',  '#82e3ae', '#2ed177', '#43d685', '#5cdb95', '#29bc6b', '#209254', '#1c7d48'   ],
        secondary: ['#cee6fd', '#b6d9fc', '#9eccfa', '#6db3f8', '#0b80f4', '#0966c3', '#05386b', '#074d92', '#3c99f6', '#053361'],
        ternary: ['#edf5e1']
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
            {!localStorage.getItem('Authorization') && 
              <Route path='/' element={<Login
                  sessionToken={sessionToken}
                  updateToken={updateToken}
                  setSessionToken={setSessionToken}
                  setActive={setActive}
                />} 
              />
            }
            <Route path='/users' element={<Users 
                sessionToken={sessionToken}
                user={user}
                dlt={dlt}
                what={what}
                endpointID={endpointID}
                response={response}
                setActive={setActive}
                setDlt={setDlt}
                setWhat={setWhat}
                setEndpointID={setEndPointID}
                setResponse={setResponse}
              />} 
              />
            <Route path='/user/:id' element={
              <UserInfo
                sessionToken={sessionToken}
                dlt={dlt}
                what={what}
                active={active}
                response={response}
                endpointID={endpointID}
                setEndpointID={setEndPointID}
                setResponse={setResponse}
                setWhat={setWhat}
                setActive={setActive}
                setDlt={setDlt}
              />} 
            />
            <Route path='/listings' element={
              <Listings 
                sessionToken={sessionToken}
                dlt={dlt}
                what={what}
                response={response}
                endpointID={endpointID}
                setEndpointID={setEndPointID}
                setResponse={setResponse}
                setActive={setActive}
                setDlt={setDlt}
                setWhat={setWhat}
              />} 
            />
            <Route path='/listing/:id' element={
              <ListingById
                sessionToken={sessionToken}
                dlt={dlt}
                what={what}
                response={response}
                endpointID={endpointID}
                setEndpointID={setEndPointID}
                setResponse={setResponse}
                setWhat={setWhat}
                setActive={setActive}
                setDlt={setDlt}
              />}
            />
            <Route path='/create' element={
              <CreateListing
                sessionToken={sessionToken}
                setActive={setActive}
              />}
            />
            <Route path='/orders' element={
              <Orders 
                sessionToken={sessionToken}
                dlt={dlt}
                what={what}
                response={response}
                endpointID={endpointID}
                setEndpointID={setEndPointID}
                setResponse={setResponse}
                setActive={setActive}
                setWhat={setWhat}
                setDlt={setDlt}
              />} 
            />
          </Routes>
        </Router>
      </Container>
    </MantineProvider>
  );
}

export default App;
