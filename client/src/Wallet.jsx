import { useEffect } from "react";
import server from "./server";


function Wallet({ address, setAddress, balance, setBalance, walletAddress }) {
  async function onChange(evt) {
    if (walletAddress) {
      const {
        data: { balance },
      } = await server.get(`balance/${walletAddress}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  useEffect(() => {
    onChange();
  }, [walletAddress]);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <div>Wallet Address From Private Address</div>
      <label>
        {walletAddress}
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
