import React, { Component } from 'react';
import {Call, DefiOption, Put} from '../models/option'
import {Container, Row, Col} from 'react-bootstrap'

export class Option extends Component<{option: DefiOption}, {}> {
  render() {
    let call: Call = this.props.option.call
    let put: Put = this.props.option.put
    return (
      <Container>
        <Row>
          <Col></Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
}