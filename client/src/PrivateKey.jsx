import {secp256k1} from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils";

const PrivateKey = ({privateKey, setPrivateKey, setWalletAddress })=>{
    return (
        <div>
            <h1>Private Key</h1>
            <input type="text" placeholder="Enter your private key"
                value={privateKey}
                onChange={evt=>{
                    setPrivateKey(evt.target.value)
                    const privateKey = evt.target.value;
                    setPrivateKey(privateKey);
                    const publicKey = secp256k1.getPublicKey(privateKey);
                    setWalletAddress(toHex(publicKey))
                }}
            ></input>
        </div>
    )
}

export default PrivateKey;
