import './Chat.css';
import React, {useEffect, useState, useRef } from 'react';
import { faEdit, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from 'reactjs-popup';

function RightPane(props) {

    const [newNickname, setNewNickname] = useState("")

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
                        <div key={i} className="right_person">
                            <div className="right-username">{person.username}</div>
                            <div className="right-nickname"
                            >{person.nickname}</div>
                            <div className="right-nickname-sep"> </div>
                            <Popup trigger={
                                    <FontAwesomeIcon icon={faEdit}  className="logo-icon nickname-button"/>} 
                            modal>
                                {close => (
                                    <div className="popup">
                                        <a className="close" onClick={close}>
                                            &times;
                                        </a>
                                        <h3> New Nickname for {person.username}: </h3>
                                        <div className="content">
                                        <input
                                            className="Left-search-input"
                                            placeholder="New Nickname"
                                            value={newNickname}
                                            onChange={(e) => setNewNickname(e.target.value)}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter'){
                                                    props.handlers.editNickname(person.username, newNickname, setNewNickname);
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
                    onKeyDown={(e) => {
                        if(e.key === 'Enter'){
                            props.handlers.addNewMember(props.data.newMember, props.handlers.setNewMember);
                        }
                    }}
                ></input>
                <button onClick={(e) => {
                            props.handlers.addNewMember(props.data.newMember, props.handlers.setNewMember);
                    }} className="add-member-button">Invite</button>
            </div>

            <div className="select-emoji">
                Emoji
                <div className="emojis-container">
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji(0)}}> 🌴 </div>
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji(1)}}> 🥛 </div>
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji(2)}}> 🐒 </div>
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji(3)}}> 🥺 </div>
                    <div className="emoji" onClick={(e) => {props.handlers.changeEmoji(4)}}> 🌐 </div>
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
