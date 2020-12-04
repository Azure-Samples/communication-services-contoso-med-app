import React from "react";
import { Card } from "react-bootstrap";
import { useHistory } from 'react-router';

const imageUrl =
  "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598544758/projects/AcsTeleMed/dentist-icon.png";

export default function ProfessionCard(props) {
  const history = useHistory();
  return (
    <div
      style={{
        width: "18rem",
        height: "16rem"
      }}>
      <Card
        className="parent mx-3"
        style={{
          height: "100%",
          backgroundColor: "white",
          opacity: 1
        }}>
        <img
          src={props.imageUrl === undefined ? imageUrl : props.imageUrl}
          alt="logo"
        />
        <div className="m-2">
          {" "}
          <h5>{props.name}</h5>{" "}
        </div>
        <div className="subheading">{props.count} Doctors</div>
        <div>
          <input
            type="button"
            className="show-list"
            value="Show List"
            onClick={
              () => {
                console.log('pushing to history');
                  history.push('/doctors?category=' + props.name);
                }
            }
          />
        </div>
      </Card>
    </div>
  );
}