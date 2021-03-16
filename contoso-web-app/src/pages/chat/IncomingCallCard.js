import React, { Component } from "react";
import CallSection from "./CallSection";
import ChatArea from "./ChatArea";
import "./CallCard.css";
import IncomingCallSection from "./IncomingCallSection";

class IncomingCallCard extends Component {
  constructor(props) {
    super(props);
    this.incomingCall = props.incomingCall;
    this.acceptCallOptions = props.acceptCallOptions;
  }

  render() {
    return (
      <>
        <div className="call-screen">
          <IncomingCallSection
            incomingCall={this.incomingCall}
            acceptCallOptions={this.acceptCallOptions}
          />
          <div className="chat-section">
            <ChatArea
              selectedDoctor={this.props.selectedDoctor}
              selectedPatient={this.props.selectedPatient}
            />
          </div>
        </div>
      </>
    );
  }
}

export default IncomingCallCard;
