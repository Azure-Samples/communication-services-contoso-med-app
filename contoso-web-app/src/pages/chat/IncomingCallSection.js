import React, { Component } from "react";
import "./CallSection.css";
import StreamMedia from "./StreamMedia";
import { DefaultButton } from "office-ui-fabric-react";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { Separator } from "office-ui-fabric-react/lib/Separator";
import LocalVideoPreviewCard from "./LocalVideoPreviewCard";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { LocalVideoStream } from "@azure/communication-calling";
import profilePicture from "../../assets/images/user-profile.png";

class IncomingCallSection extends Component {
  constructor(props) {
    super(props);
    this.incomingCall = props.incomingCall;
    this.acceptCallOptions = props.acceptCallOptions;
  }

  async componentWillMount() {
    this.acceptCallOptions = {
      videoOptions: (await this.acceptCallOptions()).videoOptions,
    };
  }

  render() {
    return (
      <div className="call-section">
        <div className="call-persona">
          <img src={profilePicture} alt="" />
          <div className="connection-state-info">
            Incoming
          </div>
        </div>
        <div className="call-section-video-stream">
          <div className="call-section-btn-group">
            <button
              className="call-section-btn call-end-btn"
              onClick={() => { this.incomingCall.reject(); }}
            >
              <i className="fas fa-phone-slash"></i>
            </button>
            <button
              className="call-section-btn call-accept-btn"
              onClick={() => this.incomingCall.accept(this.acceptCallOptions)}
            >
              <i className="fas fa-phone-alt"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default IncomingCallSection;
