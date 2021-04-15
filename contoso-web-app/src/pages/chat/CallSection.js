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

class CallSection extends Component {
  constructor(props) {
    super(props);
    this.callFinishConnectingResolve = undefined;
    this.call = props.call;
    this.deviceManager = props.deviceManager;
    this.state = {
      callState: this.call.state,
      callId: this.call.id,
      remoteParticipants: this.call.remoteParticipants,
      allRemoteParticipantStreams: [],
      videoOn: true,
      micMuted: false,
      onHold:
        this.call.state === "LocalHold" || this.call.state === "RemoteHold",
      screenShareOn: this.call.isScreenShareOn,
      cameraDeviceOptions: props.cameraDeviceOptions
        ? props.cameraDeviceOptions
        : [],
      speakerDeviceOptions: props.speakerDeviceOptions
        ? props.speakerDeviceOptions
        : [],
      microphoneDeviceOptions: props.microphoneDeviceOptions
        ? props.microphoneDeviceOptions
        : [],
      selectedCameraDeviceId: this.call.localVideoStreams[0]?.source.id,
      selectedSpeakerDeviceId: this.deviceManager.selectedSpeaker?.id,
      selectedMicrophoneDeviceId: this.deviceManager.selectedMicrophone?.id,
      showSettings: false,
      showLocalVideo: false,
    };
  }

  async componentWillMount() {
    if (this.call) {
      this.deviceManager.on("videoDevicesUpdated", async (e) => {
        let newCameraDeviceToUse = undefined;
        e.added.forEach((addedCameraDevice) => {
          newCameraDeviceToUse = addedCameraDevice;
          const addedCameraDeviceOption = {
            key: addedCameraDevice.id,
            text: addedCameraDevice.name,
          };
          this.setState((prevState) => ({
            cameraDeviceOptions: [
              ...prevState.cameraDeviceOptions,
              addedCameraDeviceOption,
            ],
          }));
        });
        if (newCameraDeviceToUse) {
          try {
            await this.call.localVideoStreams[0]?.switchSource(
              newCameraDeviceToUse
            );
            this.setState({ selectedCameraDeviceId: newCameraDeviceToUse.id });
          } catch (error) {
            console.error(
              "Failed to switch to newly added video device",
              error
            );
          }
        }

        e.removed.forEach((removedCameraDevice) => {
          this.setState((prevState) => ({
            cameraDeviceOptions: prevState.cameraDeviceOptions.filter(
              (option) => {
                return option.key !== removedCameraDevice.id;
              }
            ),
          }));
        });

        // If the current camera being used is removed, pick a new random one
        if (
          !this.state.cameraDeviceOptions.find((option) => {
            return option.key === this.state.selectedCameraDeviceId;
          })
        ) {
          const newSelectedCameraId = this.state.cameraDeviceOptions[0]?.key;
          const cameras = await this.deviceManager.getCameras();
          const videoDeviceInfo = cameras.find((c) => {
            return c.id === newSelectedCameraId;
          });
          await this.call.localVideoStreams[0]?.switchSource(videoDeviceInfo);
          this.setState({ selectedCameraDeviceId: newSelectedCameraId });
        }
      });

      this.deviceManager.on("audioDevicesUpdated", (e) => {
        e.added.forEach((addedAudioDevice) => {
          const addedAudioDeviceOption = {
            key: addedAudioDevice.id,
            text: addedAudioDevice.name,
          };
          if (addedAudioDevice.deviceType === "Speaker") {
            this.setState((prevState) => ({
              speakerDeviceOptions: [
                ...prevState.speakerDeviceOptions,
                addedAudioDeviceOption,
              ],
            }));
          } else if (addedAudioDevice.deviceType === "Microphone") {
            this.setState((prevState) => ({
              microphoneDeviceOptions: [
                ...prevState.microphoneDeviceOptions,
                addedAudioDeviceOption,
              ],
            }));
          }
        });

        e.removed.forEach((removedAudioDevice) => {
          if (removedAudioDevice.deviceType === "Speaker") {
            this.setState((prevState) => ({
              speakerDeviceOptions: prevState.speakerDeviceOptions.filter(
                (option) => {
                  return option.key !== removedAudioDevice.id;
                }
              ),
            }));
          } else if (removedAudioDevice.deviceType === "Microphone") {
            this.setState((prevState) => ({
              microphoneDeviceOptions: prevState.microphoneDeviceOptions.filter(
                (option) => {
                  return option.key !== removedAudioDevice.id;
                }
              ),
            }));
          }
        });
      });

      this.deviceManager.on("selectedSpeakerChanged", () => {
        this.setState({
          selectedSpeakerDeviceId: this.deviceManager.selectedSpeaker?.id,
        });
      });

      this.deviceManager.on("selectedMicrophoneChanged", () => {
        this.setState({
          selectedMicrophoneDeviceId: this.deviceManager.selectedMicrophone?.id,
        });
      });

      const callStateChanged = () => {
        console.log("Call state changed ", this.state.callState);
        this.setState({ callState: this.call.state });

        if (
          this.state.callState !== "None" &&
          this.state.callState !== "Connecting" &&
          this.state.callState !== "Incoming"
        ) {
          if (this.callFinishConnectingResolve) {
            this.callFinishConnectingResolve();
          }
        }
        if (this.state.callState === "Incoming") {
          this.selectedCameraDeviceId = this.props.cameraDeviceOptions[0]?.id;
          this.selectedSpeakerDeviceId = this.props.speakerDeviceOptions[0]?.id;
          this.selectedMicrophoneDeviceId = this.props.microphoneDeviceOptions[0]?.id;
        }
      };
      callStateChanged();
      this.call.on("stateChanged", callStateChanged);

      this.call.on("idChanged", () => {
        console.log("Call id Changed ", this.call.id);
        this.setState({ callId: this.call.id });
      });

      // this.call.on("isRecordingActiveChanged", () => {
      //   console.log("isRecordingActiveChanged ", this.call.isRecordingActive);
      // });

      this.call.on("isMutedChanged", () => {
        this.setState({ micMuted: this.call.isMicrophoneMuted });
      });

      this.call.on("isScreenSharingOnChanged", () => {
        this.setState({ screenShareOn: this.call.isScreenShareOn });
      });

      this.call.remoteParticipants.forEach((rp) =>
        this.subscribeToRemoteParticipant(rp)
      );
      this.call.on("remoteParticipantsUpdated", (e) => {
        console.log(
          `Call=${this.call.callId}, remoteParticipantsUpdated, added=${e.added}, removed=${e.removed}`
        );
        e.added.forEach((p) => {
          console.log("participantAdded", p);
          this.subscribeToRemoteParticipant(p);
          this.setState((prevState) => ({
            remoteParticipants: [...prevState.remoteParticipants, p],
          }));
        });
        e.removed.forEach((p) => {
          console.log("participantRemoved", p);
          this.setState({
            remoteParticipants: this.state.remoteParticipants.filter(
              (remoteParticipant) => {
                return remoteParticipant !== p;
              }
            ),
          });
          this.setState({
            streams: this.state.allRemoteParticipantStreams.filter((s) => {
              return s.participant !== p;
            }),
          });
        });
      });
    }
  }

