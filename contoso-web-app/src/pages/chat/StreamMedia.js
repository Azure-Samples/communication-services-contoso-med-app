// © Microsoft Corporation. All rights reserved.
// , { useEffect, createRef }
import React from "react";
import './CallSection.css';
import { Renderer } from "@azure/communication-calling";

export default class StreamMedia extends React.Component {
    constructor(props) {
        super(props);
        this.id = Date.now();
        this.stream = props.stream;
        this.userId = props.userId;
        this.numOfStreams = props.numOfStreams;
        this.state = {
            isAvailable: props.stream.isAvailable
        };
    }

    /**
     * Start stream after DOM has rendered
     */
    async componentDidMount() {
        console.log('StreamMedia', this.stream, this.userId);
        let renderer;
        const renderStream = async () => {
            renderer = new Renderer(this.stream);
            const view = await renderer.createView();
            document.getElementById(`${this.userId}-${this.stream.type}-${this.stream.id}`).appendChild(view.target);
        }

        this.stream.on('availabilityChanged', async () => {
            console.log(`EVENT, stream=${this.stream.type}, availabilityChanged=${this.stream.isAvailable}`);
            if (this.stream.isAvailable) {
                this.setState({ isAvailable: true });
                await renderStream();
            } else {
                this.setState({ isAvailable: false });
                renderer.dispose();
            }
        });
        if (this.stream.isAvailable) {
            this.setState({ isAvailable: true });
            await renderStream();
        }
    }

    render() {
        if (this.state.isAvailable) {
            return (
                <div className="video-stream" id={`${this.userId}-${this.stream.type}-${this.stream.id}`}></div>
            );
        } else {
            return null;
        }
    }
}



