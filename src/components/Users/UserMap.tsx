import React from "react";
import { Navigate } from 'react-router-dom';
import { UserState } from ".";
import { Avatar, Center, Table } from '@mantine/core';

type MapProps = {
  users: UserState['users'],
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
            <tr key={index} style={{cursor: 'pointer'}} onClick={() => this.toggleUser(user.id)}>
              <td>
                <Center>
                  <Avatar radius='xl' size='lg' src={user.profilePicture} />
                </Center>
                </td>
                <td style={{textAlign: 'center'}}>{index + 1}</td>
                {(user.role === 'main admin' || user.role === 'admin') ?
                  <td style={{textAlign: 'center'}}>Admin</td> :
                  user.role === 'primary' ?
                  <td style={{textAlign: 'center'}}>Meal Prepper</td> :
                  user.role === 'secondary' ?
                  <td style={{textAlign: 'center'}}>Consumer</td> : <td></td>
                }
                <td style={{textAlign: 'center'}}>{user.firstName}</td>
                <td style={{textAlign: 'center'}}>{user.lastName}</td>
                <td style={{textAlign: 'center'}}>{user.email}</td>
                <td style={{textAlign: 'center'}}>{user.profileDescription}</td>
              </tr>
        )
      })
    )
  }

  componentDidMount() {
    this.setState({
      _isMounted: true
    })
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
          </tr>
        </thead>
        <tbody>{this.userMap()}</tbody>
        {this.state.route !== '' && <Navigate to={`/user/${this.state.route}`} replace={true} />}
      </Table>
    )
  }
}

