import React from "react";
import { Navigate } from 'react-router-dom';
import { ListingState } from ".";
import { ListingProps } from ".";
import ConfirmDelete from "../Delete";
import { Avatar, Button, Center, Spoiler, Table, Text } from '@mantine/core';

type MapProps = {
  listings: ListingState['listings']
  app: ListingProps
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
          <tr key={index}>
          <td style={{textAlign: 'center'}} onClick={() => this.toggleListing(listing.id)}>{index + 1}</td>
          <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleListing(listing.id)}>
            <Center>
              <Avatar size='lg' src={listing.image} />
            </Center>
          </td>
          <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleListing(listing.id)}>{listing.title}</td>
          <td style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.toggleListing(listing.id)}>${listing.price} USD</td>
          <td style={{textAlign: 'center', maxWidth: '100px'}}>
            <Spoiler maxHeight={45} showLabel='View more' hideLabel='Show less'>
              {listing.description}
            </Spoiler></td>
          <td style={{textAlign: 'center', height: 'fit-content'}}>
              <Spoiler maxHeight={50} showLabel='View more' hideLabel='Show less'>
                  {listing.tag.map(tag => {
                  return(
                    <Text key={tag}>{tag}</Text>
                  )
                })}
              </Spoiler>
            </td>
          <td 
            className='tableDlt' 
            style={{textAlign: 'center', cursor: 'pointer'}}>
              <Button 
                className="formButton"
                compact
                onClick={() => {
                  this.props.app.setEndpointID(listing.id)
                  this.props.app.setDlt(true)}}>
                Delete
              </Button>
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
    this.props.app.setWhat('listing')
  }

  componentDidUpdate(prevProps:Readonly<MapProps>, prevState:Readonly<MapState>) {
    if (this.props.listings.length !== prevProps.listings.length) {
      this.listingMap();
    }
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
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Image</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Price</th>
            <th style={{textAlign: 'center', color: '#edf5e1', maxWidth: '100px'}}>Description</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Tags</th>
            <th style={{textAlign: 'center', color: '#edf5e1'}}>Options</th>
          </tr>
        </thead>
        <tbody>{this.listingMap()}</tbody>
        {this.props.app.dlt && <ConfirmDelete sessionToken={this.props.app.sessionToken} what={this.props.app.what} dlt={this.props.app.dlt} setDlt={this.props.app.setDlt} endpointID={this.props.app.endpointID} setEndpointID={this.props.app.setEndpointID} response={this.props.app.response} setResponse={this.props.app.setResponse}/>}
        {this.state.route !== '' && <Navigate to={`/listing/${this.state.route}`} replace={true} />}
      </Table>
    )
  }
}