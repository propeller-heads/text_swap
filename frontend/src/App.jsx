import { useState } from "react"
import { Web3ProviderConnector } from "./fusion/provider.ts"
import "./App.css";
import axios from 'axios';
import logo from "./assets/logo.png";
import ChatWithButtonPair from './components/submitButton.tsx';
import { ethers } from 'ethers';
import React from 'react';
import { placeFusionOrder } from './fusion/fusion_order'

function App({ wallet }){
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState(undefined);


  async function loadWeb3Provider(){
        if (!window.ethereum) {
            console.error('You need to connect to the MetaMask extension');
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        const { chainId } = await provider.getNetwork();
//         if (![137, 80001].includes(chainId)) {
//             console.error('You need to connect to the Mumbai or Polygon network');
//         }

        await provider.send('eth_requestAccounts', []);
        console.log("i am a provider", provider);
        setProvider(provider);
    };

  React.useEffect(() => { // Add parentheses here
    loadWeb3Provider();
  }, []);

  async function yesButtonFunction(index){
    console.log("here??", chats);
//     const input_data = chats[index].content.intent;
    const input_data = {
            "amount_in": 20,
            "token_in": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            "token_out": "0x7EA2be2df7BA6E54B1A9C70676f668455E329d29"
        }
    const result = await placeFusionOrder(
    input_data["token_in"], input_data["token_out"], input_data["amount_in"], wallet.account, provider
    );
    setChats((prevChats) => {
      const newChats = [...prevChats]; // Create a new copy of the chats array
      newChats[index] = {
        ...newChats[index],
        buttons: {
          ...newChats[index].buttons,
          no: "disabled",
          yes: "used"
        },
      };
      return newChats;
    });
    // call api back
  }

  function noButtonFunction(index){
    // Create a new copy of the chats array
    const newChats = [...chats];

    // Update the button states for the specific chat at the given index
    newChats[index] = {
      ...newChats[index],
      buttons: {
        yes: "disabled",
        no: "used",
      },
    };

    // Add a new agent message with both buttons disabled
    newChats.push({
      role: "agent",
      content: { message: "What can I do for you?" },
      buttons: { yes: "disabled", no: "disabled" },
    });

    // Set the updated chats array
    setChats(newChats);
  }
  
  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    window.scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({ role: "user", content: {"message": message}, buttons:{yes: "disabled", no: "disabled"}});
    setChats(msgs);

    setMessage("");
    var request_data = {
      "user_query": message,
      "wallet_address": "",
      "token_balances": {}
    };

    if (wallet.account !== "") {
      request_data.wallet_address = wallet.account;
      request_data.token_balances = { [wallet.chain.symbol]: wallet.balance };
    }
    console.log(request_data);

    axios.post("http://localhost:8000/chat", request_data).then((res) => {
      const data = res.data; // Access the parsed JSON data directly from res.data
      console.log(data);

      if (data.intent) {
      console.log("intent", data.intent);
        msgs.push({ role: "agent", content: data, buttons:{yes: "enabled", no: "enabled"}});
      }
      else{
        msgs.push({ role: "agent", content: data, buttons:{yes: "disabled", no: "disabled"}});
      }

      var msg = data.message;
      msg = msg.replace(/^"|"$/g, '');

      setChats(msgs);
      setIsTyping(false);
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
            <ChatWithButtonPair chat={chat} onYesClick={() => yesButtonFunction(index)} onNoClick={() => noButtonFunction(index)} isYesDisabled={chat.buttons?.yes} isNoDisabled={chat.buttons?.no}/>
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