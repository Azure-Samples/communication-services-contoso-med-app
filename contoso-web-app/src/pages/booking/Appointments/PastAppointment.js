import React, { Component } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './PastAppointment.css';

class PastAppointment extends Component {
    render() {
        return (<>
            <Card className="doctor-card">
                <Row>
                    <Col className="doctor-profile-column" xs={2} md={2} lg={2} style={{ maxWidth: '108px' }} >
                        <img className="doctor-profile" src="https://www.shareicon.net/data/512x512/2016/08/18/813844_people_512x512.png" alt="" />
                    </Col>
                    <Col xs={4} md={4} lg={3}>
                        <Card.Title>
                            Dr. John Shaw
                        </Card.Title>
                        <Card.Subtitle className="text-secondary">
                            Dentist
                        </Card.Subtitle>
                        <Row className="m-0 mt-4">
                            <i className="far fa-check-circle doctor-info-icons text-secondary"></i>
                            <div className="text-secondary doctor-info-text"><b>Experience: </b>9 years</div>
                        </Row>
                    </Col>
                    <Col className="doctor-info-column" xs={4} md={4} lg={3}>
                        <Row className="doctor-info-row">
                            <div className="text-secondary" style={{ fontSize: 'small' }}>
                                <b>Booked Slot</b><br />
                                02:30 PM, Monday, 22 August 2020
                            </div>
                        </Row>
                        <Row className="doctor-info-row" style={{ marginTop: '34px', marginBottom: '0px' }}>
                            <div className="completed" style={{ fontSize: 'small' }}><b>Completed</b></div>
                        </Row>
                    </Col>
                    <Col className="book-consultation-column">
                        <div style={{ position: 'absolute', right: '12px', bottom: '10px' }}>
                            <Row className="book-consultation-row">
                                <Col lg={2}>
                                    <button className="profile-btn btn-group-item"><i className="fas fa-phone-alt"></i></button>
                                </Col>
                                <Col lg={2}>
                                    <button className="chat-btn btn-group-item"><i className="fas fa-comment-alt"></i></button>
                                </Col>
                                <Col lg={8}>
                                    <button className="feedback-btn">Leave Feedback</button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Card>
        </>);
    }
}

export default PastAppointment;