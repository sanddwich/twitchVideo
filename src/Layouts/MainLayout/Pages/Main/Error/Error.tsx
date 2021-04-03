import React from 'react'
import { Container } from 'react-bootstrap'
import './Error.scss'

interface ErrorProps {}

interface ErrorState {}

export default class Error extends React.Component<ErrorProps, ErrorState> {
  render() {
    return (
      <Container className="Error d-flex justify-content-center text-danger">
        <h1>Видеороликов не обнаружено!</h1>
      </Container>
    )
  }
}
