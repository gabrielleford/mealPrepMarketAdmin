import React from "react";
import APIURL from "../helpers/environment";
import { Navigate } from 'react-router-dom';
import { AppProps } from "../../App";
import OrderMap from "./OrderMap";
import { Container } from '@mantine/core';

export type OrderProps = {
  sessionToken: AppProps['sessionToken'],
  dlt: AppProps['dlt'],
  what: AppProps['what'],
  response: AppProps['response'],
  endpointID: AppProps['endpointID'],
  setEndpointID: AppProps['setEndpointID'],
  setActive: AppProps['setActive'],
  setWhat: AppProps['setWhat'],
  setDlt: AppProps['setDlt'],
  setResponse: AppProps['setResponse'],
}

export type OrderState = {
  orders: {
    id: string,
    fulfillmentMethod: string,
    listing: {
      id: string,
      title: string,
      image: string,
      price: number,
      user: {
        id: string,
        firstName: string,
        lastName: string,
      }
    },
    user: {
      id: string,
      firstName: string,
      lastName: string,
    },
    quantity: number,
  }[],
  _isMounted: boolean,
}

export default class Orders extends React.Component<OrderProps, OrderState> {
  constructor(props:OrderProps) {
    super(props)

    this.state = {
      orders: [{
        id: '',
        fulfillmentMethod: '',
        listing: {
          id: '',
          title: '',
          image: '',
          price: 0,
          user: {
            id: '',
            firstName: '',
            lastName: '',
          }
        },
        user: {
          id: '',
          firstName: '',
          lastName: '',
        },
        quantity: 0,
      }],
      _isMounted: false,
    }
  }

  fetchOrders = async ():Promise<void> => {
    await fetch(`${APIURL}/order/`, {
      method: 'GET',
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
        orders: [...res]
      })
    })
  }

  componentDidMount() {
    this.setState({
      _isMounted: true,
    })
    this.props.setActive('3');
    this.fetchOrders();
  }

  componentWillUnmount() {
    this.setState({
      _isMounted: false
    })
  }

  render(): React.ReactNode {
    return (
      <Container mt={'60px'}>
        <OrderMap orders={this.state.orders} app={{...this.props}} />
        {!localStorage.getItem('Authorization') && <Navigate to='/' replace={true}/>}
      </Container>
    )
  }
}