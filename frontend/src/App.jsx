import { useState } from "react"
import FusionSDK from '@1inch/fusion-sdk'
import {getTokenDecimals} from "./web3.tsx"
import { Web3ProviderConnector } from "./provider.ts"
import "./App.css";
import axios from 'axios';
import logo from "./assets/logo.png";
import ChatWithButtonPair from './components/submitButton.tsx';

function App({ account, setAccount }){
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState(undefined);

  const order = async (data: string, provider: any): Promise<string> => {
    const sellAmount = +data["sellAmount"] * 10 ** await getTokenDecimals(data["sellToken"]);
    const buyAmount = +data["buyAmount"] * 10 ** await getTokenDecimals(data["buyToken"]);
    const blockchainProvider = new Web3ProviderConnector(provider);
    const sdk = new FusionSDK({
      url: 'https://fusion.1inch.io',
      network: 1,
      blockchainProvider: blockchainProvider,
    });
    sdk.placeOrder({
        fromTokenAddress: data["sellToken"],
        toTokenAddress: data["buyToken"],
        amount: sellAmount.toString(),
        walletAddress: provider.provider.selectedAddress
    }).then(console.log)
  }

  function yesButtonFuction(index){
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
      "wallet_address": account,
    }
    console.log(request_data);

    axios.post("http://localhost:8000/chat", request_data).then((res) => {
      const data = res.data; // Access the parsed JSON data directly from res.data
      console.log(data);

      if (data.intent) {
        msgs.push({ role: "agent", content: data, buttons:{yes: "enabled", no: "enabled"}});
      }
      else{
        msgs.push({ role: "agent", content: data, buttons:{yes: "enabled", no: "enabled"}});
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
            <ChatWithButtonPair chat={chat} onYesClick={() => yesButtonFuction(index)} onNoClick={() => noButtonFunction(index)} isYesDisabled={chat.buttons?.yes} isNoDisabled={chat.buttons?.no}/>
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