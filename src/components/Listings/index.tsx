import React from 'react';
import APIURL from '../helpers/environment';
import { Navigate } from 'react-router-dom';
import { AppProps } from '../../App';
import { Button, Container } from '@mantine/core';
import ListingMap from './ListingMap';

export type ListingProps = {
  sessionToken: AppProps['sessionToken'],
  dlt: AppProps['dlt'],
  what: AppProps['what'],
  response: AppProps['response'],
  endpointID: AppProps['endpointID'],
  setEndpointID: AppProps['setEndpointID'],
  setActive: AppProps['setActive'],
  setDlt: AppProps['setDlt'],
  setResponse: AppProps['setResponse'],
  setWhat: AppProps['setWhat'],
}

export type ListingState = {
  listings: {
    id: string,
    title: string,
    description: string,
    image: string,
    price: number,
    tag: string[]
  }[],
  create: boolean,
  _isMounted: boolean,
}

export default class Listings extends React.Component<ListingProps, ListingState> {
  constructor(props:ListingProps) {
    super(props)

    this.state = {
      listings: [{
        id: '',
        title: '',
        description: '',
        image: '',
        price: 0,
        tag: []
      }],
      create: false,
      _isMounted: false
    }
  }

  createListing = () => {
    this.setState({
      create: true
    })
  }

  fetchListings = async ():Promise<void> => {
    await fetch(`${APIURL}/listing/all`, {
      method: "GET",
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => {
      return res.json()
    })
    .then(res => {
      this.state._isMounted && this.setState({
        listings: [...res]
      })
    })
  }

  componentDidMount() {
    this.props.setActive('2');
    this.setState({
      _isMounted: true,
    })
    this.fetchListings()
    this.props.setDlt(false);
    this.props.setEndpointID('');
    this.props.setResponse(0);
    this.fetchListings();
  }

  componentDidUpdate(prevProps:Readonly<ListingProps>, prevState:Readonly<ListingState>) {
    if (this.props.response !== prevProps.response && this.props.response === 200) {
      this.fetchListings();
      this.props.setDlt(false);
      this.props.setEndpointID('');
      this.props.setResponse(0);
    }
  }

  componentWillUnmount() {
    this.setState({
      _isMounted: false,
    })
  }

  render(): React.ReactNode {
    return (
      <Container mt={'60px'}>
        <Button className='adminButton' color='secondary' size='lg' radius='lg' sx={{color: '#edf5e1'}} compact onClick={this.createListing}>Create</Button>
        <ListingMap listings={this.state.listings} app={{...this.props}} />
        {this.state.create && <Navigate to='/create' replace={true} />}
        {!localStorage.getItem('Authorization') && <Navigate to='/' replace={true}/>}
      </Container>
    )
  }
}