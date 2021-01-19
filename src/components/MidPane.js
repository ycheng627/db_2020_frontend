import React, {useEffect, useState, useRef } from 'react';
import './Chat.css';
import { faEdit, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function MidPane(props) {
    const messagesEndRef = useRef(null)
    const [tmpChatTitle, setTmpChatTitle] = useState("")
    const [editTitle, setEditTitle] = useState(false)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" })
    }

    const emojis = ["🌴", "🥛", "🐒", "🥺", "🌐"]

    useEffect(()=>{
        if(props.data.chatContent !== undefined){
            setTmpChatTitle(props.data.chatContent.name)
            setEditTitle(false)
        }
    }, [props.data.chatContent])

    useEffect(scrollToBottom, [props.data.chatContent]);

    return (
        <div id="MidPaneContainer">
                {editTitle === true?
                    ( <div className="Chat_title_container">
                        <input
                            className="Chat_title"
                            value={tmpChatTitle}
                            onChange={(e) => setTmpChatTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){
                                    setEditTitle(false);
                                    props.handlers.setNewTitle(tmpChatTitle);
                                }
                            }
                        }
                        ></input>
                    </div>):(

                    <div className="Chat_title_container">
                        <div className="Chat_title">
                            {props.data.chatContent !== undefined?props.data.chatContent.name:"udef"}
                        </div>
                        <div className="rename_button" onClick={(e) => {setEditTitle(true)}}>
                            <FontAwesomeIcon icon={faEdit} className="logo-icon"/>
                        </div>
                    </div>
                    )
            }
                
            <div className="Chat-messages">

                {props.data.chatContent !== undefined && props.data.chatContent.messages !== undefined? (props.data.chatContent.messages.length === 0 ? (
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
                <div style={{ float:"left", clear: "both"}}
                    ref={messagesEndRef}>
                </div>
            </div >
            <div className="Chat-input-container">
                <textarea
                className="Chat-input"
                placeholder="Message Body 🐑"
                value={props.data.sendingMessageBody}
                onChange={(e) => {
                    if(e.target.value !== '\n'){
                        props.handlers.setSendingMessageBody(e.target.value)
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        props.handlers.sendMessage(props.data.sendingMessageBody);
                    }
                }}
                ></textarea>
                {props.data.sendingMessageBody === ""? (
                        <div className="send-icon" onClick={(e) => { props.handlers.sendMessage(emojis[props.data.emoji])}}>{emojis[props.data.emoji]}</div>
                    ) : (
                        <div className="send-icon" onClick={(e) => { props.handlers.sendMessage(props.data.sendingMessageBody)}}>
                            <FontAwesomeIcon icon={faPaperPlane} className="logo-icon"/>
                        </div>
                    )
                }
            </div>
        </div>
    )

}



export default MidPane;