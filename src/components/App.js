import React, {useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Navlink, Switch, Route} from 'react-router-dom'
import Chat from "./Chat"
import db from "./db"


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

    

    useEffect(()=>{
        if(chatRooms.length > 0){
            setSelectedChat(0)
        }
    }, [chatRooms])

    useEffect(()=>{
        setChatContent(db.sampleChatContents[selectedChat])
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

    const sendMessage = (evt)=>{
        alert("send to backend API");
        setSendingMessageBody("");
    }


    if(!loggedIn){
        return (
        <form onSubmit={handleSubmit}>
            <label>
            First username:
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            </label>
            <input type="submit" value="Log In" />
        </form>
        );
    }
    else{
        return(
            <div>
                <Chat data={{username: username, cookie: cookie, chatRooms: filteredChatRooms, 
                    selectedChat: selectedChat, chatContent: chatContent, sendingMessageBody: sendingMessageBody,
                    leftFilter: leftFilter}}
                    handlers={{handleLogOut: handleLogOut, setSendingMessageBody: setSendingMessageBody, 
                     sendMessage: sendMessage, changeChatRoom: changeChatRoom, setLeftFilter: setLeftFilter}}/>
            </div>
        )
    }

}
  


export default App;