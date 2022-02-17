import React from "react";
import { Navigate } from 'react-router-dom';
import { UserProps, UserState } from ".";
import { Avatar, Button, Center, Table } from '@mantine/core';
import ConfirmDelete from "../Delete";

type MapProps = {
  users: UserState['users'],
  app: UserProps
}

type MapState = {
  route: string,
  _isMounted: boolean,
}

export default class UserMap extends React.Component<MapProps, MapState> {
  constructor(props:MapProps) {
    super(props)

    this.state = {
      route: '',
      _isMounted: false
    }
  }

  toggleUser = (userID: string) => {
    this.setState({
      route: userID
    })
  }

  userMap = () => {
    return (
      this.props.users.map((user, index) => {
        return (
            <tr key={index}>
              <td style={{cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>
                <Center>
                  <Avatar radius='xl' size='lg' src={user.profilePicture} />
                </Center>
                </td>
                <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>{index + 1}</td>
                {(user.role === 'main admin' || user.role === 'admin') ?
                  <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>Admin</td> :
                  user.role === 'primary' ?
                  <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>Meal Prepper</td> :
                  user.role === 'secondary' ?
                  <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>Consumer</td> : <td></td>
                }
                <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>{user.firstName}</td>
                <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>{user.lastName}</td>
                <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>{user.email}</td>
                <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>{user.profileDescription}</td>
                {this.props.app.user.userId !== user.id && <td 
                  className='tableDlt' 
                  style={{textAlign: 'center', cursor: 'pointer'}}>
                    <Button 
                      className="formButton"
                      compact
                      onClick={() => {
                        this.props.app.setEndpointID(user.id)
                        this.props.app.setDlt(true)}}>
                      Delete
                    </Button>
                </td>}
              </tr>
        )
      })
    )
  }

  componentDidMount() {
    this.setState({
      _isMounted: true
    })
    this.props.app.setWhat('user');
  }

  componentWillUnmount() {
    this.setState({
      route: '',
      _isMounted: false
    })
  }

  render(): React.ReactNode {
    return (
      <Table mt='xl' sx={{background: '#05386b', color: '#edf5e1', borderRadius: '15px'}}>
        <thead>
          <tr>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Profile Picture</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>ID</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Role</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>First Name</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Last Name</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Email</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Profile Description</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Options</th>
          </tr>
        </thead>
        <tbody>{this.userMap()}</tbody>
        {this.props.app.dlt && <ConfirmDelete sessionToken={this.props.app.sessionToken} what={this.props.app.what} dlt={this.props.app.dlt} setDlt={this.props.app.setDlt} endpointID={this.props.app.endpointID} setEndpointID={this.props.app.setEndpointID} response={this.props.app.response} setResponse={this.props.app.setResponse}/>}
        {this.state.route !== '' && <Navigate to={`/user/${this.state.route}`} replace={true} />}
      </Table>
    )
  }
}

