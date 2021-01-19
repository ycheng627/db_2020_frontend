import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navlink, Switch, Route } from 'react-router-dom'
import { faSignOutAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from 'reactjs-popup';

import './Chat.css';

function LeftPane(props) {
    const [newRoomName, setNewRoomName] = useState("")
    const msToTime = (millis) =>{
        var seconds = (millis / 1000).toFixed(0);
        var minutes = (seconds / 60).toFixed(0);
        var hours = (minutes / 60).toFixed(0);
        var days = (hours / 24).toFixed(0);
        var weeks = (days / 7).toFixed(0);
        var years = (days / 365).toFixed(0);

        if(seconds < 60)
            return `${seconds}s`;
        if(minutes < 60)
            return `${minutes}m`;
        if(hours < 24)
            return `${hours}h`;
        if(days < 30)
            return `${days}d`;
        if(weeks < 55)
            return `${weeks}w`;
        return `${years}y`
    }

    const getLastTime = (lastSendDate) =>{
        var a = msToTime(Number(Date.now() - new Date(lastSendDate).getTime()))
        return(a)
    }

    return (
        <div id="LeftPaneContainer">
            <div id="LeftTopBarContainer">
                <div id="logo" className="LeftTopBarElement" onClick={props.handlers.handleLogOut}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="logo-icon"
                    rotation={180}/>
                </div>
                
                <div id="AppNameUser" className="LeftTopBarElement">
                    {props.data.username}
                </div>

                <Popup trigger={<div id="newRoom" className="LeftTopBarElement">
                    <FontAwesomeIcon icon={faPlus}  className="logo-icon"/>
                </div>} 
                modal>
                     {close => (
                        <div className="popup">
                            <a className="close" onClick={close}>
                                &times;
                            </a>
                            <h3> Room Name </h3>
                            <div className="content">
                            <input
                                className="Left-search-input"
                                placeholder="New Room Name"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter'){
                                        props.handlers.createNewChatroom(newRoomName, setNewRoomName);
                                        close();
                                    }
                                }
                            }
                            ></input>
                            </div>
                        </div>
                        )}
                </Popup>
                
            </div>
            
            <input
                className="Left-search-input"
                placeholder="Search Rooms"
                value={props.data.leftFilter}
                onChange={(e) => props.handlers.setLeftFilter(e.target.value)}
            ></input>
            <div id="LeftListOfChatRoom">
                {props.data.chatRooms.map((chatroom)=>(
                    <div key={chatroom.id} className={chatroom.id==props.data.selectedChat?"LeftIndividualChatRoom selected":"LeftIndividualChatRoom"} 
                    id={chatroom.id} onClick={(e) => {props.handlers.changeChatRoom(e, chatroom.id)}}>
                        <div className="Chatroom-list-title">{chatroom.name} </div>
                        <div className="Chatroom-list-content"> 
                            <div className="Chatroom-list-sender">{chatroom.lastMessageSender}:  </div>
                            <div className="Chatroom-list-message">  {chatroom.lastMessageText}</div>
                            <div className="Chatroom-list-time">{getLastTime(chatroom.date)}</div>
                        
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )

}



export default LeftPane;
