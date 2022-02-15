import React from 'react';
import { Container } from '@mantine/core';
import { AppProps } from '../../App';

type ListingProps = {
  setActive: AppProps['setActive'],
}

export default class Listings extends React.Component<ListingProps> {
  constructor(props:ListingProps) {
    super(props)

    this.state = {
      
    }
  }

  componentDidMount() {
    this.props.setActive('2');
  }

  render(): React.ReactNode {
    return (
      <Container>
        
      </Container>
    )
  }
}