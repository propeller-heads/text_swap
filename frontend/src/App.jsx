import { useState } from "react";
import "./App.css";
import axios from 'axios';
import logo from "./assets/logo.png";
import { getTokenDecimals } from './web3';
import { Buffer } from 'buffer';
import { FusionSDK } from '@1inch/fusion-sdk'
import { Web3ProviderConnector } from './fusion/provider'

function App({ account, setAccount }){
  window.Buffer = Buffer;
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState(undefined);

  const handleFormSubmit: MainFormProps['onSubmit'] = async (data) => {
    // Handle form submission here
    const sellAmount = +data["sellAmount"] * 10 ** await getTokenDecimals(data["sellToken"]);
    const buyAmount = +data["buyAmount"] * 10 ** await getTokenDecimals(data["buyToken"]);

    const blockchainProvider = new Web3ProviderConnector(provider)
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

  };

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    window.scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
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

      msgs.push({ role: "agent", content: data.message });
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
              <p key={index} className={chat.role === "user" ? "user_msg" : "agent_msg"}>
                <span>{chat.content}</span>
              </p>
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