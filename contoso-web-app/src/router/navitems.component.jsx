import React from 'react'
import { useHistory } from 'react-router-dom'

import { connect } from "react-redux";
import { logoutUser } from "../data/actions/auth.actions";


function NavItemsComponent(props) {
    const history = useHistory();
    return (
      <div
        className="nav-items"
        onClick={
          () => {
            if (props.title !== "Log Out")
              history.push(props.link);
            else
              props.logoutUser();
          }
        }
      >
        <img src={props.itemLogo} alt="nav-icon" className="nav-icon" />
  
        <p className="nav-items-title">{props.title}</p>
      </div>
    );
  }
  
  const mapDispatchToProps = {
    logoutUser
  }
  
  export default connect(null, mapDispatchToProps)(NavItemsComponent);