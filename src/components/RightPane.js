import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navlink, Switch, Route } from 'react-router-dom'
import Popup from 'reactjs-popup';
import './Chat.css';

function RightPane(props) {
    return (
        <div id="RightPaneContainer">
            <div className="offset_5">
            </div>
            <div className="button_container">
                <div className="right_pane_button" onClick={(e) => {props.handlers.leaveChatRoom(e)}}>
                    Leave Chatroom
                </div>
            </div>
            <div　className="right_people_list">
                Members
                {props.data.chatContent!=undefined && props.data.chatContent.people!=undefined? 
                (
                    props.data.chatContent.people.map((person, i) => (
                    <div className="right_person">{person}</div>
                )))
                : 
                (
                    <div> loading </div>
                )}
            </div>
            <div className="add-new-member-container">
                <input
                    className="right-member-input"
                    placeholder="Add Member"
                    value={props.data.newMember}
                    onChange={(e) => props.handlers.setNewMember(e.target.value)}
                ></input>
                <button onClick={(e) => {
                            props.handlers.addNewMember(props.data.newMember, props.handlers.setNewMember);
                    }} className="add-member-button">Invite</button>
            </div>

            <div className="select-emoji">
                Emoji
                <div className="emojis-container">
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji("🌴")}}> 🌴 </div>
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji("🥛")}}> 🥛 </div>
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji("🐒")}}> 🐒 </div>
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji("🥺")}}> 🥺 </div>
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji("🌐")}}> 🌐 </div>
                </div>
            </div>
            <div className="offset_5">
            </div>
            <div className="select-emoji">
                Theme
                <div className="emojis-container">
                    <div className="emoji" style={{backgroundColor: "#cceca4"}} onClick={(e) => {props.handlers.changeTheme(0)}}></div>
                    <div className="emoji" style={{backgroundColor: "#d5b9a1"}} onClick={(e) => {props.handlers.changeTheme(1)}}></div>
                    <div className="emoji" style={{backgroundColor: "#bebdbc"}} onClick={(e) => {props.handlers.changeTheme(2)}}></div>
                    <div className="emoji" style={{backgroundColor: "#f5e1a5"}} onClick={(e) => {props.handlers.changeTheme(3)}}></div>
                    <div className="emoji" style={{backgroundColor: "#b3e6ea"}} onClick={(e) => {props.handlers.changeTheme(4)}}></div>
                </div>
            </div>
        </div>
    )

}



export default RightPane;
