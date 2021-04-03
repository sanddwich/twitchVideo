import React from 'react'
import { Container } from 'react-bootstrap'
import './Loading.scss'

interface LoadingProps {}

interface LoadingState {}

export default class Loading extends React.Component<LoadingProps, LoadingState> {
  render() {
    return (
      <Container className="Loading d-flex justify-content-center">
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Container>
    )
  }
}