  subscribeToRemoteParticipant(participant) {
    participant.on("displayNameChanged", () => {
      console.log("displayNameChanged ", participant.displayName);
    });

    participant.on("stateChanged", () => {
      console.log(
        "Participant state changed",
        participant.identifier.communicationUserId,
        participant.state
      );
      this.setState({ remoteParticipants: this.call.remoteParticipants });
    });

    const addToListOfAllRemoteParticipantStreams = (participantStreams) => {
      if (participantStreams) {
        let participantStreamTuples = participantStreams.map((stream) => {
          return { stream, participant };
        });
        participantStreamTuples.forEach((participantStreamTuple) => {
          if (
            !this.state.allRemoteParticipantStreams.find((v) => {
              return v === participantStreamTuple;
            })
          ) {
            this.setState((prevState) => ({
              allRemoteParticipantStreams: [
                ...prevState.allRemoteParticipantStreams,
                participantStreamTuple,
              ],
            }));
          }
        });
      }
    };

    const removeFromListOfAllRemoteParticipantStreams = (
      participantStreams
    ) => {
      participantStreams.forEach((streamToRemove) => {
        const tupleToRemove = this.state.allRemoteParticipantStreams.find(
          (v) => {
            return v.stream === streamToRemove;
          }
        );
        if (tupleToRemove) {
          this.setState({
            allRemoteParticipantStreams: this.state.allRemoteParticipantStreams.filter(
              (streamTuple) => {
                return streamTuple !== tupleToRemove;
              }
            ),
          });
        }
      });
    };

    const handleVideoStreamsUpdated = (e) => {
      addToListOfAllRemoteParticipantStreams(e.added);
      removeFromListOfAllRemoteParticipantStreams(e.removed);
    };

    addToListOfAllRemoteParticipantStreams(participant.videoStreams);
    participant.on("videoStreamsUpdated", handleVideoStreamsUpdated);
  }

