const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));

const fs = require('fs');
const {soliditySha3} = require('web3-utils');
const jsonObject = JSON.parse(fs.readFileSync('./build/contracts/Authentication.json','utf8'));

const contract_abi = jsonObject.abi;
const contract_address = '0x8dd9E87CE7B0af4C2F03101D22cFa1175f3e862B';

const contract = new web3.eth.Contract(contract_abi, contract_address);
web3.eth.defaultAccount='0x4a393CD5175000947Fe11226A1333d63837cC863';

async function set_tx(){
    const hex = await contract.methods.set_tx('b1c83adf223b8abbeca2506efc5a875cd0d0810b2aa9fc1df8823360a1b537df',web3.eth.defaultAccount).send({from: web3.eth.defaultAccount,gas:3000000}).then();
    console.log(hex.transactionHash.substr(2));
}

const hash = 'b1c83adf223b8abbeca2506efc5a875cd0d0810b2aa9fc1df8823360a1b537df';
const privatekey = fs.appendFileSync('./privatekey', hash, 'utf-8');
console.log(privatekey);

async function auth(){
    const auth = soliditySha3(hash,hash,hash,hash,hash);
    const bool = await contract.methods.auth(auth, web3.eth.defaultAccount).call();
    console.log(bool);
}

//auth();