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
  },
  titleErr: boolean,
  descriptionErr: boolean,
  priceErr: boolean,
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
      titleErr: false,
      descriptionErr: false,
      priceErr: false,
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

    const {name, value} = e.target;
    this.checkValue(name, value);
  }

  checkValue = (name: string, value: string) => {
    switch (name) {
      case 'title': 
          value.length < 3 ? this.setState({
            titleErr: true
          }) : this.setState({
            titleErr: false
          })
        break;
      case 'description':
          value.length < 20 ? this.setState({
            descriptionErr: true
          }) : value.length > 2000 ? this.setState({
            descriptionErr: true
          }) : this.setState({
            descriptionErr: false
          })
        break;
      case 'price':
          +value < 1 ? this.setState({
            priceErr: true
          }) : +value > 999.99 ? this.setState({
            priceErr: true
          }) : this.setState({
            priceErr: false
          })
        break;
      }
    }

    handleNumber = (value: number) => {
      this.setState(prevState => ({
        fetchedListing: {
          ...prevState.fetchedListing,
          price: value
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
            <ListingEdit sessionToken={this.props.sessionToken} fetchedListing={this.state.fetchedListing} descriptionErr={this.state.descriptionErr} priceErr={this.state.priceErr} handleChange={this.handleChange} handleNumber={this.handleNumber} fetchListing={this.fetchListing} />
        </Container>
      )
  }
}

export default ListingById;