  async handleVideoOnOff() {
    try {
      const cameras = await this.deviceManager.getCameras();
      const cameraDeviceInfo = cameras.find((cameraDeviceInfo) => {
        return cameraDeviceInfo.id === this.state.selectedCameraDeviceId;
      });
      const localVideoStream = new LocalVideoStream(cameraDeviceInfo);

      if (
        this.call.state === "None" ||
        this.call.state === "Connecting" ||
        this.call.state === "Incoming"
      ) {
        if (this.state.videoOn) {
          this.setState({ videoOn: false });
        } else {
          this.setState({ videoOn: true });
        }
        await this.watchForCallFinishConnecting();
        if (this.state.videoOn) {
          this.call.startVideo(localVideoStream).catch((error) => {});
        } else {
          this.call
            .stopVideo(this.call.localVideoStreams[0])
            .catch((error) => {});
        }
      } else {
        if (this.call.localVideoStreams[0]) {
          await this.call.stopVideo(this.call.localVideoStreams[0]);
        } else {
          await this.call.startVideo(localVideoStream);
        }
      }

      this.setState({ videoOn: this.call.localVideoStreams[0] ? true : false });
    } catch (e) {
      console.error(e);
    }
  }

  async watchForCallFinishConnecting() {
    return new Promise((resolve) => {
      if (
        this.state.callState !== "None" &&
        this.state.callState !== "Connecting" &&
        this.state.callState !== "Incoming"
      ) {
        resolve();
      } else {
        this.callFinishConnectingResolve = resolve;
      }
    }).then(() => {
      this.callFinishConnectingResolve = undefined;
    });
  }

  async handleMicOnOff() {
    try {
      if (!this.call.isMicrophoneMuted) {
        await this.call.mute();
      } else {
        await this.call.unmute();
      }
      this.setState({ micMuted: this.call.isMicrophoneMuted });
    } catch (e) {
      console.error(e);
    }
  }

