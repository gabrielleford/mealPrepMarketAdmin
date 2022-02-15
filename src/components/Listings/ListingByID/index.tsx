import React from "react";
import APIURL from "../../helpers/environment";
import { Link, Navigate } from "react-router-dom";
import { AppProps } from "../../../App";
import { BsEmojiDizzy, BsEmojiFrown } from 'react-icons/bs';
import { Alert, Badge, Button, Card, Center, Container, Grid, Group, Image, Select, Text, Title } from "@mantine/core";
import ListingEdit from "./ListingEdit";

export type ListingProps = {
  sessionToken: AppProps['sessionToken'],
  setActive: AppProps['setActive'],
}

export type ListingState = {
  listingID: string,
  fetchedListing: {
    title: string,
    description: string,
    image: string,
    price: number,
    tag: string,
    ownerID: string,
    user: {
      firstName: string,
      lastName: string,
    },
  }
  quantity: string | null,
  fulfillmentMethod: string,
  responseCode: number,
  _isMounted: boolean,
}

class ListingById extends React.Component<ListingProps, ListingState> {
  constructor(props: ListingProps) {
    super(props)

    this.state = {
      listingID: window.location.pathname.slice(9, 45),
      fetchedListing: {
        title: '',
        description: '',
        image: '',
        price: 0,
        tag: '',
        ownerID: '',
        user: {
          firstName: '',
          lastName: '',
        },
      },
      quantity: '',
      fulfillmentMethod: 'pickup',
      responseCode: 0,
      _isMounted: false,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  fetchListing = async ():Promise<void> => {
    await fetch(`${APIURL}/listing/${this.state.listingID}`,{
      method: "GET",
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    })
    .then(res => res.json())
    .then(res => {
      this.state._isMounted && this.setState({
        fetchedListing: res
      })
      // this.state._isMounted && this.props.setWhat('listing');
    })
    .catch(error => console.log(error))
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setState(prevState => ({
      fetchedListing: {
        ...prevState.fetchedListing,
        ...this.state,
        [e.target.name]: e.target.value,
      }
    }))
  }

  componentDidMount() {
    this.props.setActive('empty');
    this.setState({
      _isMounted: true
    })
    this.fetchListing();
    // this.props.setPrevPath(window.location.pathname);
  }

  componentWillUnmount() {
    this.setState({
      _isMounted: false
    })
    // this.props.setDelete(false);
    // this.setState({
    //   ownerID: '',
    // })
  }

  render(): React.ReactNode {
      return (
        <Container id='listingById' mt={-115} size={700}>
          {/* {this.props.dlt && 
            <ConfirmDelete what={this.props.what} dlt={this.props.dlt} listingID={this.state.listingID} sessionToken={this.props.sessionToken} user={this.props.user} setDelete={this.props.setDelete} clearToken={this.props.clearToken} response={this.props.response} setResponse={this.props.setResponse} />
          } */}
          <Card radius='lg' padding='sm' className="listingCard">
            <ListingEdit sessionToken={this.props.sessionToken} fetchedListing={this.state.fetchedListing} handleChange={this.handleChange} />
              {/* <Center>
                <Card.Section>
                  <Image className="listingImg" radius={10} src={this.state.image} width={550} height={400} />
                </Card.Section>
              </Center>
              <Center>
              <Text mt={-7} className="description">{this.state.description}
              <br/>
                <Center>
                  <Badge mt={7} radius='lg' size="xl">${this.state.price} USD</Badge>
                </Center>
              </Text>
              </Center>
              <Group mt='md' position="center" spacing='xl'>
                <Button className="darkButton" radius='md' size='xl' compact onClick={this.editListing}>Edit</Button>
                <Button className="darkButton" radius='md' size='xl' compact>Delete</Button>
              </Group> */}
          </Card>
          {/* {this.props.response === 200 && this.state._isMounted ?
            <Navigate to='/' replace={true} /> :
            this.props.listingEdit ?
            <Navigate to={`/listing/edit/${this.state.listingID}`} replace={true} /> :
            this.state.responseCode === 201 ?
            <Navigate to={`/orders/${this.props.user.userId}`} replace={true} /> : ''
          } */}
        </Container>
      )
  }
}

export default ListingById;