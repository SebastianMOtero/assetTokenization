import { React, useState } from 'react';
import { ethers } from 'ethers';
import MyToken_abi from '../abi/MyToken.json';
import kycContract_abi from '../abi/KycContract.json';
import myTokenSale_abi from '../abi/MyTokenSale.json';

const Wallet = () => {

    const myTokenContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const kycContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    const myTokenSaleContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

    const [tokenName, setTokenName] = useState('');
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    const [addressToAllow, setAddressToAllow] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [myTokenContract, setMyTokenContract] = useState(null);
    const [kycContract, setKycContract] = useState(null);
    const [myTokenSaleContract, setMyTokenSaleContract] = useState(null);


    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected');
                })
                .catch(error => {
                    setErrorMessage(error.message);
                })
        } else {
            setErrorMessage('Please install MetaMask to use this dApp.');
        }
    }

    const accountChangedHandler = (newAddress) => {
        setDefaultAccount(newAddress);
        updateEthers(newAddress);
    }

    const updateEthers = (newAddress) => {
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        const tempSigner = tempProvider.getSigner();
        const tempMyTokenContract = new ethers.Contract(myTokenContractAddress, MyToken_abi, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setMyTokenContract(tempMyTokenContract);

        const tempkycContract = new ethers.Contract(kycContractAddress, kycContract_abi.abi, tempSigner);
        setKycContract(tempkycContract);

        const tempMyTokenSale = new ethers.Contract(myTokenSaleContractAddress, myTokenSale_abi.abi, tempSigner);
        setMyTokenSaleContract(tempMyTokenSale);

        updateS(tempMyTokenContract, newAddress);
    }

    const updateS = async (tempMyTokenContract, newAddress) => {
        const tempBalance = await tempMyTokenContract.balanceOf(newAddress)
        setBalance(tempBalance.toString())
    }

    const handleInputChange = (e) => {
        setAddressToAllow(e.target.value);
    }

    const handleKycWhitelisting = () => {
        kycContract.setKycCompleted(addressToAllow)
            .then(result => {
                alert("KYC for " + addressToAllow + " is completed. Hash: " + result.hash);
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
    }

    const handleBuyTokens = async () => {
        await myTokenSaleContract.buyTokens(defaultAccount, {
            from: defaultAccount,
            value: 1
        })
    }
    return (
        <div>
            <h2> {`${tokenName} ERC-20 Wallet`} </h2>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <div>
                <h3> Address: {defaultAccount}</h3>
            </div>

            <h2>Kyc Whitelisting</h2>
            Address to allow: <input type="text" name="kycAddress" onChange={handleInputChange} />
            <button type="button" onClick={handleKycWhitelisting}>Add to Whitelist</button>

            <h2>Buy Tokens</h2>
            <p>If you want to buy tokens, send Wei to this address: {myTokenSaleContractAddress}</p>
            <p>You currently have: {balance} Tokens</p>
            <button type="button" onClick={handleBuyTokens}>Buy more tokens</button>
        </div>
    )
}

export default Wallet;