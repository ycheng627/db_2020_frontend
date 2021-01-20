import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';


// import socketIOClient from "socket.io-client";
// const ENDPOINT = "ws://34.80.122.70:5000/";

// const socket = socketIOClient(ENDPOINT);



ReactDOM.render(
    
  <App/>
  ,
  document.getElementById('root')
);

reportWebVitals();



{/* <React.StrictMode>
<App socket={socket}/>
</React.StrictMode> */}