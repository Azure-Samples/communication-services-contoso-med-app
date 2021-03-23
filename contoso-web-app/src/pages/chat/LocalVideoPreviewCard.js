// © Microsoft Corporation. All rights reserved.

import React, { Component } from "react";
import { Card } from 'react-bootstrap';
import { LocalVideoStream, Renderer } from '@azure/communication-calling';

export default class LocalVideoPreviewCard extends React.Component {
    constructor(props) {
        super(props);
        this.deviceManager = props.deviceManager;
        this.selectedCameraDeviceId = props.selectedCameraDeviceId;
    }

    async componentDidMount() {
        const cameras = await this.deviceManager.getCameras();
        this.cameraDeviceInfo = cameras.find(cameraDevice => {
            return cameraDevice.id === this.selectedCameraDeviceId;
        });
        const localVideoStream = new LocalVideoStream(this.cameraDeviceInfo);
        const renderer = new Renderer(localVideoStream);
        this.view = await renderer.createView();
        const targetContainer = document.getElementById('localVideoRenderer');
        targetContainer.appendChild(this.view.target);
    }

    render() {
        return (
            <div id="localVideoRenderer" style={{ maxHeight: '20%', maxWidth: '32%', zIndex: 2, position: 'absolute', right: '60px', top: '20px' }}></div >
        );
    }
}
