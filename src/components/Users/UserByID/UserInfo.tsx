import React from "react";
import APIURL from "../../helpers/environment";
import { Navigate } from 'react-router-dom';
import { AppProps } from "../../../App";
import UserEdit from "./UserEdit";
import { Card, Container } from '@mantine/core';

export type UserProps = {
  sessionToken: AppProps['sessionToken'],
  dlt: AppProps['dlt']
  what: AppProps['what'],
  active: AppProps['active'],
  response: AppProps['response'],
  endpointID: AppProps['endpointID'],
  setEndpointID: AppProps['setEndpointID'],
  setWhat: AppProps['setWhat'],
  setActive: AppProps['setActive'],
  setDlt: AppProps['setDlt'],
  setResponse: AppProps['setResponse'],
}

export type UserState = {
  profileID: string,
  fetchedUser: {
    id: string,
    role: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string,
    profileDescription: string,
  }
  _isMounted: boolean,
}

export default class UserInfo extends React.Component<UserProps, UserState> {
  constructor(props:UserProps) {
    super(props)

    this.state = {
      profileID: window.location.pathname.slice(6, 42),
      fetchedUser: {
        id: '',
        role: '',
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: '',
        profileDescription: '',
      },
      _isMounted: false,
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name !== 'image') {
      this.setState(prevState => ({
        fetchedUser: {
          ...prevState.fetchedUser,
          ...this.state,
          [e.target.name]: e.target.value,
        }
      }))
    }
  }

  changeRoleInfo = (role: string) => {
    this.setState(prevState => ({
      fetchedUser: {
        ...prevState.fetchedUser,
        role: role
      }
    }))
  }

  setUser = (user: {
    id: string,
    role: string,
    firstName: string,
    lastName: string,
    email: string,
    profilePicture: string,
    profileDescription: string,
  }) => {
    this.setState({
      fetchedUser: user
    })
  }

  fetchUser = async ():Promise<void> => {
    await fetch(`${APIURL}/admin/any/${this.state.profileID}`, {
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
        fetchedUser: res
      })
      this.props.setEndpointID(res.id)
    })
  }

  renderComponent = () => {
    return (
    <Container id='userInfo'>
      <Card id='userCard' radius='lg' sx={{padding: '60px 0', width: '90%', margin: 'auto'}}>
        <UserEdit fetchedUser={this.state.fetchedUser} handleChange={this.handleChange} changeRoleInfo={this.changeRoleInfo} setUser={this.setUser} app={{...this.props}} fetchUser={this.fetchUser}/>
      </Card>
      {
        !localStorage.getItem('Authorization') &&
        <Navigate to='/' replace={true} />
      }
    </Container>
    )
  }

  // ** Lifecycle ** //
  componentDidMount() {
    this.setState({
      _isMounted: true,
    });
    this.props.setResponse(0);
    this.fetchUser();
    this.props.setDlt(false);
    this.props.setWhat('user');
    this.props.setActive('empty')
  }

  componentWillUnmount() {
    this.setState({
      fetchedUser: {
        id: '',
        role: '',
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: '',
        profileDescription: '',
      },
      _isMounted: false,
    });
  }

  render(): React.ReactNode {
    return (
      <>  
        {this.renderComponent()}
        {this.props.active === 'users' ?
          <Navigate to='/users' replace={true} /> :
        this.props.active === 'listings' ?
          <Navigate to='/listings' replace={true} /> :
        this.props.active === 'orders' ?
          <Navigate to='/orders' replace={true} /> : ''
        }
        {!localStorage.getItem('Authorization') && <Navigate to='/' replace={true}/>}
      </>
    )
  }
}