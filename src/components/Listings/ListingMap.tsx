import React from "react";
import { Navigate } from 'react-router-dom';
import { ListingState } from ".";
import { Avatar, Center, Spoiler, Table } from '@mantine/core';

type MapProps = {
  listings: ListingState['listings']
}

type MapState = {
  route: string,
  _isMounted: boolean,
}

export default class ListingMap extends React.Component<MapProps, MapState> {
  constructor(props:MapProps) {
    super(props)

    this.state = {
      route: '',
      _isMounted: false,
    }
  }

  toggleListing = (listingID: string) => {
    this.setState({
      route: listingID
    })
  }

  listingMap = () => {
    return (
      this.props.listings.map((listing, index) => {
        return (
          <tr key={index} style={{cursor: 'pointer'}}>
          <td style={{textAlign: 'center'}} onClick={() => this.toggleListing(listing.id)}>{index + 1}</td>
          <td style={{textAlign: 'center'}} onClick={() => this.toggleListing(listing.id)}>{listing.title}</td>
          <td style={{textAlign: 'center'}} onClick={() => this.toggleListing(listing.id)}>${listing.price} USD</td>
          <td style={{textAlign: 'center', maxWidth: '100px'}}>
            <Spoiler maxHeight={45} showLabel='View more' hideLabel='showLess'>
              {listing.description}
            </Spoiler></td>
          <td style={{textAlign: 'center'}} onClick={() => this.toggleListing(listing.id)}>{listing.tag.map(tag => {
            return(
              <p key={tag}>{tag}</p>
            )
          })}</td>
          <td>
            <Center>
              <Avatar size='lg' src={listing.image} />
            </Center>
          </td>
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
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Title</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Price</th>
            <th style={{textAlign: 'center', color: '#edf5e1', maxWidth: '100px'}}>Description</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Tags</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Image</th>
          </tr>
        </thead>
        <tbody>{this.listingMap()}</tbody>
        {this.state.route !== '' && <Navigate to={`/listing/${this.state.route}`} replace={true} />}
      </Table>
    )
  }
}