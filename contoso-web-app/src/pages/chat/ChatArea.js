import React, { useEffect, useState } from 'react';
import './ChatArea.scss';
import profilePicture from '../../assets/images/user-profile.png'

import { connect } from 'react-redux';
import { createThread, sendMessage } from "../../data/actions/chat.actions";

import { constants } from "../../config";

const ChatArea = ({ authInfo, selectedDoctor, selectedPatient, createThread, sendMessage, currentThreadInfo, onCallPlaced, messages }) => {

    const [message, setMessage] = useState('')

    const chatBubbles = (messages.length > 0) ? messages.map(message => {
        return (<tr className="chat-bubble" key={message.messageId}>
            <td>
            <div className={message.sender.communicationUserId === authInfo.spoolID ? "sender-chat-bubble" : "receiver-chat-bubble"}>
                    <div className="message-user-name">{message.sender.communicationUserId === authInfo.spoolID ? "You" : message.senderDisplayName}</div>
                    <div className={message.sender.communicationUserId === authInfo.spoolID ? "sender-chat-bubble-box" : "receiver-chat-bubble-box"}>
                        <div className="message-content">{message.content.message}</div>
                        <div className="message-date-time">{new Date(message.createdOn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>
            </td>
        </tr>)
    }) : (<div className='m-5 text-center'>No messages</div>)

    const footerInterface = (
        <div className="chat-area-footer">
            <form className="chat-area-footer-sub-section ml-3" onSubmit={(e) => { 
                e.preventDefault();
                sendMessage(currentThreadInfo.threadId, message, authInfo.spoolID); 
                setMessage('') }}>
                <input type="text" className="chat-area-message-textbox mt-2 ml-2" value={message} placeholder="Type your message here..." onChange={(e) => { setMessage(e.target.value) }} />
                <button type='submit' className="chat-area-message-send-btn ml-1">
                    <i className="far fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );
    const doctorInterface = (
        <>
            <div className="chat-area-header p-3">
                <div className="user-persona">
                    <img className="user-image" style={{ width: '45px', height: '45px' }} src={constants.endpoint + '/images/' + selectedDoctor?.pictureUrl} alt="" />
                    <div className="user-status online" style={{ width: '13px', height: '13px', bottom: '2px' }}></div>
                </div>
                <div className="chat-area-header-details">
                    <div className="chat-area-header-name">Dr. {selectedDoctor?.name}</div>
                    <div className="chat-area-header-subtitle">{selectedDoctor?.speciality}</div>
                </div>
                <div className="chat-area-header-options">
                    {onCallPlaced != undefined ? (<button className="chat-area-header-call-btn" onClick={() => {onCallPlaced(selectedDoctor);}}>
                        <i className="fas fa-phone-alt"></i>
                    </button>) : ""}
                </div>
            </div>
            <div className="chat-area-body">
                <table className="chat-area-table">
                    <tbody>
                        {/* Chat bubbles go here */}
                        {chatBubbles}
                    </tbody>
                </table>
            </div>
            <hr className="m-3" />
            {footerInterface}
        </>
    );
    const patientInterface = (
        <>
            <div className="chat-area-header p-3">
                <div className="user-persona">
                    <img className="user-image" style={{ width: '45px', height: '45px' }} src={profilePicture} alt="" />
                    <div className="user-status online" style={{ width: '13px', height: '13px', bottom: '2px' }}></div>
                </div>
                <div className="chat-area-header-details">
                    <div className="chat-area-header-name">{selectedPatient?.name}</div>
                    <div className="chat-area-header-subtitle"></div>
                </div>
                <div className="chat-area-header-options">
                    { onCallPlaced ? (<button className="chat-area-header-call-btn" onClick={() => {onCallPlaced(selectedPatient);}}>
                        <i className="fas fa-phone-alt"></i>
                    </button>) : ""}
                    {/* <button className="chat-area-header-book-btn">
                            Book Consultation
                        </button> */}
                </div>
            </div>
            <div className="chat-area-body">
                <table className="chat-area-table">
                    <tbody>
                        {/* Chat bubbles go here */}
                        {chatBubbles}
                    </tbody>
                </table>
            </div>
            <hr className="m-3" />
            {footerInterface}
        </>
    );

    useEffect(() => {
        if (selectedDoctor != undefined || selectedPatient != undefined) {
            if (authInfo.userType == 'Doctor') {
                createThread(selectedPatient.email, authInfo.email)
            }
            else {
                createThread(authInfo.email, selectedDoctor.email)
            }
        }
    }, [selectedDoctor, selectedPatient])

    useEffect(() => {
        if (messages !== undefined) {
            try {
                let chatBody = document.getElementsByClassName('chat-area-body')[0]
                chatBody.scroll(0, chatBody.scrollHeight)
            }
            catch (e) {
                console.log(e)
            }
        }
    }, [messages])

    const selectedInterface = selectedDoctor != undefined ? doctorInterface : (selectedPatient != undefined ? patientInterface : <div className="m-5 text-center">Select user from left</div>);
    return (<>
        {selectedInterface}
    </>);
}

const mapStateToProps = (globalState) => ({
    authInfo: globalState.auth,
    currentThreadInfo: globalState.chat.currentThreadInfo,
    messages: globalState.chat.messages
})

const mapDispatchToProps = {
    createThread,
    sendMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatArea);