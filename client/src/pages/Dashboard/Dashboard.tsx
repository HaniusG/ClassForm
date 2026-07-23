import React from 'react'
import styles from './Dashboard.module.scss';
import Header from '../../components/Header/Header';
import Container from '../../components/Container/Container';

const Main = () => {
  return (
    <Container>
      <Header/>
      <div>Dashboard</div>
    </Container>
  )
}

export default Main