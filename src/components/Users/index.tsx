import React from "react";
import APIURL from "../helpers/environment";
import { Navigate } from 'react-router-dom';
import { AppProps } from "../../App";
import { Button, Container } from '@mantine/core';
import UserMap from "./UserMap";

type UserProps = {
  sessionToken: AppProps['sessionToken'],
  user: AppProps['user'],
  setActive: AppProps['setActive'],
}

export type UserState = {
  users: {
    id: string,
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
      users: [{ id: '', role: '', firstName: '', lastName: '', email: '', profilePicture: '', profileDescription: ''}],
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
      await fetch(`${APIURL}/user/users`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.props.sessionToken}`
        })
      })
      .then(res => {
        return res.json()
      })
      .then(res => {
        this.state._isMounted && this.setState({
          users: [...res]
        })
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

  // componentDidUpdate() {

  // }

  componentWillUnmount() {
    this.setState({
      _isMounted: false
    })
  }

  render(): React.ReactNode {
    return (
      <Container mt={'60px'}>
        <UserMap users={this.state.users} />
        {!localStorage.getItem('Authorization') && <Navigate to='/' replace={true} />}
      </Container>
    )
  }
}