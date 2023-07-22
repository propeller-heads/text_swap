import { useState } from "react";
import "./App.css";
import axios from 'axios';
import logo from "./assets/logo.png";
import ChatWithButtonPair from './components/submitButton.tsx';

function App({ account, setAccount }){
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    window.scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({ role: "user", content: {"message": message}, "buttons":{"yes": true, "no": true}});
    setChats(msgs);

    setMessage("");
    var request_data = {
      "message": message,
      "wallet": account,
    }
    console.log(request_data);

    axios.post("http://localhost:8000/chat", request_data)
    .then((res) => {
      const data = res.data; // Access the parsed JSON data directly from res.data
      console.log(data);
      console.log(data.message);
      
      if (data.intent) {
        msgs.push({ role: "agent", content: data, "buttons":{"yes": false, "no": false}});
      }
      else{
        msgs.push({ role: "agent", content: data, "buttons":{"yes": true, "no": true}});
      }

      setIsTyping(false);
      setChats(msgs);
      window.scrollTo(0, 1e10);
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <main>      
      <div className="header">
        <img src={logo} className="App-logo" alt="broken" />
        <h1>Text Swap</h1>
      </div>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
            <ChatWithButtonPair chat={chat} onYesClick={() => console.log("Print yes")} onNoClick={() =>console.log("print nein")} isYesDisabled={chat.buttons.yes} isNoDisabled={chat.buttons.no}/>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)} >
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Lemme know what ya wanna swap, I'll do it for ya, bro..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;