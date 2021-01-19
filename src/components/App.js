import React, {useEffect, useState} from 'react';
import Chat from "./Chat"
import db from "./db"
import theme from "./theme"

// import socketIOClient from "socket.io-client";
// const ENDPOINT = "ws://34.80.122.70:5000/";

// const socket = socketIOClient(ENDPOINT);
    

import socketIOClient from "socket.io-client";
const ENDPOINT = "ws://34.80.122.70:5000/";

const socket = socketIOClient(ENDPOINT);



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
    const [selectedChat, setSelectedChat] = useState("");
    const [chatContent, setChatContent] = useState([]);
    const [sendingMessageBody, setSendingMessageBody] = useState("");
    const [leftFilter, setLeftFilter] = useState("");
    const [filteredChatRooms, setFilteredChatRooms] = useState(["fwef"])
    const [newMember, setNewMember] = useState("");
    const [emoji, setEmoji] = useState("");
    const [initialized, setInitialized] = useState(false);
    const [recvMessage, setRecvMessage] = useState("");
    const [recvRoom, setRecvRoom] = useState("");
    
    useEffect(()=>{
        if(!initialized){
            socket.on('connect', (data) => {
                console.log(socket.connected); // true
                console.log("connect")
                console.log(data)
            });
            
            socket.on('invite', (data) =>{
                setRecvRoom(data.chatroom_name)
                socket.emit("accept")
            })
            
            socket.on('message', (data) =>{
                console.log(data)
            })
            
            socket.on('new_message', (data) => {
                setRecvMessage(data)
                console.log(data); // true
            })

            setInitialized(true)
        }
    }, [initialized])

    useEffect(()=>{
        if(chatContent !== undefined && chatContent.messages !== undefined){
            var tmpChatContent = Object.assign({}, chatContent);
            tmpChatContent.messages.push(recvMessage)
            setChatContent(tmpChatContent)
        }

        if(chatRooms !== undefined){
            var i = findIndexFromID(selectedChat)
            if(i != -1){
                var tmpChatrooms = chatRooms.slice()
                tmpChatrooms[i].last_sender = recvMessage.sender
                tmpChatrooms[i].last_message = recvMessage.body
                tmpChatrooms[i].last_send_date = Date.now()
                setChatRooms(tmpChatrooms)
            }
        }
    }, [recvMessage])

    useEffect(()=>{
        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("cookie", cookie);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            // mode: "no-cors",
            redirect: 'follow'
        };
        
        fetch("http://34.80.122.70:5000/chatrooms", requestOptions)
        .then(response => response.text())
        .then(result => {
            
            console.log("this is my chatroom list")
            console.log(result)
            result = JSON.parse(result)
            var tmpChatroom = result["data"]
            tmpChatroom.sort( compare );
            setChatRooms(tmpChatroom)
        })
        .catch(error => {
            console.log('error', error)
            // alert("Can't Connect to Server")
        });

    }, [recvRoom])


    useEffect(()=>{
        for(var i in chatRooms){
            var obj = {chatroom_name: chatRooms[i].name}
            socket.emit('join', obj)
        }
        if(chatRooms.length > 0 && selectedChat === ""){
            setSelectedChat(chatRooms[0].id)
        }

    }, [chatRooms])


    const findIndexFromID = (id)=>{
        for(var i = 0; i < chatRooms.length; i++){
            if(id === chatRooms[i].id){
                return i
            }
        }
        return -1
    }

    const findContentIndexFromChatID = (id)=>{
        for(var i = 0; i < db.sampleChatContents.length; i++){
            if(id === db.sampleChatContents[i].id){
                return i
            }
        }

        return -1
    }

    const findNameFromID = (id)=>{
        for(var i = 0; i < chatRooms.length; i++){
            if(id === chatRooms[i].id){
                return chatRooms[i].name
            }
        }

        return ""
    }

    function compare( a, b ) {
        if ( a.last_send_date > b.last_send_date ){
            return -1;
        }
        if ( a.last_send_date < b.last_send_date ){
            return 1;
        }
        return 0;
    }
    
    const newChatListObject = (roomName)=>{
        return {   
            name: roomName, 
            id: roomName,
            last_send_date: Date.now(),
            last_read_date: Date.now(),
            last_message: "",
            last_sender: "",
            read: false
        }
    }

    useEffect(()=>{
        if(selectedChat !== ""){
            
            var formdata = new FormData();
            formdata.append("username", username);
            formdata.append("cookie", cookie);
            


            var requestOptions = {
                method: 'POST',
                body: formdata,
                // mode: "no-cors",
                redirect: 'follow'
            };
            
            fetch(`http://34.80.122.70:5000/chat/${selectedChat}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                result = JSON.parse(result)
                console.log(result)
                setChatContent(result)
            })
            .catch(error => {
                console.log('error', error)
                alert("Can't Connect to Server")
            });       
            
            // setChatContent(db.sampleChatContents[findContentIndexFromChatID(selectedChat)])
            
            var tmpChatrooms = chatRooms.slice()
            console.log("this is selected:")
            console.log(selectedChat)
            tmpChatrooms[findIndexFromID(selectedChat)].last_read_date = Date.now();
            setChatRooms(tmpChatrooms)
        }
        

    }, [selectedChat])

    useEffect(()=>{
        function compare( a, b ) {
            if ( a.last_send_date > b.last_send_date ){
                return -1;
            }
            if ( a.last_send_date < b.last_send_date ){
                return 1;
            }
            return 0;
        }
        if(loggedIn && cookie!==""){
            socket.emit('init', {username: username, cookie: cookie})
            
            var formdata = new FormData();
            formdata.append("username", username);
            formdata.append("cookie", cookie);

            var requestOptions = {
                method: 'POST',
                body: formdata,
                // mode: "no-cors",
                redirect: 'follow'
            };
            
            fetch("http://34.80.122.70:5000/chatrooms", requestOptions)
            .then(response => response.text())
            .then(result => {
                
                console.log("this is my chatroom list")
                console.log(result)
                result = JSON.parse(result)
                var tmpChatroom = result["data"]
                tmpChatroom.sort( compare );
                setChatRooms(tmpChatroom)
            })
            .catch(error => {
                console.log('error', error)
                alert("Can't Connect to Server")
            });

        }
    }, [loggedIn, cookie])
    
    useEffect(()=>{
        function matchName(indiv_chatroom){
            return indiv_chatroom.name.includes(leftFilter)
        }
        setFilteredChatRooms(chatRooms.filter(matchName))
    }, [chatRooms, leftFilter])

    useEffect(()=>{
        console.log("updated chatConent")
        console.log(chatContent)
        if(chatContent !== undefined && chatContent.emoji !== undefined){
            setEmoji(chatContent.emoji)
        }
    }, [chatContent])

    const handleLogin = (evt) => {
        evt.preventDefault();


        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("password", password);


        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
          
        fetch("http://34.80.122.70:5000/login", requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result)
            console.log(result)
            if(result.status === "failed"){
                alert("Login Failed: Username taken")
                return;
            }
            setLoggedIn(true)
            setCookie(result.cookie)
            setPassword("")
        })
        .catch(error => {
            console.log('error', error)
            alert("Can't Connect to Server")
        });
        
    }

    const handleLogOut = (evt) =>{
        
        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("cookie", cookie);


        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
          
        fetch("http://34.80.122.70:5000/logout", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log("logged out")
        })
        .catch(error => {
            console.log('error', error)
            // alert("Can't Connect to Server")
        });

        setLoggedIn(false)
        setCookie("")
        setUsername("")
        setPassword("")
        setChatRooms([])
        setChatContent({})
        setSelectedChat("")
    }

    const changeChatRoom = (evt, id) =>{
        // console.log(evt, id)
        setSelectedChat(id)
    }

    

    const sendMessage = (msg)=>{
        // alert(`send to backend API ${msg}`);
        if(msg === ""){
            return
        }
        socket.emit('message', {username: username, chatroom_name: findNameFromID(selectedChat), content: msg})

        //date.now

        setSendingMessageBody("");
    }

    const setNewTitle = (title)=>{
        alert(title)

        var tmpChatContent = Object.assign({}, chatContent);
        tmpChatContent.name = title
        console.log("updating Chat Content: ")
        console.log(chatContent)
        setChatContent(tmpChatContent)

        var tmpChatrooms = chatRooms.slice()
        tmpChatrooms[findIndexFromID(selectedChat)].name = title
        setChatRooms(tmpChatrooms)

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
        var obj = {chatroom_name: findNameFromID(selectedChat)}
        socket.emit("leave", obj)
        var tmp = chatRooms.slice()
        tmp.splice(findIndexFromID(selectedChat), 1);
        console.log(tmp)
        setChatRooms(tmp);
        setSelectedChat("");
        setChatContent([])
    }

    const addNewMember = (member, setMemberInput) => {
        console.log(member)

        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("cookie", cookie);
        formdata.append("chatroom_name", selectedChat);
        formdata.append("new_member_name", member)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
          
        fetch("http://34.80.122.70:5000/add_member", requestOptions)
        .then(response => response.text())
        .then(result => {
            if(result === "failed"){
                alert("add member failed")
                return
            }
            if(result === "successful"){
                alert("happy")
                
                var tmpChatContent = Object.assign({}, chatContent);
                tmpChatContent.people.push(member)
                setChatContent(tmpChatContent)

            }
        })
        .catch(error => console.log('error', error));


        setMemberInput("")
    }

    const createNewChatroom = (newName, setNewName) => {

        

        alert(`new room: ${newName}`)

        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("cookie", cookie);
        formdata.append("chatroom_name", newName);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
          
        fetch("http://34.80.122.70:5000/create_room", requestOptions)
        .then(response => response.text())
        .then(result => {
            if(result === "failed"){
                alert("room already exist")
                console.log("room already exist")
                return
            }
            if(result === "authentication failed"){
                alert("weird error")
                console.log("weird error")
                return
            }
            if(result === "successful"){
                var tmpChatrooms = chatRooms.slice()
                var newRoom = newChatListObject(newName)
                tmpChatrooms.push(newRoom)
                tmpChatrooms.sort( compare );
                setChatRooms(tmpChatrooms)
            }
        })
        .catch(error => console.log('error', error));

        

        setNewName("")
    }

    if(!loggedIn){
        return (
        <div className="login-background">
            <div className="center-center">
                <form onSubmit={handleLogin}>
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