import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navlink, Switch, Route } from 'react-router-dom'

import { faSignOutAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import './Chat.css';

function LeftPane(props) {
    // console.log("Chat Rooms", props.data.chatRooms)
    // console.log(。)

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
                <div id="newRoom" className="LeftTopBarElement">
                <FontAwesomeIcon icon={faPlus}  className="logo-icon"/>
                    
                </div>
            </div>
            <input
                className="Left-search-input"
                placeholder="Search Rooms"
                value={props.data.leftFilter}
                onChange={(e) => props.handlers.setLeftFilter(e.target.value)}
                // onKeyDown={(e) => {
                //     props.handlers.sendMessage();
                // }
            // }
            ></input>
            <div id="LeftListOfChatRoom">
                {props.data.chatRooms.map((chatroom, index)=>(
                    <div key={index} className={index==props.data.selectedChat?"LeftIndividualChatRoom selected":"LeftIndividualChatRoom"} 
                    id={index} onClick={(e) => {props.handlers.changeChatRoom(e, index)}}>
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