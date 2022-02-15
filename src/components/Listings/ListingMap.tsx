import React from "react";
import { ListingState } from ".";
import { Avatar, Center, Table } from '@mantine/core';

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
          <tr key={index} style={{cursor: 'pointer'}} onClick={() => this.toggleListing(listing.id)}>
          <td style={{textAlign: 'center'}}>{index + 1}</td>
          <td style={{textAlign: 'center'}}>{listing.title}</td>
          <td style={{textAlign: 'center'}}>${listing.price} USD</td>
          <td style={{textAlign: 'center'}}>{listing.description}</td>
          <td style={{textAlign: 'center'}}>{listing.tag.map(tag => {
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
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Description</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Price</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Tags</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Image</th>
          </tr>
        </thead>
        <tbody>{this.listingMap()}</tbody>
      </Table>
    )
  }
}