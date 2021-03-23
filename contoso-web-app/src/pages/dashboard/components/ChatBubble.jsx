import React, { useEffect, useState } from 'react'
import * as ReactMarkdown from "react-markdown";

import { connect } from "react-redux";
import { createBotThread, sendMessage } from "../../../data/actions/chat.actions";

const ChatBubble = ({ authInfo, currentBotThreadInfo, createBotThread, sendMessage, messages }) => {

    // toggle chat bubble visibility
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        if (visible && currentBotThreadInfo === undefined) {
            createBotThread(authInfo.email)
        }
    }, [visible])

    return (
        <>
            <div className="bubble" onClick={() => {
                setVisible(!visible)
            }}>
                {(visible) ?
                    <img
                        className="icon-bubble"
                        src="https://res.cloudinary.com/dtldj8hpa/image/upload/c_scale,h_240/v1599473317/projects/AcsTeleMed/close_white_2048x2048.png"
                        alt="select to open chat menu" />
                    :
                    <img
                        className="icon-bubble"
                        src="https://res.cloudinary.com/dtldj8hpa/image/upload/v1599465754/projects/AcsTeleMed/chat-icon-wh.svg"
                        alt="select to open chat menu" />}
            </div>
            { visible ? <MessageDialog currentBotThreadInfo={currentBotThreadInfo} messages={messages} sendMessage={sendMessage} authInfo={authInfo} /> : ""}
        </>
    )
}

const mapStateToProps = (globalState) => ({
    authInfo: globalState.auth,
    currentBotThreadInfo: globalState.chat.currentThreadInfo,
    messages: globalState.chat.messages
})

const mapDispatchToProps = {
    createBotThread,
    sendMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBubble)

const MessageDialog = ({ currentBotThreadInfo, sendMessage, messages, authInfo }) => {

    // new message to send
    const [currentMessage, setCurrentMessage] = useState('Loading... please wait...')
    const postMessage = async (text) => {
        if (currentBotThreadInfo === undefined) return
        sendMessage(currentBotThreadInfo.threadId, text === undefined ? currentMessage : text, authInfo.spoolID)
        setCurrentMessage('')
    }

    // scroll to bottom on new messages
    useEffect(() => {
        try {
            var messageBox = document.getElementsByClassName('message-box')[0]
            messageBox.scrollTo(0, messageBox.scrollHeight)
        }
        catch(e) {
            console.log(e)
        }
    }, [messages])

    useEffect(() => {
        if (currentBotThreadInfo !== undefined) {
            setCurrentMessage('Hi, Can you help me find a doctor?')
        }
    }, [currentBotThreadInfo])

    return (
        <div className="chat-window">
            <div className="cw-header gradient">
                <img
                    src="https://res.cloudinary.com/dtldj8hpa/image/upload/v1599465958/projects/AcsTeleMed/logo-icn.png"
                    className="icon-bubble"
                />

                <h5 className="text-white">
                    Customer Care
            </h5>
            </div>
            <div className="message-box">
                <MessageList postMessage={postMessage} messages={messages} authInfo={authInfo} />
            </div>
            <form onSubmit={(event) => {
                event.preventDefault();

            }} className="input form cw-form">
                <input
                    type="text"
                    className="cw-msg-inp"
                    placeholder="Type a message"
                    value={currentMessage}
                    onChange={(e) => { setCurrentMessage(e.target.value) }} />
                <button className="cw-sendbtn" onClick={() => { postMessage() }}>
                    <img
                        src="https://res.cloudinary.com/dtldj8hpa/image/upload/v1599467584/projects/AcsTeleMed/send-btn.png"
                        alt="send message" />
                </button>
            </form>
        </div>
    );
}

const MessageList = ({ postMessage, messages, authInfo }) => {

    var messageDivs = messages.map((message) => {
        let formattedMessage = undefined
        // format message
        if (message.sender.communicationUserId === authInfo.spoolID) {
            formattedMessage = { sender: 'me', text: message.content, interactive: false }
        }
        else {
            // if its a reply by bot, parse it
            try {
                let content = JSON.parse(message.content)
                formattedMessage = {
                    sender: 'Reception Bot',
                    text: content.text,
                    interactive: content.prompts !== undefined,
                    buttons: content.prompts,
                    onActionSelected: (text) => { postMessage(text); }
                }
            }
            catch (e) {
                // it is not JSON
                formattedMessage = { sender: 'Doctor', text: message.content, interactive: false }
            }
        }
        return (formattedMessage.sender == 'me') ?
            myMessage(formattedMessage) :
            (formattedMessage.interactive === true) ?
                interactiveMessage(formattedMessage)
                : botMessage(formattedMessage)
    })
    return messageDivs !== undefined ? messageDivs : ''
}

function interactiveMessage(messageProps) {
    return <div className="their-message" key={messageProps.id}>
        <div className='sender-name'>{messageProps.sender}</div>
        <div className="text">
            <ReactMarkdown source={messageProps.text}/>
        </div>
        <div className="interactive-buttons">
            {messageProps.buttons.map(button => {
                return <input key={button.displayText}
                    type="button"
                    className="interactive-msg-btn inactive"
                    onClick={() => { messageProps.onActionSelected(button.displayText) }}
                    value={button.displayText}
                />
            })}
        </div>
    </div>;
}


function myMessage(props) {
    return <div className="my-message" key={props.id}>
        <div className='sender-name'>{props.sender}</div>
        <div className="text">
            <ReactMarkdown source={props.text}/>
        </div>
    </div>
}


function botMessage(props) {
    return <div className="their-message" key={props.id}>
        <div className='sender-name'>{props.sender}</div>
        <div className="text">
            <ReactMarkdown source={props.text}/>
        </div>
    </div>
}