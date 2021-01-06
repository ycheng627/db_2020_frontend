import React, {useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Navlink, Switch, Route} from 'react-router-dom'
import LeftPane from "./LeftPane"
import MidPane from "./MidPane"
import RightPane from "./RightPane"
import './Chat.css';

function Chat(props){
    // props.handleLogOut();
    return(
        <div id="MainContainer">
            <LeftPane {...props}/>
            <MidPane {...props}/>
            <RightPane {...props}/>
            {/*<MainPart /> */}
        </div>
    )

}
  


export default Chat;