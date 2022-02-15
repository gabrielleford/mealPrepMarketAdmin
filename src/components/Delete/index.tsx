import React from "react";
import APIURL from "../helpers/environment";
import { Navigate } from 'react-router-dom';
import { Button, Center, Container, Group, Image, Modal, Paper, Text, Title } from '@mantine/core';
import { AppProps } from "../../App";

type DeleteProps = {
  sessionToken: AppProps['sessionToken'],
  endpointID: AppProps['endpointID'],
  what: AppProps['what'],
  dlt: AppProps['dlt'],
  response: AppProps['response'],
  setDlt: AppProps['setDlt'],
  setEndpointID: AppProps['setEndpointID'],
  setResponse: AppProps['setResponse'],
}

type DeleteState = {
  number: number,
  max: number,
  min: number,
  randGifs: string[],
  gif: string,
  endpoint: string,
  _isMounted: boolean,
}

export default class ConfirmDelete extends React.Component<DeleteProps, DeleteState> {
  constructor(props:DeleteProps) {
    super(props)

    this.state = {
      number: 0,
      max: 14,
      min: 1,
      randGifs: ['', 'https://media.giphy.com/media/uUFuppAa2AU7mfQFoo/giphy-downsized-large.gif', 'https://media.giphy.com/media/nltL8wnwoOYyPI6VPu/giphy.gif', 'https://media.giphy.com/media/3ohzAKkcyuLEIiI9Wg/giphy.gif', 'https://media.giphy.com/media/Qvq2680UHZ7vgxUeDh/giphy-downsized-large.gif', 'https://media.giphy.com/media/2KVfyCSkwyh4IWNHHk/giphy.gif', 'https://media.giphy.com/media/qJPM6zdMAL39wLoKJx/giphy.gif', 'https://media.giphy.com/media/1swY7LHRqVwzivnvgI/giphy.gif', 'https://media.giphy.com/media/h45zAKT2Np2ZS5tHvk/giphy.gif', 'https://media.giphy.com/media/pICj6JWqVpm5aapOIS/giphy.gif', 'https://media.giphy.com/media/8vR5eRDdPYHQq4n7jh/giphy.gif', 'https://media.giphy.com/media/26tn0dQX4oeqrhZni/giphy.gif', 'https://media.giphy.com/media/5b5OU7aUekfdSAER5I/giphy.gif', 'https://media.giphy.com/media/28I5KEqbxUEafaeNtV/giphy.gif', 'https://media.giphy.com/media/nqHj2YRYma2m2fRKrY/giphy.gif'],
      gif: '',
      endpoint: '',
      _isMounted: false,
    }
  }

  grabGif = ():void => {
    this.setState({
      number: Math.floor(Math.random() * (this.state.max - this.state.min + 1) + this.state.min)
    })
  }

  setGif = (num:number):void => {
    this.setState({
      gif: this.state.randGifs[num]
    })
  }

  setWhat = ():void => {
    switch(this.props.what) {
      // case 'listing':
      //   this.setState({
      //     endpoint: `/listing/${this.props.listingID}`
      //   });
      //   break;
      // case 'user':
      //   this.setState({
      //     endpoint: `/user/${this.props.app.userId}`
      //   })
      //   break;
      case 'order':
        this.setState({

        })
        break;
    }
  }

  delete = async ():Promise<void> => {
    console.log(`${this.props.what} deleted`);
    this.props.setResponse(200);
    // await fetch(`${APIURL}${this.state.endpoint}`, {
    //   method: 'DELETE',
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //     authorization: `Bearer ${this.props.app.sessionToken}`
    //   })
    // })
    // .then(res => {
    //   this.state._isMounted && this.props.app.setResponse(res.status);
    //   return res.json();
    // })
    // .then(res => {
    //   this.state._isMounted && console.log(res);
    // })
  }

  componentDidMount() {
    this.setState({
      _isMounted: true
    });
    this.grabGif();
    this.setWhat();
  }

  componentDidUpdate(prevProps:Readonly<DeleteProps>, prevState:Readonly<DeleteState>) {
    if (this.state.number !== prevState.number)
    this.setGif(this.state.number);
  }

  componentWillUnmount() {
    this.setState({
      _isMounted: false
    });
    this.props.setDlt(false);
  }

  render(): React.ReactNode {
    return (
      <Container>
        <Modal id='modal' centered={true} padding='xl' opened={this.props.dlt} onClose={() => this.props.setDlt(false)}>
            <Center>
              <Title mt={-50} sx={{color: '#5cdb95'}} order={1}>Are you sure?</Title>
            </Center>
            <Image sx={{margin: '0 auto'}} src={this.state.gif} />
            <Center>

            <Text>This is <strong>irreversible</strong></Text>
            </Center>
            <Group position="center">
              <Button className="formButton" size="lg" radius='md' compact>Delete</Button>
              <Button className="formButton" size='lg' radius='md' compact onClick={() => this.props.setDlt(false)}>Cancel</Button>
            </Group>
        </Modal>
        {(this.props.what === 'user' && this.props.response === 200) ?
          <Navigate to='/users' replace={true} /> :
        (this.props.what === 'listing' && this.props.response === 200) ?
          <Navigate to='/listings' replace={true} /> :
        (this.props.what === '/order' && this.props.response === 200) ?
          <Navigate to='/orders' replace={true} /> :
        !localStorage.getItem('Authorization') ?
          <Navigate to='/' replace={true} /> : ''
        }
      </Container>
    )
  }
}