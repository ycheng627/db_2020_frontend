import React, {useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Navlink, Switch, Route} from 'react-router-dom'
import Chat from "./Chat"
import db from "./db"
import theme from "./theme"


function App(props){

    function useLocalStorage(key, initialValue) {
        const [storedValue, setStoredValue] = useState(() => {
          try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
          } 
          catch (error) {
            console.log(error);
            return initialValue;
          }
        });
      
      const setValue = value => {
          try {
            const valueToStore =
              value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
         window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
          } catch (error) {
            console.log(error);
          }
      
        };

    return [storedValue, setValue];
  
  }

    const [chatRooms, setChatRooms] = useState([])
    const [username, setUsername] = useLocalStorage('name', '');
    const [password, setPassword] = useState("")
    const [cookie, setCookie] = useLocalStorage('cookie', '');
    const [loggedIn, setLoggedIn] = useLocalStorage('loggedIn', false);
    const [selectedChat, setSelectedChat] = useState(0);
    const [chatContent, setChatContent] = useState([]);
    const [sendingMessageBody, setSendingMessageBody] = useState("");
    const [leftFilter, setLeftFilter] = useState("");
    const [filteredChatRooms, setFilteredChatRooms] = useState([])
    const [newMember, setNewMember] = useState("");
    const [emoji, setEmoji] = useState("");

    

    useEffect(()=>{
        if(chatRooms.length > 0){
            setSelectedChat(chatRooms[0].id)
        }
    }, [chatRooms])

    const findIndexFromID = (id)=>{
        for(var i = 0; i < chatRooms.length; i++){
            if(id === chatRooms[i].id){
                console.log("the index is : ", i)
                return i
            }
        }
    }

    useEffect(()=>{
        setChatContent(db.sampleChatContents[findIndexFromID(selectedChat)])
        console.log("new chat: ", selectedChat)
    }, [selectedChat])

    useEffect(()=>{
        if(loggedIn){
            setChatRooms(db.sampleChatRooms)
        }
    }, [loggedIn])
    
    useEffect(()=>{
        function matchName(indiv_chatroom){
            return indiv_chatroom.name.includes(leftFilter)
        }
        setFilteredChatRooms(chatRooms.filter(matchName))
    }, [chatRooms, leftFilter])

    useEffect(()=>{
        if(chatContent !== undefined && chatContent.emoji !== undefined){
            setEmoji(chatContent.emoji)
        }
    }, [chatContent])

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoggedIn(true)
        setCookie(btoa(username))
        setPassword("")
    }

    const handleLogOut = (evt) =>{
        setLoggedIn(false)
        setCookie("")
        setUsername("")
        setPassword("")
    }

    const changeChatRoom = (evt, id) =>{
        // console.log(evt, id)
        setSelectedChat(id)
    }

    const sendMessage = (str)=>{
        alert(`send to backend API ${str}`);
        setSendingMessageBody("");
    }

    const setNewTitle = (evt)=>{
        alert(evt.target.value)
        // Call backend for update
        // Use the new initialized stuff to change chatContent and change chatList
    }

    const changeEmoji = (emoji)=>{
        alert(`Changing emoji to ${emoji}`)
        setEmoji(emoji)
    }

    const changeTheme = (themeID)=>{   
        var t = theme[themeID];  
        
        console.log(t)
        for (const property in t) {
            console.log(`${property}: ${t[property]}`);
            document.documentElement.style.setProperty(
                `${property}`,
                ` ${t[property]}`
            );
        }
        alert(`send to backend: ${themeID}`)

        
    }

    const leaveChatRoom = (evt)=>{
        alert("leaving chatroom")
        // Call backend for update
        // Use the new initialized stuff to change chatContent and change chatList
    }

    const addNewMember = (member, setMemberInput) => {
        console.log(member)
        alert(`Adding member to backend: ${member}`)
        setMemberInput("")
    }

    const createNewChatroom = (newName, setNewName) => {
        alert(`new room: ${newName}`)
        setNewName("")
    }

    if(!loggedIn){
        return (
        <div className="login-background">
            <div className="center-center">
                <form onSubmit={handleSubmit}>
                    <label>
                    <h1 className="login-title"> NTU Chat </h1>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="login-input"
                    />
                    </label>
                    <div className="button_container">
                        <input type="submit" value="Login / Register" className="login-button"/>

                    </div>
                </form>
            </div>
        </div>
        );
    }
    else{
        return(
            <div>
                <Chat data={{username: username, cookie: cookie, chatRooms: filteredChatRooms, 
                    selectedChat: selectedChat, chatContent: chatContent, sendingMessageBody: sendingMessageBody,
                    leftFilter: leftFilter, newMember: newMember, emoji: emoji}}
                    handlers={{handleLogOut: handleLogOut, setSendingMessageBody: setSendingMessageBody, 
                     sendMessage: sendMessage, changeChatRoom: changeChatRoom, setLeftFilter: setLeftFilter,
                     setNewTitle: setNewTitle, leaveChatRoom:leaveChatRoom, setNewMember: setNewMember,
                     addNewMember: addNewMember, createNewChatroom:createNewChatroom, changeEmoji: changeEmoji,
                     changeTheme: changeTheme}}/>
            </div>
        )
    }

}
  


export default App;