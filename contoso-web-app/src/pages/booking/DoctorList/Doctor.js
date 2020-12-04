import React, { Component } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { constants } from "../../../config";
import "./Doctor.css";

const Doctor = (props) => {
  const history = useHistory();
  return (
    <>
      <Card className="doctor-card">
        <Row>
          <Col
            className="doctor-profile-column"
            xs={2}
            md={2}
            lg={2}
            style={{ maxWidth: "108px" }}
          >
            <img
              className="doctor-profile"
              src={constants.endpoint + '/images/' + props.pictureUrl}
              alt=""
            />
          </Col>
          <Col xs={4} md={4} lg={3}>
            <Card.Title>Dr. {props.name}</Card.Title>
            <Card.Subtitle className="text-secondary">
              {props.speciality}
            </Card.Subtitle>
            <div className="btn-group">
              {(props.availableMediums.includes("videoCall") ? (
                <button className="video-call-btn btn-group-item">
                  <i className="fas fa-video"></i>
                </button>
              ) : "")}
              {(props.availableMediums.includes("chat") ? (
              <button className="chat-btn btn-group-item">
                <i className="fas fa-comment-alt"></i>
              </button>
              ) : "")}
              {(props.availableMediums.includes("voice") ? (
                <button className="profile-btn btn-group-item">
                  <i className="fas fa-user"></i>
                </button>
              ) : "")}
            </div>
          </Col>
          <Col className="doctor-info-column" xs={6} md={6} lg={5}>
            <Row className="doctor-info-row">
              <i className="far fa-check-circle doctor-info-icons text-secondary"></i>
              <div className="text-secondary doctor-info-text">
                <b>Experience: </b>
                {props.experience} years
              </div>
            </Row>
            <Row className="doctor-info-row">
              <i className="far fa-star doctor-info-icons text-secondary"></i>
              <div className="text-secondary doctor-info-text">
                {props.reviews.length} patient reviews
              </div>
              <i
                className="far fa-thumbs-up doctor-info-icons text-secondary"
                style={{ marginLeft: "36px" }}
              ></i>
              {/* <div className="text-secondary doctor-info-text">
                {props.positive}%
              </div> */}
            </Row>
            <Row className="doctor-info-row">
              <i className="far fa-calendar-alt doctor-info-icons text-secondary"></i>
              <div className="text-secondary doctor-info-text">
                <b>Next available slot: </b>
                <div className="slot-time-text">
                  <b>{props.slots != undefined && props.slots.length > 0 ? new Date(props.slots[0].startTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A"}</b>
                </div>
              </div>
            </Row>
          </Col>
          <Col className="book-consultation-column">
            <div
              style={{ position: "absolute", right: "36px", bottom: "10px" }}
            >
              <Row className="book-consultation-row">
                <button
                  className="book-consultation-btn"
                  onClick={() => {
                    history.push("/booking?doctorId=" + props.id);
                  }}
                >
                  Book Consultation
                </button>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Doctor;
