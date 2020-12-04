import React, { Component } from "react";
import CallSection from './CallSection';
import ChatArea from './ChatArea';
import './CallCard.css';

class CallCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            call: props.call,
            callClient: props.callClient,
            callState: props.call.state,
            remoteParticipants: props.call.remoteParticipants,
            streams: [],
            videoOn: true,
            micOn: true,
            onHold: false,
            screenShareOn: false,
            cameraDeviceOptions: [],
            speakerDeviceOptions: [],
            microphoneDeviceOptions: [],
            selectedCameraDeviceId: props.selectedCameraDeviceId,
            selectedSpeakerDeviceId: props.selectedSpeakerDeviceId,
            selectedMicrophoneDeviceId: props.selectedMicrophoneDeviceId,
            showSettings: false,
            showLocalVideo: false,
            deviceManager: props.deviceManager
        };
    }

    componentWillMount() {
        if (this.state.call) {
            const cameraDevices = this.state.callClient.deviceManager.getCameraList();
            const speakerDevices = this.state.callClient.deviceManager.getSpeakerList();
            const microphoneDevices = this.state.callClient.deviceManager.getMicrophoneList();

            cameraDevices.map(cameraDevice => { this.state.cameraDeviceOptions.push({ key: cameraDevice.id, text: cameraDevice.name }) });
            speakerDevices.map(speakerDevice => { this.state.speakerDeviceOptions.push({ key: speakerDevice.id, text: speakerDevice.name }) });
            microphoneDevices.map(microphoneDevice => { this.state.microphoneDeviceOptions.push({ key: microphoneDevice.id, text: microphoneDevice.name }) });

            this.state.callClient.deviceManager.on('videoDevicesUpdated', e => {
                e.added.forEach(cameraDevice => { this.state.cameraDeviceOptions.push({ key: cameraDevice.id, text: cameraDevice.name }); });

                e.removed.forEach(removedCameraDevice => {
                    this.state.cameraDeviceOptions.forEach((value, index) => {
                        if (value.key === removedCameraDevice.id) {
                            this.state.cameraDeviceOptions.splice(index, 1);
                            if (removedCameraDevice.id === this.state.selectedCameraDeviceId) {
                                const cameraDevice = this.state.callClient.deviceManager.getCameraList()[0];
                                this.state.callClient.deviceManager.setCamera(cameraDevice);
                                this.setState({ selectedCameraDeviceId: cameraDevice.id });
                            }
                        }
                    });
                });
            });

            this.state.callClient.deviceManager.on('audioDevicesUpdated', e => {
                e.added.forEach(audioDevice => {
                    if (audioDevice.deviceType === 'Speaker') {
                        this.state.speakerDeviceOptions.push({ key: audioDevice.id, text: audioDevice.name });

                    } else if (audioDevice.deviceType === 'Microphone') {
                        this.state.microphoneDeviceOptions.push({ key: audioDevice.id, text: audioDevice.name });
                    }
                });

                e.removed.forEach(removedAudioDevice => {
                    if (removedAudioDevice.deviceType === 'Speaker') {
                        this.state.speakerDeviceOptions.forEach((value, index) => {
                            if (value.key === removedAudioDevice.id) {
                                this.state.speakerDeviceOptions.splice(index, 1);
                                if (removedAudioDevice.id === this.state.selectedSpeakerDeviceId) {
                                    const speakerDevice = this.state.callClient.deviceManager.getSpeakerList()[0];
                                    this.state.callClient.deviceManager.setSpeakers(speakerDevice);
                                    this.setState({ selectedSpeakerDeviceId: speakerDevice.id });
                                }
                            }
                        });
                    } else if (removedAudioDevice.deviceType === 'Microphone') {
                        this.state.microphoneDeviceOptions.forEach((value, index) => {
                            if (value.key === removedAudioDevice.id) {
                                this.state.microphoneDeviceOptions.splice(index, 1);
                                if (removedAudioDevice.id === this.state.selectedMicrophoneDeviceId) {
                                    const microphoneDevice = this.state.callClient.deviceManager.getMicrophoneList()[0];
                                    this.state.callClient.deviceManager.setMicrophone(microphoneDevice);
                                    this.setState({ selectedMicrophoneDeviceId: microphoneDevice.id });
                                }
                            }
                        });
                    }
                });
            });

            const onCallStateChanged = () => {
                console.log('callStateChanged', this.state.call.state);
                this.setState({ callState: this.state.call.state });

                if (this.state.call.state === 'Incoming') {
                    this.selectedCameraDeviceId = cameraDevices[0]?.id;
                    this.selectedSpeakerDeviceId = speakerDevices[0]?.id;
                    this.selectedMicrophoneDeviceId = microphoneDevices[0]?.id;
                }
            }
            onCallStateChanged();
            this.state.call.on('callStateChanged', onCallStateChanged);
            this.state.call.on('callIdChanged', () => { this.setState({ callId: this.state.call.callId }); });
            this.state.call.remoteParticipants.forEach(rp => this.subscribeToRemoteParticipant(rp));
            this.state.call.on('remoteParticipantsUpdated', e => {
                console.log(`EVENT, call=${this.state.call.callId}, remoteParticipantsUpdated, added=${e.added}, removed=${e.removed}`);
                e.added.forEach(p => {
                    console.log('participantAdded', p);
                    this.subscribeToRemoteParticipant(p);
                    this.setState({ remoteParticipants: [...this.state.call.remoteParticipants.values()] });
                });
                e.removed.forEach(p => {
                    console.log('participantRemoved');
                    this.setState({ remoteParticipants: [...this.state.call.remoteParticipants.values()] });
                });
            });
        }
    }

    subscribeToRemoteParticipant(participant) {
        let userId = participant.identifier.communicationUserId;
        participant.on('participantStateChanged', () => {
            console.log('EVENT participantStateChanged', participant.identifier.communicationUserId, participant.state);
            this.setState({ remoteParticipants: [...this.state.call.remoteParticipants.values()] });
        });

        const handleParticipantStream = (e) => {
            e.added.forEach(stream => {
                console.log('video stream added', userId, stream, stream.type);
                this.setState({ streams: this.state.streams.concat({ stream: stream, userId: userId }) });
            });
            e.removed.forEach(stream => {
                console.log('video stream removed', userId, stream, stream.type)
            });
        }

        // Get participants video streams and screen sharing streams
        console.log("Participant streams ---");
        console.log(participant);
        // participant.screenSharingStreams.map(v => console.log(v));
        let participantStreams = participant.videoStreams.map(v => { return { stream: v, userId: userId } });
        // Filter out the participant stream tuples that are not already in this.state.streams
        participantStreams = participantStreams.filter(streamTuple => { return !this.state.streams.some(tuple => { return tuple.stream === streamTuple.stream && tuple.userId === streamTuple.userId }) });
        // Add participantStreams to the list of all remote participant streams
        this.setState({ streams: this.state.streams.concat(participantStreams) });
        participant.on('videoStreamsUpdated', handleParticipantStream);
        participant.on('screenSharingStreamsUpdated', handleParticipantStream);
    }

    render() {
        return (<>
            < div className="call-screen" >
                <CallSection {...this.state} deviceManager={this.state.deviceManager} />
                <div className='chat-section'>
                    <ChatArea selectedDoctor={this.props.selectedDoctor} selectedPatient={this.props.selectedPatient} />
                </div>
            </div >
        </>
        );
    }
}

export default CallCard;