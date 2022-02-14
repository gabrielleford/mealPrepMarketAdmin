import React from "react";
import { Navigate } from 'react-router-dom';
import { BiLogOutCircle } from 'react-icons/bi';
import { Button, Container, Group } from '@mantine/core';
import { AppProps } from "../../App";

type NavbarProps = {
  active: AppProps['active'],
  sessionToken: AppProps['sessionToken'],
  clearToken: AppProps['clearToken'],
  setActive: AppProps['setActive'],
}

type NavbarState = {

}

export default class Navbar extends React.Component<NavbarProps, NavbarState> {
  constructor(props:NavbarProps) {
    super(props)

    this.state={

    }
  }

  render(): React.ReactNode {
    return (
      <>
        {this.props.sessionToken && 
          <Container mt='xl'>
            <Group>
              <label className="activeContainer" htmlFor="users">
                <input id='users' name="radio" type='radio' className="activeInput" defaultChecked value={this.props.active} onChange={() => this.props.setActive('users')} />
                <span id='usersBtn' className="activeLabel" onChange={() => this.props.setActive('users')} >Users</span>
              </label>
              <label className="activeContainer" htmlFor="listings">
                <input id='listings' name="radio" type='radio' className="activeInput" value={this.props.active} onChange={() => this.props.setActive('listings')} />
                <span id='listingsBtn' className="activeLabel" onChange={() => this.props.setActive('listings')}>Listings</span>
              </label>
              <label className="activeContainer" htmlFor="orders">
                <input id="orders" name="radio" type='radio' className="activeInput" value={this.props.active} onChange={() => this.props.setActive('orders')} />
                <span id='ordersBtn' className="activeLabel" onChange={() => this.props.setActive('orders')}>Orders</span>
              </label>
              {this.props.sessionToken &&
              <Button variant='subtle' sx={{color: '#05386b', borderRadius: '15px', fontFamily: 'Montserrat, sans-serif', fontWeight: '400', fontSize: '1rem', width: 'fit-content'}} leftIcon={<BiLogOutCircle/>} onClick={this.props.clearToken}>Logout</Button>}
            </Group>
        </Container>}
            {this.props.active === 'users' ?
              <Navigate to='/users' replace={true} /> :
            this.props.active === 'listings' ?
              <Navigate to='/listings' replace={true} /> :
            this.props.active === 'orders' ?
              <Navigate to='/orders' replace={true} /> : ''
            }
      </>
    )
  }
}