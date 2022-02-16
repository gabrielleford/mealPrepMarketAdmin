import React from "react";
import APIURL from "../helpers/environment";
import { Button, Center, Container, Group, Image, Modal, Text, Title } from '@mantine/core';
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
      case 'listing':
        this.setState({
          endpoint: `/listing/${this.props.endpointID}`
        });
        break;
      case 'user':
        this.setState({
          endpoint: `/user/${this.props.endpointID}`
        })
        break;
      case 'order':
        this.setState({
          endpoint: `/order/${this.props.endpointID}`
        })
        break;
    }
  }

  delete = async ():Promise<void> => {
    console.log(`${this.props.what} deleted`);
    await fetch(`${APIURL}${this.state.endpoint}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.props.sessionToken}`
      })
    })
    .then(res => {
      this.state._isMounted && this.props.setResponse(res.status);
      return res.json();
    })
    .then(res => {
      this.state._isMounted && console.log(res);
    })
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
    this.props.setResponse(0);
  }

  render(): React.ReactNode {
    console.log(this.props.what);
    console.log(this.props.endpointID);
    console.log(this.state.endpoint);
    return (
      <Container>
        <Modal id='modal' radius='md' centered={true} padding='xl' opened={this.props.dlt} onClose={() => this.props.setDlt(false)}>
            <Center>
              <Title mt={-50} sx={{color: '#05386b'}} order={1}>Are you sure?</Title>
            </Center>
            <Image radius='sm' sx={{margin: '0 auto'}} src={this.state.gif} />
            <Center>
              <Text size='xl' sx={{color: '#05386b'}}>This is <strong>irreversible</strong></Text>
            </Center>
            <Group mt='xl' position="center">
              <Button className="formButton" size="lg" radius='md' compact onClick={this.delete}>Delete</Button>
              <Button className="formButton" size='lg' radius='md' compact onClick={() => this.props.setDlt(false)}>Cancel</Button>
            </Group>
        </Modal>
        {this.props.response === 200 && this.props.setDlt(false)}
      </Container>
    )
  }
}