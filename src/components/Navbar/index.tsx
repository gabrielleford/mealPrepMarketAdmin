import React from "react";
import { Link } from 'react-router-dom';
import { Container, Tabs } from '@mantine/core';

export default class Navbar extends React.Component {
  render(): React.ReactNode {
    return (
      <Container>
        <Tabs variant="outline" tabPadding='xl'>
          <Tabs.Tab label='Users' />
          <Tabs.Tab label='Listings' />
          <Tabs.Tab label='Orders' />
        </Tabs>
      </Container>
    )
  }
}