import React from "react";
import APIURL from "../helpers/environment";
import { Navigate } from 'react-router-dom';
import { AppProps } from "../../App";
import { Container } from '@mantine/core';
import UserMap from "./UserMap";

export type UserProps = {
  sessionToken: AppProps['sessionToken'],
  user: AppProps['user'],
  dlt: AppProps['dlt'],
  what: AppProps['what'],
  endpointID: AppProps['endpointID'],
  response: AppProps['response'],
  setActive: AppProps['setActive'],
  setDlt: AppProps['setDlt'],
  setWhat: AppProps['setWhat'],
  setEndpointID: AppProps['setEndpointID'],
  setResponse: AppProps['setResponse'],
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
        return res.json()
      })
      .then(res => {
        this.state._isMounted && this.setState({
          users: [...res]
        })
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
    this.props.setActive('1');
    this.setState({
      _isMounted: true,
    })
  }

  componentDidUpdate(prevProps:Readonly<UserProps>, prevState:Readonly<UserState>) {
    if (this.state._isMounted !== prevState._isMounted && this.state._isMounted === true) {
      this.fetchUsers();
    }
  }

  componentWillUnmount() {
    this.setState({
      _isMounted: false
    })
  }

  render(): React.ReactNode {
    return (
      <Container mt={'60px'}>
        <UserMap users={this.state.users} app={{...this.props}} />
        {!localStorage.getItem('Authorization') && <Navigate to='/' replace={true} />}
      </Container>
    )
  }
}