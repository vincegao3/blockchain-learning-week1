const express = require("express");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const cors = require("cors");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0235c8e4cc00560e90ce371afae6289cc269da5c31245a6854daff3403a40799e2": 100, // Private Key: cebb3403af94f8f6341db62aa309f328d4781bec957cbfe51a1a67f560567965
  "028de9cdba68614d28122c964f95c97f003566ca36bf2f85354e4d34231a6cbd70": 50, // Private Key: baed2eb912a7d7e17aaf5615624b6659514ed492aea2266a4491ce185bec593d
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const {recipient, amount, signature, recoverBit } = req.body;

  const recoveredSignature = secp256k1.Signature.fromCompact(signature);
  recoveredSignature.recovery = recoverBit;
  const hashedMessage = keccak256(utf8ToBytes("Amount:" + amount));
  const sender = recoveredSignature.recoverPublicKey(hashedMessage).toHex();

  if(!sender){
    res.status(400).send({ message: "Invalid signature!" });
  }

  if(sender === recipient){
    res.status(400).send({ message: "Cannot send to yourself!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);
  
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
