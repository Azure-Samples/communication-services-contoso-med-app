// © Microsoft Corporation. All rights reserved.
import React from "react";
import "./CallSection.css";
import { VideoStreamRenderer } from "@azure/communication-calling";
import profilePicture from "../../assets/images/user-profile.png";

export default class StreamMedia extends React.Component {
  constructor(props) {
    super(props);
    this.stream = props.stream;
    this.remoteParticipant = props.remoteParticipant;
    this.videoContainerId = `${this.remoteParticipant.identifier.communicationUserId}-${this.stream.mediaStreamType}-${this.stream.id}`;
    this.state = {
      isSpeaking: false,
      isAvailable: false,
    };
  }

  async componentDidMount() {
    this.remoteParticipant.on("isSpeakingChanged", () => {
      this.setState({ isSpeaking: this.remoteParticipant.isSpeaking });
    });

    console.log("StreamMedia", this.stream, this.id);
    let renderer = new VideoStreamRenderer(this.stream);
    let view;
    let videoContainer;

    const renderStream = async () => {
      if (!view) {
        view = await renderer.createView();
      }
      videoContainer = document.getElementById(this.videoContainerId);
      if (!videoContainer?.hasChildNodes()) {
        videoContainer.appendChild(view.target);
      }
    };

    this.stream.on("isAvailableChanged", async () => {
      console.log(
        `stream=${this.stream.type}, isAvailableChanged=${this.stream.isAvailable}`
      );
      if (this.stream.isAvailable) {
        renderer = !renderer ? new VideoStreamRenderer(this.stream) : renderer;
        this.setState({ isAvailable: true });
        await renderStream();
      } else {
        this.setState({ isAvailable: false });
        // renderer.dispose();
      }
    });

    if (this.stream.isAvailable) {
      this.setState({ isAvailable: true });
      //   await renderStream();
    }
  }

  render() {
    return this.state.isAvailable ? (
      <div className="video-stream" id={this.videoContainerId}></div>
    ) : null;
  }
}
