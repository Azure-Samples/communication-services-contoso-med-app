import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Carousel } from "react-bootstrap";
import ReadMoreReact from "read-more-react";
import { useLocation, useHistory } from 'react-router-dom';

import { connect } from "react-redux";
import { getDoctorById, bookAppointment } from "../../../data/actions/appointment.actions";
import { constants } from "../../../config";

import AppBar from '../../../shared/components/appbar/appbar'

import queryString from 'query-string';

import "./Booking.css";

const Booking = ({ docDetails, getDoctorById, bookAppointment, bookingSuccess }) => {

  const location = useLocation();
  var doctorId = queryString.parse(location.search).doctorId

  useEffect(() => {
    if (docDetails == undefined)
      getDoctorById(doctorId)
  });

  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedSlotId, setSelectedSlotId] = useState('0')

  const [patientDetails, setPatientDetails] = useState({
    patientName: '',
    patientPhone: '',
    smsAlert: false
  })

  const initiateAppointmentBooking = () => {
    console.log(docDetails.slots);
    bookAppointment(doctorId, selectedSlotId, {
      bookingType: "videoCall",
      docId: doctorId,
      patientName: patientDetails.patientName,
      patientPhone: patientDetails.patientPhone,
      smsAlert: patientDetails.smsAlert,
      slot: docDetails.slots.find(slot => slot.id == selectedSlotId)
    })
  };

  const history = useHistory();
  if (bookingSuccess) {
    history.push('/appointments')
  }

  let patientStory = (docName) => "We're so blessed to have this wonderful facility of consulting doctors online, I can affirm its ease of use and the treatment provided by Dr. " + docName + " was great and I was satisfied with the treatment and the consultation provided really helped me a lot to recover quickly.";
  let patientTestimonial = "We're so blessed to have this wonderful facility of consulting doctors online, I was very pleased with my experience at Contoso Med.";
  return (
    <>
      <AppBar title="Book Appointment" requireBackground="true" />
      {(docDetails !== undefined) ? (<Row className="p-5 m-0">
        <Col xs={8} md={8} lg={8}>
          <Card>
            <Card className="p-3">
              <Row>
                <Col
                  xs={3}
                  md={3}
                  lg={3}
                  style={{ maxWidth: "142px" }}
                  className="pr-0"
                >
                  <img
                    className="doctor-profile"
                    src={constants.endpoint + '/images/' + docDetails.pictureUrl}
                    alt=""
                  />
                </Col>
                <Col>
                  <Card.Title className="mb-1">Dr. {docDetails.name}</Card.Title>
                  <Row className="ml-0">
                    <div className="doctor-info-r1">
                      <div className="doctor-specialty text-secondary">
                        {docDetails.speciality}
                      </div>
                      <i className="far fa-check-circle doctor-info-icons text-secondary mr-1"></i>
                      <div className="doctor-experience text-secondary">
                        <b>Experience: </b>{docDetails.experience} years
                      </div>
                    </div>
                  </Row>
                  <Row className="ml-0 mt-3">
                    <div className="doctor-info-r2">
                      <div className="doctor-location text-secondary">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        {docDetails.location}
                      </div>
                    </div>
                  </Row>
                  <Row className="ml-0">
                    <div className="doctor-info-r3">
                      <div className="doctor-location text-secondary">
                        <i className="far fa-id-card mr-2"></i>
                        {docDetails.degree}
                      </div>
                    </div>
                  </Row>
                </Col>
              </Row>
              <Row className="p-3">
                <Card style={{ width: "100%" }}>
                  <Card.Header
                    style={{ background: "#446bc4" }}
                    className="card-header-title"
                  >
                    <button className=" card-header-icon">
                      <i className="fas fa-video text-center"></i>
                    </button>{" "}
                    Video Consultation
                    <div className="float-right">
                      <b></b>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      {groupSlotsByDate(docDetails.slots).map(slotGroup => (
                        <div className={slotGroup.date === selectedAppointmentDate ? "slot-option slot-selected" : "slot-option"} onClick={() => setSelectedAppointmentDate(slotGroup.date)} key={slotGroup.date}>
                          <Form.Check type="radio">
                            <Form.Check.Input
                              type="radio"
                              className="slot-option-radio"
                              name="slot-option"
                              checked={slotGroup.date === selectedAppointmentDate}
                              readonly
                            />
                            <Form.Check.Label className="slot-option-label">
                              <b>{getFormattedDate(slotGroup.date)}</b>
                              <div className="slot-number text-secondary">
                                ({slotGroup.slots.filter(slot => !slot.occupied).length} Slots)
                            </div>
                            </Form.Check.Label>
                          </Form.Check>
                        </div>
                      ))}
                    </Form>
                    <div className="time-slots-group">
                      {docDetails.slots.filter(slot => slot.startTime.split('T')[0] === selectedAppointmentDate).map(slot => (
                        <div
                          className={slot.id == selectedSlotId ? "time-slot-option slot-selected" : slot.occupied ? "time-slot-option slot-occupied" : "time-slot-option"}
                          key={slot.id}
                          onClick={() => {if (!slot.occupied) setSelectedSlotId(slot.id)}}>
                          {new Date(slot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Row>
            </Card>
            <Card
              style={{
                maxHeight: "320px",
                overflowY: "scroll",
                borderBottom: "none",
              }}
            >
              <div className="patient-stories p-3">
                Patient Stories
                <div className="patient-story mt-2">
                  <div
                    className="patient-name"
                    style={{ fontSize: "13.6px", fontWeight: "500" }}
                  >
                    Walter Roberson
                  </div>
                  <div
                    className="patient-story-desc"
                    style={{ fontSize: "small" }}
                  >
                    <ReadMoreReact
                      text={patientStory(docDetails.name)}
                      ideal={450}
                      max={9999}
                      readMoreText={
                        <b style={{ cursor: "pointer", color: "#24bdce" }}>
                          Read more
                        </b>
                      }
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div className="p-3">
                <div
                  className="survey-recommend p-2 px-3"
                  style={{ border: "2px dashed #ffff", background: "#faf1d2" }}
                >
                  <div
                    className="survey-rating d-inline-block pr-3"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#24bdce",
                      borderRight: "1px solid #fcdd6d",
                    }}
                  >
                    <i className="far fa-thumbs-up mr-1"></i>100%
                  </div>
                  <div
                    className="survey-text d-inline-block pl-3"
                    style={{ fontSize: "small", color: "#cca414" }}
                  >
                    Out of all the patients who were surveyed, 100% of them
                    recommended visiting this doctor
                  </div>
                </div>
              </div>
              <hr />
              <div className="patient-testimonials px-3 pb-3">
                Patient Testimonials
                <Carousel
                  className="mt-2"
                  controls={false}
                  pause="hover"
                  indicators={false}
                  wrap={true}
                  touch={true}
                >
                  <Carousel.Item
                    className="p-2"
                    style={{ border: "1px solid #c9c9c9", borderRadius: "4px" }}
                  >
                    <div className="patient-testimonial" interval={250}>
                      <div
                        className="patient-name"
                        style={{ fontSize: "13.6px", fontWeight: "500" }}
                      >
                        Reuben Oxly
                      </div>
                      <div
                        className="patient-testimonial-desc"
                        style={{ fontSize: "small", minHeight: "60px" }}
                      >
                        <ReadMoreReact
                          text={patientTestimonial}
                          ideal={250}
                          max={9999}
                          readMoreText={
                            <b style={{ cursor: "pointer", color: "#24bdce" }}>
                              Read more
                            </b>
                          }
                        />
                      </div>
                    </div>
                  </Carousel.Item>
                </Carousel>
              </div>
            </Card>
          </Card>
        </Col>
        {selectedSlotId != "0" ? (<Col style={{ maxWidth: "400px" }}>
          <Card className="doctor-card-right">
            <Row>
              <Col
                xs={3}
                md={3}
                lg={3}
                style={{ maxWidth: "80px" }}
                className="pr-0"
              >
                <img
                  className="doctor-profile-round"
                  src={constants.endpoint + '/images/' + docDetails.pictureUrl}
                  alt=""
                />
              </Col>
              <Col>
                <div className="doctor-card-right-name">Dr. {docDetails.name}</div>
                <div className="doctor-card-right-specialty text-secondary">
                  {docDetails.speciality}
                </div>
              </Col>
            </Row>
            <hr />
            <Row className="m-0">
              <div className="selected-slot-info text-secondary pr-2">
                <div className="info-title">
                  <i className="far fa-calendar-alt text-secondary mr-1"></i>
                  <b>Date and Time</b>
                </div>
                <div className="info">{new Date(docDetails.slots.find(slot => slot.id == selectedSlotId).startTime).toLocaleString('en-US')}</div>
              </div>
              <div className="consultation-mode-info text-secondary pl-2">
                <div className="info-title">
                  <i className="far fa-comments text-secondary mr-1"></i>
                  <b>Mode of Consultation</b>
                </div>
                <div className="info">Video Consultation</div>
              </div>
            </Row>
            <hr />
            <Row className="m-0">
              <div className="consultation-for">
                <i className="fas fa-video text-center mr-2"></i>
                <b>Video Consultation is for</b>
              </div>
            </Row>
            <Row className="m-0">
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  display: "block",
                }}
                className="mt-1"
              >
                <Form.Check type="radio" className="d-inline-block">
                  <Form.Check.Label>
                    <Form.Check.Input type="radio" name="patient-select" />
                    Me
                  </Form.Check.Label>
                </Form.Check>
                <Form.Check type="radio" className="d-inline-block ml-3">
                  <Form.Check.Label>
                    <Form.Check.Input type="radio" name="patient-select" />
                    Someone else
                  </Form.Check.Label>
                </Form.Check>
              </div>
            </Row>
            <hr />
            <Row className="m-0">
              <h6>Patient Details</h6>
              <Form style={{ width: "100%" }}>
                <Form.Control
                  type="text"
                  placeholder="Patient's Full Name"
                  className="patient-details-form-item"
                  onChange={(e) => { setPatientDetails({ ...patientDetails, patientName: e.target.value })}}
                />
                {/* <Form.Control
                  type="text"
                  placeholder="Mobile Number"
                  className="patient-details-form-item"
                /> */}
                <Form.Control
                  type="text"
                  placeholder="Patient's Mobile Number"
                  className="patient-details-form-item"
                  value={patientDetails.patientPhone}
                  onChange={(e) => { setPatientDetails({ ...patientDetails, patientPhone: e.target.value }) }}
                />
                <Form.Check type="checkbox">
                  <Form.Check.Label>
                    <Form.Check.Input type="checkbox" checked={patientDetails.smsAlert} onChange={(e) => { setPatientDetails({ ...patientDetails, smsAlert: e.target.value }) }} />
                    <div
                      className="text-secondary"
                      style={{ fontSize: "small" }}>
                      Get updates via SMS <b></b>
                    </div>
                  </Form.Check.Label>
                </Form.Check>
              </Form>
              <button className="confirm-btn" onClick={() => { /*history.push('/appointments')*/ initiateAppointmentBooking(); }}>Confirm Appointment</button>
            </Row>
          </Card>
        </Col>
        ) : ""}
      </Row>
      ) : ""}
    </>
  );
};

const groupSlotsByDate = (slots) => {
  // this gives an object with dates as keys
  const groupedSlots = slots.reduce((groups, slot) => {
    const date = slot.startTime.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {});

  // Edit: to add it in the array format instead
  const slotArrays = Object.keys(groupedSlots).map((date) => {
    return {
      date,
      slots: groupedSlots[date]
    };
  });
  return slotArrays;
}

// accepts yyyy-dd-mm
const getFormattedDate = (date) => {
  var day = date.split('-')[2]
  var month = date.split('-')[1]
  var year = date.split('-')[0]

  var dt = new Date(year, month, day)

  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return dt.toLocaleDateString("en-US", options)
}

const mapStateToProps = (globalState) => ({
  docDetails: globalState.appointments.docDetails,
  bookingSuccess: globalState.appointments.bookingSuccess
})

const mapDispatchToProps = {
  getDoctorById, bookAppointment
}

export default connect(mapStateToProps, mapDispatchToProps)(Booking);
