import React, { useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'

import { connect } from "react-redux";
import { getActiveAppointments } from "../../../data/actions/appointment.actions";
import { constants } from "../../../config";

import './BookedAppointment.css';

const BookedAppointment = ({ appointmentsList, getActiveAppointments }) => {

    useEffect(() => {
        if (appointmentsList == undefined) getActiveAppointments();
    })

    const history = useHistory();

    return (
        <>
            {(appointmentsList != undefined && appointmentsList.length != 0) ? (
                appointmentsList.map(appointment => (
                    <Card className="doctor-card">
                        <Row>
                            <Col className="doctor-profile-column" xs={2} md={2} lg={2} style={{ maxWidth: '108px' }} >
                                <img className="doctor-profile" src={constants.endpoint + '/images/' + appointment.docInfo.pictureUrl} alt="" />
                            </Col>
                            <Col xs={4} md={4} lg={3}>
                                <Card.Title>
                                    {appointment.docInfo.name}
                                </Card.Title>
                                <Card.Subtitle className="text-secondary">
                                    {appointment.docInfo.speciality}
                                </Card.Subtitle>
                                <Row className="m-0 mt-4">
                                    <i className="far fa-check-circle doctor-info-icons text-secondary"></i>
                                    <div className="text-secondary doctor-info-text"><b>Experience: </b>{appointment.docInfo.experience} years</div>
                                </Row>
                            </Col>
                            <Col className="doctor-info-column" xs={4} md={4} lg={3}>
                                <Row className="doctor-info-row">
                                    <div className="text-secondary" style={{ fontSize: 'small' }}>
                                        <b>Booked Slot</b><br />
                                        <b style={{ color: 'black', fontSize: '14px' }}>{new Date(appointment.slot.startTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</b>
                                    </div>
                                </Row>
                                <Row className="doctor-info-row" style={{ marginTop: '34px', marginBottom: '0px' }}>
                                    <i className="far fa-clock doctor-info-icons" style={{ color: '#42d93d' }}></i>
                                    {/* <div className="text-secondary doctor-info-text" style={{ fontSize: 'small' }}><b>21 Min</b></div> */}
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
                                            <button className="join-call-btn" onClick={() => { history.push('/chat') }}>Start Conversation</button>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ))
            ) : (<div>No appointments available</div>)}
        </>);
}

const mapStateToProps = (globalState) => ({
    appointmentsList: globalState.appointments.appointmentsList
})

const mapDispatchToProps = {
    getActiveAppointments
}


export default connect(mapStateToProps, mapDispatchToProps)(BookedAppointment);