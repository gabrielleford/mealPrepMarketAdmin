import React from "react";
import APIURL from "../helpers/environment";
import { Navigate } from 'react-router-dom';
import { AppProps } from "../../App";
import { Container } from '@mantine/core';

type UserProps = {
  sessionToken: AppProps['sessionToken'],
  user: AppProps['user'],
  setActive: AppProps['setActive'],
}

type UserState = {
  users: {
    userId: string,
    role: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string,
    profileDescription: string,
  }[],
  _isMounted: boolean,
}

export default class Users extends React.Component<UserProps, UserState> {
  constructor(props:UserProps) {
    super(props)

    this.state = {
      users: [{ userId: '', role: '', firstName: '', lastName: '', email: '', profilePicture: '', profileDescription: ''}],
      _isMounted: false,
    }
  }

  fetchUsers = async ():Promise<void> => {
    if (this.props.user.role === 'main admin') {
      await fetch(`${APIURL}/user/admins`, {
        method: "GET",
        headers: new Headers({
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.props.sessionToken}`
        })
      })
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(res => {
        console.log(res)
      })
      .catch(error => console.log(error))
    } else {
      await fetch(`http://localhost:3001/user/users`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.sessionToken}`
        })
      })
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(res => {
        console.log(res)
      })
      .catch(error => console.log(error))
    }
  }

  componentDidMount() {
    this.props.setActive('');
    this.setState({
      _isMounted: true,
    })
    this.fetchUsers();
  }

  componentWillUnmount() {
    this.setState({
      _isMounted: false
    })
  }

  render(): React.ReactNode {
    return (
      <Container>
        {!localStorage.getItem('Authorization') && <Navigate to='/' replace={true} />}
      </Container>
    )
  }
}