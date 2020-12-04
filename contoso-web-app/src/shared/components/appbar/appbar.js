import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import CSSModules from "react-css-modules";
import { connect } from "react-redux";

import styles from "./appbar.module.css";
import profilePicture from '../../../assets/images/user-profile.png'

function AppBar({requireBackground, title, authInfo}) {
  const history = useHistory();
  return (
    <div styleName="topbar">
      <div styleName="image">
        <div styleName="gradient">
          <div styleName="topbar-content">
            <div styleName="topbar-left" onClick={() => {history.goBack();}}>
              <img
                src={"https://res.cloudinary.com/dtldj8hpa/image/upload/v1598941580/projects/AcsTeleMed/left-arrow.svg"}
                alt="back button"
                styleName="icon"
              />
              <p className="h4">{title}</p>
            </div>

            <div styleName="topbar-right" className="mr-3">
              {/* <div
                styleName="notif-icon"
                style={{
                  marginLeft: "auto"
                }}
              >
                <img
                  alt="bell"
                  src="https://res.cloudinary.com/dtldj8hpa/image/upload/v1598872430/projects/AcsTeleMed/Notification.png"
                />
              </div> */}
              <div styleName="profile-space">
                <div className="text-white mx-3">
                  Logged in as <b>{authInfo?.displayName}</b>
                </div>
                <img
                  styleName="profile-avatar"
                  src={profilePicture}
                  alt="profile avatar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (globalState) => ({
  authInfo: globalState.auth
})

export default connect(mapStateToProps, null)(CSSModules(AppBar, styles, { allowMultiple: true }));