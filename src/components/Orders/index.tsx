import React from "react";
import { Container } from '@mantine/core';
import { AppProps } from "../../App";

type OrderProps = {
  setActive: AppProps['setActive'],
}

export default class Orders extends React.Component<OrderProps> {
  constructor(props:OrderProps) {
    super(props)

    this.state = {
      
    }
  }

  componentDidMount() {
    this.props.setActive('3');
  }

  render(): React.ReactNode {
    return (
      <Container>

      </Container>
    )
  }
}