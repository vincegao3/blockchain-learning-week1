import { keccak256 } from "ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, privateKey, walletAddress }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function createSignatureMessage(message, privateKey) {
    const hashedMessage = keccak256(utf8ToBytes(message));
    const signature = await secp.secp256k1.sign(hashedMessage, privateKey, { recovery: true });
    return signature;
  }

  async function transfer(evt) {
    evt.preventDefault();
    try {
      const signature = await createSignatureMessage("Amount:" + sendAmount, privateKey);
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: walletAddress,
        amount: parseInt(sendAmount),
        signature: signature.toCompactHex(),
        recoverBit: signature.recovery,
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
