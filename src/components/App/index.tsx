import React from 'react';
import Header from '../Header';
import Hero from '../Hero';
import Shortener from '../Shortener';
import Footer from '../Footer';
import HeaderBar from '../Header';
import { Container } from '@material-ui/core';

export default function App() {
  return (
    <Container>
      <Header />
      <Hero />
      <Shortener />
      <Footer />
    </Container>
  );
}