  async handleHoldUnhold() {
    try {
      if (this.call.state === "LocalHold" || this.call.state === "RemoteHold") {
        this.call.resume();
      } else {
        this.call.hold();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async handleScreenSharingOnOff() {
    try {
      if (this.call.isScreenSharingOn) {
        await this.call.stopScreenSharing();
      } else {
        await this.call.startScreenSharing();
      }
      this.setState({ screenShareOn: this.call.isScreenSharingOn });
    } catch (e) {
      console.error(e);
    }
  }

  cameraDeviceSelectionChanged = async (event, item) => {
    const cameras = await this.deviceManager.getCameras();
    const cameraDeviceInfo = cameras.find((cameraDeviceInfo) => {
      return cameraDeviceInfo.id === item.key;
    });
    const localVideoStream = this.call.localVideoStreams[0];
    localVideoStream.switchSource(cameraDeviceInfo);
    this.setState({ selectedCameraDeviceId: cameraDeviceInfo.id });
  };

  speakerDeviceSelectionChanged = async (event, item) => {
    const speakers = await this.deviceManager.getSpeakers();
    const speakerDeviceInfo = speakers.find((speakerDeviceInfo) => {
      return speakerDeviceInfo.id === item.key;
    });
    this.deviceManager.selectSpeaker(speakerDeviceInfo);
    this.setState({ selectedSpeakerDeviceId: speakerDeviceInfo.id });
  };

  microphoneDeviceSelectionChanged = async (event, item) => {
    const microphones = await this.deviceManager.getMicrophones();
    const microphoneDeviceInfo = microphones.find((microphoneDeviceInfo) => {
      return microphoneDeviceInfo.id === item.key;
    });
    this.deviceManager.selectMicrophone(microphoneDeviceInfo);
    this.setState({ selectedMicrophoneDeviceId: microphoneDeviceInfo.id });
  };

  render() {
    return (
      <div className="call-section">
        <div className="call-persona">
          <img src={profilePicture} alt="" />
          <div className="connection-state-info">
            {this.state.callState !== "Connected"
              ? `${this.state.callState}`
              : `Connected`}
          </div>
        </div>
        {this.state.videoOn && (
          <LocalVideoPreviewCard
            selectedCameraDeviceId={this.state.selectedCameraDeviceId}
            deviceManager={this.deviceManager}
          />
        )}
        <div className="call-section-video-stream">
          {this.state.allRemoteParticipantStreams.map((v) => (
            <StreamMedia
              key={`${v.participant.identifier.communicationUserId}-${v.stream.mediaStreamType}-${v.stream.id}`}
              stream={v.stream}
              remoteParticipant={v.participant}
            />
          ))}
          (
          <div className="call-section-btn-group">
            <button
              className="call-section-btn"
              onClick={() => this.handleVideoOnOff()}
            >
              <i
                className={
                  this.state.videoOn ? "fas fa-video" : "fas fa-video-slash"
                }
              ></i>
            </button>
            <button
              className="call-section-btn"
              onClick={() => this.handleMicOnOff()}
            >
              <i
                className={
                  !this.state.micMuted
                    ? "fas fa-microphone"
                    : "fas fa-microphone-slash"
                }
              ></i>
            </button>
            <button
              className="call-section-btn"
              onClick={() => this.handleHoldUnhold()}
            >
              <i
                className={!this.state.onHold ? "fas fa-pause" : "fas fa-play"}
              ></i>
            </button>
            <button
              className="call-section-btn"
              onClick={() => this.handleScreenSharingOnOff()}
            >
              <i className="fas fa-desktop"></i>
            </button>
            <button
              className="call-section-btn"
              onClick={() => this.setState({ showSettings: true })}
            >
              <i className="fas fa-cog"></i>
            </button>
            <button
              className="call-section-btn call-end-btn"
              onClick={() => {
                this.call
                  .hangUp({ forEveryone: true })
                  .catch((e) => console.error(e));
              }}
            >
              <i className="fas fa-phone-slash"></i>
            </button>
          </div>
          )
        </div>
        <Panel
          type={PanelType.medium}
          isLightDismiss
          isOpen={this.state.showSettings}
          onDismiss={() => this.setState({ showSettings: false })}
          closeButtonAriaLabel="Close"
          headerText="Settings"
        >
          <div className="pl-2 mt-3">
            <h3>Video settings</h3>
            <div className="pl-2">
              <span>
                <h4>Camera preview</h4>
              </span>
              <DefaultButton
                onClick={() =>
                  this.setState({ showLocalVideo: !this.state.showLocalVideo })
                }
              >
                Show/Hide
              </DefaultButton>
              {this.state.cameraDeviceOptions.length > 0 &&
                this.state.callState === "Connected" && (
                  <Dropdown
                    selectedKey={this.state.selectedCameraDeviceId}
                    onChange={this.cameraDeviceSelectionChanged}
                    label={"Camera"}
                    options={this.state.cameraDeviceOptions}
                    disabled={this.deviceManager.getCameras().length === 0}
                    placeHolder={
                      this.deviceManager.getCameras().length === 0
                        ? "No camera devices found"
                        : this.state.selectedCameraDeviceId
                        ? ""
                        : "Select camera"
                    }
                    styles={{ dropdown: { width: 400 } }}
                  />
                )}
            </div>
          </div>
          <div className="pl-2 mt-4">
            <h3>Sound Settings</h3>
            <div className="pl-2">
              {this.state.speakerDeviceOptions.length > 0 &&
                this.state.callState === "Connected" && (
                  <Dropdown
                    selectedKey={this.state.selectedSpeakerDeviceId}
                    onChange={this.speakerDeviceSelectionChanged}
                    options={this.state.speakerDeviceOptions}
                    label={"Speaker"}
                    disabled={this.deviceManager.getSpeakers().length === 0}
                    placeHolder={
                      this.deviceManager.getSpeakers().length === 0
                        ? "No speaker devices found"
                        : this.state.selectedSpeakerDeviceId
                        ? ""
                        : "Select speaker"
                    }
                    styles={{ dropdown: { width: 400 } }}
                  />
                )}
              {this.state.microphoneDeviceOptions.length > 0 &&
                this.state.callState === "Connected" && (
                  <Dropdown
                    selectedKey={this.state.selectedMicrophoneDeviceId}
                    onChange={this.microphoneDeviceSelectionChanged}
                    options={this.state.microphoneDeviceOptions}
                    label={"Microphone"}
                    disabled={this.deviceManager.getMicrophones().length === 0}
                    placeHolder={
                      this.deviceManager.getMicrophones().length === 0
                        ? "No microphone devices found"
                        : this.state.selectedMicrophoneDeviceId
                        ? ""
                        : "Select microphone"
                    }
                    styles={{ dropdown: { width: 400 } }}
                  />
                )}
            </div>
          </div>
        </Panel>
      </div>
    );
  }
}

export default CallSection;
