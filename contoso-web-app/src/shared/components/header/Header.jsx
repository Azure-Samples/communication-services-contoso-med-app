import React from "react";

import { connect } from "react-redux";

import "./Header.scss";

const Header = ({requireBackground, title, authInfo}) => {
  return (
    <div className={(requireBackground !== undefined && requireBackground) ? 'topbar with-background' : 'topbar'}>
      <div className="searhbox">
        {(title === undefined ? (<input
          type="text"
          placeholder="Search"
          style={{
            width: "20em",
            height: "2em",
            fontSize: "18px",
            border: "0px",
            padding: "16px",
          }}
        />) : <h3 className="page-title">{title}</h3> )}
      </div>
      <div
        className="notif-icon"
        style={{
          marginLeft: "auto",
        }}
      >
      </div>

      <div className="profile-space">
        <div className="text-white mx-3">
          Logged in as <b>{authInfo?.displayName}</b>
        </div>
        {/* <img
          className="profile-avatar"
          src="https://picsum.photos/200"
          alt="profile avatar"
        /> */}
      </div>
    </div>
  );
};

const mapStateToProps = (globalState) => ({
  authInfo: globalState.auth
})

export default connect(mapStateToProps, null)(Header);
