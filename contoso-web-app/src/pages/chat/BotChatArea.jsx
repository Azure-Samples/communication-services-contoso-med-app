import React, { useEffect, useState } from 'react';
import './ChatArea.scss';

import { connect } from 'react-redux';
import { sendMessage } from "../../data/actions/chat.actions";

const BotChatArea = ({ authInfo, sendMessage, currentBotThreadInfo, messages }) => {

    const [message, setMessage] = useState('')

    const chatBubbles = (messages.length > 0) ? messages.map(message => {
        let sender = message.senderDisplayName
        let messageBody = ''
        if (sender === 'Reception Bot' || sender === 'Bot') {
            try {
                messageBody = JSON.parse(message.content.message).text
            }
            catch (e) {
                console.log(e)
            }
        }
        else {
            messageBody = message.content.message
        }
        return (<tr className="chat-bubble" key={message.messageId}>
            <td>
            <div className={message.sender.communicationUserId === authInfo.spoolID ? "sender-chat-bubble" : "receiver-chat-bubble"}>
                    <div className="message-user-name">{message.sender.communicationUserId === authInfo.spoolID ? "You" : message.senderDisplayName}</div>
                    <div className={message.sender.communicationUserId === authInfo.spoolID ? "sender-chat-bubble-box" : "receiver-chat-bubble-box"}>
                        <div className="message-content">{messageBody}</div>
                        <div className="message-date-time">{new Date(message.createdOn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </div>
            </td>
        </tr>)
    }) : (<div className='m-5 text-center'>No messages</div>)

    const footerInterface = (
        <div className="chat-area-footer">
            <form className="chat-area-footer-sub-section ml-3" onSubmit={(e) => { e.preventDefault(); sendMessage(currentBotThreadInfo.id, message, authInfo.spoolID); setMessage('') }}>
                <input type="text" className="chat-area-message-textbox mt-2 ml-2" value={message} placeholder="Type your message here..." onChange={(e) => { setMessage(e.target.value) }} />
                <button type='submit' className="chat-area-message-send-btn ml-1">
                    <i className="far fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );

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

    
    return (<>
        <>
            <div className="chat-area-header p-3">
                <div className="user-persona">
                    <img className="user-image" style={{ width: '45px', height: '45px' }} src="https://thumbs.dreamstime.com/b/default-placeholder-doctor-half-length-portrait-photo-avatar-gray-color-default-placeholder-doctor-half-length-portrait-113622206.jpg" alt="" />
                    <div className="user-status online" style={{ width: '13px', height: '13px', bottom: '2px' }}></div>
                </div>
                <div className="chat-area-header-details">
                    <div className="chat-area-header-name">{currentBotThreadInfo.topic}</div>
                    <div className="chat-area-header-subtitle">Support Conversation</div>
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
    </>);
}

const mapStateToProps = (globalState) => ({
    authInfo: globalState.auth,
    currentBotThreadInfo: globalState.chat.currentThreadInfo,
    messages: globalState.chat.messages
})

const mapDispatchToProps = {
    sendMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(BotChatArea);