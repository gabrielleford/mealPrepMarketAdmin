import React from "react";
import { Navigate } from 'react-router-dom';
import { Avatar, Center, Spoiler, Table } from '@mantine/core';
import { OrderState } from ".";

type MapProps = {
  orders: OrderState['orders']
}

type MapState = {
  route: string,
  routeTo: string,
  _isMounted: boolean,
}

export default class OrderMap extends React.Component<MapProps, MapState> {
  constructor(props:MapProps) {
    super(props)

    this.state = {
      route: '',
      routeTo: '',
      _isMounted: false,
    }
  }

  toggleRoute = (name: string, ID: string) => {
    switch(name) {
      case 'user':
        this.setState({
          route: ID,
          routeTo: 'user'
        })
        break;
      case 'listing':
        this.setState({
          route: ID,
          routeTo: 'listing'
        })
    }
  }

  renderQuantity = () => {

  }

  renderFulfillmentMethod = () => {
    
  }

  orderMap = () => {
    return (
      this.props.orders.map((order, index) => {
        return (
          <tr key={index}>
            <td style={{textAlign: 'center', cursor: 'pointer'}}>{index + 1}</td>
            <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleRoute('user', order.user.id)}>{order.user.firstName} {order.user.lastName}</td>
            <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleRoute('listing', order.listing.id)}>
              <Center>
                <Avatar size='lg' src={order.listing.image} />
              </Center>
            </td>
            <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleRoute('listing', order.listing.id)}>{order.listing.title}</td>
            <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleRoute('user',order.listing.user.id)}>{order.listing.user.firstName} {order.listing.user.lastName}</td>
            <td style={{textAlign: 'center'}}>{order.quantity}</td>
            <td style={{textAlign: 'center'}}>${order.quantity * order.listing.price} USD</td>
            <td style={{textAlign: 'center'}}>{order.fulfillmentMethod.charAt(0).toUpperCase() + order.fulfillmentMethod.slice(1)}</td>
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
      _isMounted: false
    })
  }

  render(): React.ReactNode {
    return (
      <Table mt='xl' sx={{background: '#05386b', color: '#edf5e1', borderRadius: '15px'}}>
        <thead>
          <tr>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>ID</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Customer</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Image</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Title</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Listing Owner</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Quantity</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Order Total</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Fulfillment Method</th>
          </tr>
        </thead>
        <tbody>{this.orderMap()}</tbody>
        {this.state.route !== '' && <Navigate to={`/${this.state.routeTo}/${this.state.route}`} replace={true} />}
      </Table>
    )
  }
}