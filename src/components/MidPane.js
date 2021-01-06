import React, {useEffect, useState, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navlink, Switch, Route } from 'react-router-dom'
import './Chat.css';
import { Button, Input, message, Tag } from 'antd'


function MidPane(props) {

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" })
    }

    useEffect(scrollToBottom, [props.data.chatContent]);


    return (
        <div id="MidPaneContainer">
            {/* <p> Selected Chat is: {props.data.selectedChat}</p> */}
            <div className="Chat-title">
                {props.data.chatContent != undefined?props.data.chatContent.name:"udef"}
                {/* {props.data.chatContent.name} */}
            </div>
            <div className="Chat-messages">

                {props.data.chatContent != undefined && props.data.chatContent.messages != undefined? (props.data.chatContent.messages.length === 0 ? (
                <p>
                    {'No messages...'}
                </p>
                ) : (
                    
                    props.data.chatContent.messages.map(({ sender, body }, i) => (
                        <div className={props.data.username===sender?"Chat-message right":"Chat-message left"} key={i}>
                            <div className="Chat-message-sender">{sender}</div>
                            <div className="Chat-message-body">{body}</div>
                            <div className="Chat-message-filler"></div>
                        </div>
                    ))
                    
                )
                ):( <p style={{ color: '#ccc' }}>
                {'loading...'}
                </p>)}
                <div style={{ float:"left", clear: "both" }}
                    ref={messagesEndRef}>
                </div>
            </div>
            {/* <div > */}
                <textarea
                className="Chat-input"
                placeholder="Message Body"
                value={props.data.sendingMessageBody}
                onChange={(e) => props.handlers.setSendingMessageBody(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    props.handlers.sendMessage();
                }
                }}
            ></textarea>

            {/* </div> */}
            


        </div>
    )

}



export default MidPane;