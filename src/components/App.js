import React, {useEffect, useState} from 'react';
import Chat from "./Chat"
import db from "./db"
import theme_arr from "./theme"


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
    const [emoji, setEmoji] = useState(0);
    const [theme, setTheme] = useState(2);
    const [initialized, setInitialized] = useState(false);
    const [recvMessage, setRecvMessage] = useState("");
    const [recvRoom, setRecvRoom] = useState("");
    const [recvLeave, setRecvLeave] = useState("");
    const [recvJoin, setRecvJoin] = useState("");
    const [recvTitle, setRecvTitle] = useState("");
    const [recvEmojiTheme, setRecvEmojiTheme] = useState("");
    
    
    useEffect(()=>{
        if(!initialized){
            socket.on('connect', (data) => {
                console.log(socket.connected); // true
                console.log("connect")
                console.log(data)
            });
            
            socket.on('invite', (data) =>{
                setRecvRoom(data.chatroom_name)
                socket.emit("join", {chatroom_name: data.chatroom_name})
            })

            socket.on('member_left', (data)=>{
                console.log("member left")
                setRecvLeave(data)
            })

            socket.on('new_members', (data)=>{
                console.log("member changed")
                setRecvJoin(data)
            })
            
            socket.on('message', (data) =>{
                console.log(data)
            })
            
            socket.on('new_message', (data) => {
                setRecvMessage(data)
                console.log(data); // true
            })

            socket.on('chatroom_name_changed', (data) => {
                setRecvTitle(data)
                alert("room changed!")
                console.log(data); // true
            })

            socket.on('emoji_theme_out', (data) => {
                setRecvEmojiTheme(data)
                console.log(data); // true
            })

            setInitialized(true)
        }
    }, [initialized])

    useEffect(()=>{
        console.log("received message: id, selecetd")
        console.log(typeof recvMessage.room_id)
        console.log(typeof selectedChat)
        console.log(recvMessage.room_id)
        console.log(selectedChat)
        console.log(chatContent !== undefined)
        console.log(chatContent.messages !== undefined)
        console.log(recvMessage.room_id == selectedChat)
        if(chatContent !== undefined && chatContent.messages !== undefined && recvMessage.room_id == selectedChat){
            console.log("adding a new message")
            var tmpChatContent = Object.assign({}, chatContent);
            tmpChatContent.messages.push(recvMessage)
            setChatContent(tmpChatContent)
        }

        if(chatRooms !== undefined){
            var i = findIndexFromID(recvMessage.room_id)
            if(i != -1){
                var tmpChatrooms = chatRooms.slice()
                tmpChatrooms[i].last_sender = recvMessage.sender
                tmpChatrooms[i].last_message = recvMessage.body
                tmpChatrooms[i].last_send_date = Date.now()
                
                tmpChatrooms.sort( compare );

                setChatRooms(tmpChatrooms)
            }
        }
    }, [recvMessage])

    useEffect(()=>{
        console.log(recvEmojiTheme)
        if(chatContent !== undefined && chatContent.messages !== undefined && selectedChat === recvEmojiTheme.room_id){
            var tmpChatContent = Object.assign({}, chatContent);
            tmpChatContent.emoji = recvEmojiTheme.emoji_index
            tmpChatContent.theme = recvEmojiTheme.theme_index
            setChatContent(tmpChatContent)
        }
    }, [recvEmojiTheme])

    useEffect(()=>{
        console.log("someone leave")
        console.log(recvLeave)
        if(chatContent !== undefined && chatContent.messages !== undefined && selectedChat === recvLeave.room_id){
            var tmpChatContent = Object.assign({}, chatContent);
            tmpChatContent.people.splice(tmpChatContent.people.indexOf(recvLeave.left_member), 1);
            setChatContent(tmpChatContent)
        }
    }, [recvLeave])

    useEffect(()=>{
        console.log("someone leave")
        console.log(recvTitle)
        if(selectedChat === recvTitle.room_id){
            // alert("changing is here")
            selectedChat = recvTitle.new_name
            var tmpChatContent = Object.assign({}, chatContent);
            tmpChatContent.name = recvTitle.new_name
            setChatContent(tmpChatContent)
        }
        
        var ind = findIndexFromID(recvTitle.room_id)
        if(ind == -1){
            return
        }
        var tmpChatrooms = chatRooms.slice()
        tmpChatrooms[ind].name = recvTitle.new_name
        tmpChatrooms.sort(compare)
        setChatRooms(tmpChatrooms)

    }, [recvTitle])

    useEffect(()=>{
        console.log("someone join")
        console.log(recvJoin)
        if(chatContent !== undefined && chatContent.messages !== undefined && selectedChat === recvJoin.room_id){
            var tmpChatContent = Object.assign({}, chatContent);
            tmpChatContent.people = recvJoin.members
            setChatContent(tmpChatContent)
        }
    }, [recvJoin])


    useEffect(()=>{
        if(recvRoom === ""){
            return
        }
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
            console.log("this is what I got from calling the API")
            console.log(result)
            var tmpChatroom = result["data"]
            tmpChatroom.sort( compare );
            setChatRooms(tmpChatroom)
        })
        .catch(error => {
            console.log('error', error)
            // alert("Can't Connect to Server")
        });
        
        setRecvRoom("")
    }, [recvRoom])


    useEffect(()=>{
        console.log("these are chatrooms")
        console.log(chatRooms)
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
            tmpChatrooms.sort(compare)
            setChatRooms(tmpChatrooms)
        }
        

    }, [selectedChat])

    useEffect(()=>{
        function compare( a, b ) {
            if ( new Date(a.last_send_date).getTime() > new Date(b.last_send_date).getTime() ){
                return -1;
            }
            if ( new Date(a.last_send_date).getTime() < new Date(b.last_send_date).getTime() ){
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
                
                console.log("this is what I got from API")
                console.log(result)
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
            setTheme(chatContent.theme)
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
        changeTheme(2, false)
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

        // alert(findNameFromID(selectedChat))
        console.log("The chatroom name is:")
        console.log(findNameFromID(selectedChat))
        socket.emit('message', {username: username, chatroom_name: findNameFromID(selectedChat), content: msg})

        //date.now

        setSendingMessageBody("");
    }

    const setNewTitle = (title)=>{
        // alert(title)

        // var tmpChatContent = Object.assign({}, chatContent);
        // tmpChatContent.name = title
        // console.log("updating Chat Content: ")
        // console.log(chatContent)
        // setChatContent(tmpChatContent)

        // var tmpChatrooms = chatRooms.slice()
        // tmpChatrooms[findIndexFromID(selectedChat)].name = title
        // setChatRooms(tmpChatrooms)


        var formdata = new FormData();
        formdata.append("username", username);
        formdata.append("cookie", cookie);
        formdata.append("chatroom_name", selectedChat);
        formdata.append("new_chatroom_name", title)

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
          
        fetch("http://34.80.122.70:5000/change_room_name", requestOptions)
        .then(response => response.text())
        .then(result => {
            if(result === "failed"){
                alert("change failed")
                return
            }
            if(result === "successful"){

            }
        })
        .catch(error => console.log('error', error));

        // Call backend for update
        // Use the new initialized stuff to change chatContent and change chatList
    }

    const changeEmoji = (emoji_in)=>{
        setEmoji(emoji_in)

        socket.emit("emoji_theme", {chatroom_id: selectedChat, emoji_index: emoji_in, theme_index: theme})
    }

    const changeTheme = (theme_in, do_emit=true)=>{
        setTheme(theme_in)
        if(do_emit){
            socket.emit("emoji_theme", {chatroom_id: selectedChat, emoji_index: emoji, theme_index: theme_in})
        }
    }

    useEffect(()=>{
        var t = theme_arr[theme];  
        
        console.log(t)
        for (const property in t) {
            console.log(`${property}: ${t[property]}`);
            document.documentElement.style.setProperty(
                `${property}`,
                ` ${t[property]}`
            );
        }
    }, [theme])

    
    const leaveChatRoom = (evt)=>{
        var obj = {username: username, chatroom_name: findNameFromID(selectedChat)}
        socket.emit("leave", obj)
        var tmp = chatRooms.slice()
        tmp.splice(findIndexFromID(selectedChat), 1);
        tmp.sort(compare)
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
        formdata.append("chatroom_name", findNameFromID(selectedChat));
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
                // alert("happy")
                
                var tmpChatContent = Object.assign({}, chatContent);
                tmpChatContent.people.push(member)
                setChatContent(tmpChatContent)

            }
        })
        .catch(error => console.log('error', error));


        setMemberInput("")
    }

    const createNewChatroom = (newName, setNewName) => {

        if(newName === ""){
            alert("Room Name Cannot be null")
            return
        }

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
                // alert("weird error")
                console.log("weird error")
                return
            }
            if(result === "successful"){
                formdata = new FormData();
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
                    console.log("this is what I got from calling the API")
                    console.log(result)
                    var tmpChatroom = result["data"]
                    for(var i in tmpChatroom){

                    }
                    tmpChatroom.sort( compare );
                    setChatRooms(tmpChatroom)
                })
                .catch(error => {
                    console.log('error', error)
                    // alert("Can't Connect to Server")
                });
                
                return
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
                    <h1 className="login-title"> NTU Chat 
                    </h1>
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