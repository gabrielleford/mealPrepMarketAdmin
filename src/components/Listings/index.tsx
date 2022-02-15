import React from 'react';
import { Container } from '@mantine/core';
import { AppProps } from '../../App';
import APIURL from '../helpers/environment';
import ListingMap from './ListingMap';

type ListingProps = {
  setActive: AppProps['setActive'],
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
      _isMounted: false
    }
  }

  fetchListings = async ():Promise<void> => {
    await fetch(`${APIURL}/listing/`, {
      method: "GET",
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
    .then(res => {
      console.log(res)
      return res.json()
    })
    .then(res => {
      console.log(res)
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
  }

  componentWillUnmount() {
    this.setState({
      _isMounted: false,
    })
  }

  render(): React.ReactNode {
    return (
      <Container mt={'60px'}>
        <ListingMap listings={this.state.listings} />
      </Container>
    )
  }
}