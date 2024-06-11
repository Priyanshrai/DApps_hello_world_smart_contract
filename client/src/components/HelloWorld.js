import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import HelloWorldContract from '../contracts/HelloWorld.json';
import './HelloWorld.css'; // Import the CSS file

const HelloWorld = () => {
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access if needed
        } catch (error) {
          console.error("User denied account access");
        }
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = HelloWorldContract.networks[networkId];

        if (deployedNetwork) {
          const contract = new web3Instance.eth.Contract(
            HelloWorldContract.abi,
            deployedNetwork.address
          );
          setWeb3(web3Instance);
          setContract(contract);
          setAccounts(accounts);
          const message = await contract.methods.getMessage().call();
          setMessage(message);
        } else {
          console.error('Contract not deployed on the current network');
        }
      } else {
        console.error('Ethereum provider not found');
      }
    };

    initializeWeb3();
  }, []);

  const updateMessage = async () => {
    if (contract && accounts.length > 0) {
      console.log("Updating message to: ", newMessage);
      try {
        await contract.methods.setMessage(newMessage).send({
          from: accounts[0],
          gas: 300000, // Set the gas limit
          gasPrice: web3.utils.toWei('20', 'gwei') // Use legacy gas pricing
        });
        const message = await contract.methods.getMessage().call();
        setMessage(message);
        setNewMessage('');
      } catch (error) {
        console.error("Error updating message: ", error);
      }
    } else {
      console.error("Contract or accounts not available");
    }
  };

  return (
    <div className="container">
      <h1>Hello Blockchain</h1>
      <p>Welcome to the world of decentralized applications!</p>
      <p>Current message: <span className="message">{message}</span></p>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Enter a new message"
      />
      <button onClick={updateMessage}>Update Message</button>
      <p className="footer-text">Interact with the Ethereum blockchain in real-time. Change the message and see the magic happen!</p>
    </div>
  );
};

export default HelloWorld;
