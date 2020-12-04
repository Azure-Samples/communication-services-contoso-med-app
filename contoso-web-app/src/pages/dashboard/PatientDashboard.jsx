import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import { getDoctorsStatsByCategory } from "../../data/actions/appointment.actions";

import DoctorCard from "./components/DoctorCard";
import ProfessionCard from "./components/ProfessionCard";
import ChatBubble from "./components/ChatBubble";
import Header from "../../shared/components/header/Header";
import { constants } from "../../config";
import "./PatientDashboard.scss";

const PatientDashboard = ({ authInfo, getDoctorsStatsByCategory, docStats, lastVisitedDoctors }) => {

  useEffect(() => {
    if (docStats == undefined) getDoctorsStatsByCategory();
  })
  let [visible, setVisible] = useState(false);
  return (
    <>
      <div className="background">
        <div className="topBackground">
          <div className="image">
            <div className="gradient">

            </div>
          </div>
        </div>

        <div className="foreground" style={{ paddingLeft: '2rem' }}>
          <Header requireBackground={false} />
          <div className="welcome-text ml-3">
            <div className="text-white h2">
              {/* Welcome {profileData.prefix} {profileData.lname} */}
            Welcome {authInfo.username}
            </div>

            <div className="text-white">
              
          </div>
          </div>
          <div style={{ width: "80%" }}>
            <p className="ml-3 mt-5 h5 text-white">
              Find doctors in specialities
          </p>
          </div>

          <div className="profession-cards-div">
            {docStats != undefined ? docStats.map((item, index) => {
              return (
                <ProfessionCard
                  name={item.name}
                  count={item.count}
                  //onClick={item.onClick}
                  imageUrl={item.imageUrl}
                  key={index}
                />
              );
            }) : (<div>No doctors found</div>)}
          </div>
          <div className="doctor-cards-div">
            <h6 className="ml-3 mt-5 mb-3">Doctors you have already visited</h6>
            <div style={{ display: "inline-flex" }}>
              {lastVisitedDoctors.map((item, index) => {
                return (
                  <DoctorCard
                    id={item.id}
                    name={item.name}
                    type={item.speciality}
                    imageURL={constants.endpoint + '/images/' + item.pictureUrl}
                    key={index}
                  />
                );
              })}
            </div>
          </div>
          <ChatBubble />
        </div>
      </div>

    </>
  );
};

const mapStateToProps = (globalState) => ({
  authInfo: globalState.auth,
  docStats: globalState.appointments.docStats,
  lastVisitedDoctors: globalState.appointments.lastVisitedDoctors
})

const mapDispatchToProps = {
  getDoctorsStatsByCategory: getDoctorsStatsByCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientDashboard);