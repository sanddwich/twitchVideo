import React from 'react'
import { Container } from 'react-bootstrap'
import './Main.scss'
import SearchBlock from './SearchBlock/SearchBlock'

interface MainProps {}

interface MainState {}

class Main extends React.Component<MainProps, MainState> {
  render() {
    return (
      <Container fluid className="Main p-0">
        <SearchBlock />
      </Container>
    )
  }
}

export default Main