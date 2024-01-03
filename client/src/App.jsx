import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import PrivateKey from "./PrivateKey";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <div className="app">
      <PrivateKey setPrivateKey={setPrivateKey} privateKey={privateKey} setWalletAddress={setWalletAddress}/>
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        walletAddress={walletAddress}
      />
      <Transfer setBalance={setBalance} address={address} privateKey={privateKey} walletAddress={walletAddress}/>
    </div>
  );
}

export default App;
