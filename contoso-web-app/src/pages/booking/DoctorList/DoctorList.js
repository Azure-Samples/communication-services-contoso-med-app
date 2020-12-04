import React, { Component, useEffect } from "react";
import { useLocation } from 'react-router-dom'

import { connect } from "react-redux";
import { getDoctorsByCategory } from "../../../data/actions/appointment.actions";

import queryString from 'query-string';

import {
  Container,
  InputGroup,
  Form,
  Navbar,
  FormControl,
} from "react-bootstrap";

import AppBar from "../../../shared/components/appbar/appbar";
import Doctor from "./Doctor";

const DoctorList = ({docList, getDoctorsByCategory}) => {
  const location = useLocation();
  var category = queryString.parse(location.search).category;

  useEffect(() => {
    getDoctorsByCategory(category)
  }, [category])

  return (
    <>
      <AppBar title="Appointments" />
      <Container style={{ marginTop: "4rem" }}>
        {docList != undefined ? docList.map((doctor) => (
          <Doctor key={doctor.id} {...doctor} />
        )) : <div className='error error-box'>No doctors found</div>}
      </Container>
    </>
  );
};

const mapStateToProps = (globalState) => ({
  docList: globalState.appointments.docList
})

const mapDispatchToProps = {
  getDoctorsByCategory: getDoctorsByCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorList);
