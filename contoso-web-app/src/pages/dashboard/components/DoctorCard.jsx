import React from "react";
import { useHistory } from 'react-router';

const imageURL =
  "https://res.cloudinary.com/dtldj8hpa/image/upload/v1599574807/projects/AcsTeleMed/cardiologist.png";
const name = "Doctor Sparklez";
const type = "Dentist";

export default function DoctorCard(props) {
  const history = useHistory();
  return (
    <div className="Container">
      <img
        className="left-image"
        src={props.imageURL === undefined ? imageURL : props.imageURL}
        alt="DoctorsImage"
      />

      <div className="right">
        <h5 className="mt-4 mx-2">
          {props.name === undefined ? name : props.name}
        </h5>
        <p className="mt-2 mx-2">
          {props.type === undefined ? type : props.type}
        </p>
        <p
          className="ml-2 mt-4 link"
          style={{
            cursor: "pointer"
          }}
          onClick={
            () => {history.push('/booking?doctorId=' + props.id)}
          }
        >
          Book Appointment
        </p>
      </div>
    </div>
  );
}
