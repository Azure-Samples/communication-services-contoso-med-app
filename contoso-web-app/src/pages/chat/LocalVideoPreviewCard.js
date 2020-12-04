// © Microsoft Corporation. All rights reserved.

import React, { Component } from "react";
import { Card } from 'react-bootstrap';
import { LocalVideoStream, Renderer } from '@azure/communication-calling';

export default class LocalVideoPreviewCard extends React.Component {
    constructor(props) {
        super(props);
        this.deviceManager = props.deviceManager;
        this.cameraDevice = props.cameraDevice;
        this.callClient = props.callClient;
        this.renderer = null;
    }

    async componentDidMount() {
        let cameraDevice = this.deviceManager.getCameraList()[0];
        const target = document.getElementById('localVideoRenderer');
        try {
            const localVideoStream = new LocalVideoStream(cameraDevice);
            this.renderer = new Renderer(localVideoStream);
            const view = await this.renderer.createView();
            document.getElementById('localVideoRenderer').appendChild(view.target);
        } catch (err) {
            if (this.deviceManager.getCameraList().length > 1) {
                cameraDevice = this.deviceManager.getCameraList()[1];
                const localVideoStream = new LocalVideoStream(cameraDevice);
                this.renderer = new Renderer(localVideoStream);
                const view = await this.renderer.createView();
                document.getElementById('localVideoRenderer').appendChild(view.target);
                this.props.handleCameraInUse('cameraChanged');
            } else {
                alert("Camera device already in use by another process");
                this.props.handleCameraInUse('videoOff');
            }
        }
    }

    componentWillUnmount() {
        try {
            this.renderer.dispose();
        }
        catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <div id="localVideoRenderer" style={{ maxHeight: '20%', maxWidth: '32%', zIndex: 2, position: 'absolute', right: '60px', top: '20px' }}></div >
        );
    }
}
