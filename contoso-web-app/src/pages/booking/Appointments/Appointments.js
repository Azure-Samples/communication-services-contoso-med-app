import React, { Component } from "react";
import { Container } from "react-bootstrap";
import BookedAppointment from "./BookedAppointment";
import PastAppointment from "./PastAppointment";

import AppBar from "../../../shared/components/appbar/appbar";

class Appointments extends Component {
  render() {
    return (
      <>
        <AppBar title="My Bookings"/>
        <Container style={{ marginTop: "4rem" }}>
          <BookedAppointment />
          {/* <h6>Past Appointments</h6>
          <PastAppointment /> */}
        </Container>
      </>
    );
  }
}

export default Appointments;
