import React, { Component } from 'react';
import './CallSection.css';
import StreamMedia from './StreamMedia';
import { DefaultButton } from 'office-ui-fabric-react'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import LocalVideoPreviewCard from './LocalVideoPreviewCard';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { LocalVideoStream } from '@azure/communication-calling';
import profilePicture from '../../assets/images/user-profile.png';

class CallSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
            cameraDeviceOptions: []
        }
    }

    componentDidMount() {
        this.state.deviceManager.getCameraList().map(cameraDevice => { this.state.cameraDeviceOptions.push({ key: cameraDevice.id, text: cameraDevice.name }) });
    }

    async handleVideoOnOff() {
        try {
            if (this.state.videoOn) {
                if (this.state.call.localVideoStreams && this.state.call.localVideoStreams.length > 0) {
                    await this.state.call.stopVideo(this.state.call.localVideoStreams[0]);
                }
            } else {
                await this.state.call.startVideo();
            }
            this.setState({ videoOn: !this.state.videoOn });
        } catch (e) {
            console.error(e);
            alert("Camera in use by another process");
        }
    }

    handleCameraInUse = (status) => {
        if (status === "videoOff") {
            this.setState({ videoOn: false });
        } else {
            const cameraDevice = this.state.deviceManager.getCameraList()[1];
            this.setState({ selectedCameraDeviceId: cameraDevice.id });
        }
    }

    async handleMicOnOff() {
        try {
            if (this.state.micOn) {
                await this.state.call.mute();
            } else {
                await this.state.call.unmute();
            }
            this.setState({ micOn: !this.state.micOn });
        } catch (e) {
            console.error(e);
        }
    }

    async handleHoldUnhold() {
        try {
            if (this.state.onHold) {
                await this.state.call.unhold();
            } else {
                await this.state.call.hold();
            }
            this.setState({ onHold: !this.state.onHold });
        } catch (e) {
            console.error(e);
        }
    }

    async handleScreenSharingOnOff() {
        try {
            if (this.state.screenShareOn) {
                await this.state.call.stopScreenSharing()
            } else {
                await this.state.call.startScreenSharing();
            }
            this.setState({ screenShareOn: !this.state.screenShareOn });
        } catch (e) {
            console.error(e);
        }
    }

    async handleAcceptCall() {
        let cameraDevice;
        let speakerDevice;
        let microphoneDevice;
        let localVideoStream;

        if (this.state.selectedCameraDeviceId) {
            cameraDevice = this.state.callClient.deviceManager.getCameraList().find(cameraDevice => { return cameraDevice.id === this.state.selectedCameraDeviceId })
            localVideoStream = new LocalVideoStream(cameraDevice);
        } else {
            cameraDevice = this.state.callClient.deviceManager.getCameraList()[0];
            localVideoStream = new LocalVideoStream(cameraDevice);
            this.setState({ selectedCameraDeviceId: cameraDevice.id });
        }

        if (this.state.selectedSpeakerDeviceId) {
            speakerDevice = this.state.callClient.deviceManager.getSpeakerList().find(speakerDevice => { return speakerDevice.id === this.state.selectedSpeakerDeviceId })
        } else {
            speakerDevice = this.state.callClient.deviceManager.getSpeakerList()[0];
        }

        if (this.state.selectedMicrophoneDeviceId) {
            microphoneDevice = this.state.callClient.deviceManager.getMicrophoneList().find(microphoneDevice => { return microphoneDevice.id === this.state.selectedMicrophoneDeviceId })
        } else {
            microphoneDevice = this.state.callClient.deviceManager.getMicrophoneList()[0];
        }

        this.state.call.accept({
            videoOptions: this.state.videoOn && cameraDevice ? { camera: cameraDevice, localVideoStreams: [localVideoStream] } : undefined,
            audioOptions: {
                microphone: this.state.micOn && microphoneDevice ? microphoneDevice : undefined,
                speaker: speakerDevice ? speakerDevice : undefined
            }
        }).catch((e) => console.error(e));
    }

    cameraDeviceSelectionChanged = async (event, item) => {
        const cameraDeviceInfo = this.state.deviceManager.getCameraList().find(cameraDeviceInfo => {
            return cameraDeviceInfo.id === item.key
        });
        const localVideoStream = this.state.call.localVideoStreams[0];
        try {
            await localVideoStream.switchSource(cameraDeviceInfo);
            this.setState({ selectedCameraDeviceId: cameraDeviceInfo.id });
        } catch (err) {
            alert("Camera device already in use by another process");
        }
    };

    render() {
        console.log("Camera device list");
        console.log(this.state.cameraDeviceOptions);
        return (
            <div className="call-section">
                <div className="call-persona">
                    <img src={profilePicture} alt="" />
                    <div className="connection-state-info">{this.props.callState}</div>
                </div>
                {
                    this.state.videoOn && <LocalVideoPreviewCard callClient={this.state.callClient} deviceManager={this.state.deviceManager} handleCameraInUse={this.handleCameraInUse} />
                }
                <div className="call-section-video-stream">
                    {
                        this.props.streams.map((v, index) =>
                            <StreamMedia key={index} stream={v.stream} userId={v.userId} />
                        )
                    }

                    {
                        (this.props.streams.length === 0) ? <div></div> : ""
                    }
                    {(this.props.callState !== 'Incoming') ?
                        (<div className="call-section-btn-group">
                            <button className="call-section-btn" onClick={() => this.handleVideoOnOff()}>
                                <i className={(this.state.videoOn) ? "fas fa-video" : "fas fa-video-slash"}></i>
                            </button>
                            <button className="call-section-btn" onClick={() => this.handleMicOnOff()}>
                                <i className={(this.state.micOn) ? "fas fa-microphone" : "fas fa-microphone-slash"}></i>
                            </button>
                            <button className="call-section-btn" onClick={() => this.handleHoldUnhold()}>
                                <i className={(!this.state.onHold) ? "fas fa-pause" : "fas fa-play"}></i>
                            </button>
                            <button className="call-section-btn" onClick={() => this.handleScreenSharingOnOff()}>
                                <i className="fas fa-desktop"></i>
                            </button>
                            <button className="call-section-btn" onClick={() => this.setState({ showSettings: true })}>
                                <i className="fas fa-cog"></i>
                            </button>
                            <button className="call-section-btn call-end-btn" onClick={() => this.props.call.hangUp({ forEveryone: false }).catch((e) => console.error(e))}>
                                <i className="fas fa-phone-slash"></i>
                            </button>
                        </div>) :
                        (<div className="call-section-btn-group">
                            <button className="call-section-btn" onClick={() => this.handleVideoOnOff()}>
                                <i className={(this.state.videoOn) ? "fas fa-video" : "fas fa-video-slash"}></i>
                            </button>
                            <button className="call-section-btn" onClick={() => this.handleMicOnOff()}>
                                <i className={(this.state.micOn) ? "fas fa-microphone" : "fas fa-microphone-slash"}></i>
                            </button>
                            <button className="call-section-btn" onClick={() => this.setState({ showSettings: true })}>
                                <i className="fas fa-cog"></i>
                            </button>
                            <button className="call-section-btn call-accept-btn" onClick={() => this.handleAcceptCall()}>
                                <i className="fas fa-phone-alt"></i>
                            </button>
                        </div>)}
                </div>
                <Panel
                    id="settings-panel"
                    type={PanelType.medium}
                    isLightDismiss
                    isOpen={this.state.showSettings}
                    onDismiss={() => this.setState({ showSettings: false })}
                    closeButtonAriaLabel="Close"
                    headerText="Settings">
                    <Separator></Separator>
                    <div>
                        <h6>Video settings</h6>
                        <div className="d-flex flex-lg-row justify-content-between align-items-center ml-3 my-3">
                            <div>Camera</div>
                            {
                                this.state.cameraDeviceOptions.length > 0 &&
                                <Dropdown
                                    selectedKey={this.state.selectedCameraDeviceId}
                                    onChange={this.cameraDeviceSelectionChanged}
                                    options={this.state.cameraDeviceOptions}
                                    disabled={this.state.deviceManager.getCameraList().length === 0}
                                    placeHolder={this.state.deviceManager.getCameraList().length === 0 ? 'No camera devices found' :
                                        this.state.selectedCameraDeviceId ? '' : 'Select camera'}
                                    styles={{ dropdown: { width: 400 } }}
                                />
                            }
                        </div>
                    </div>
                    <Separator></Separator>
                </Panel>
            </div>
        );
    }
}

export default CallSection;