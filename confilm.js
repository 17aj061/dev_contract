const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));

const fs = require('fs');
const {soliditySha3} = require('web3-utils');
const jsonObject1 = JSON.parse(fs.readFileSync('./build/contracts/SimpleStorage.json','utf8'));
const jsonObject2 = JSON.parse(fs.readFileSync('./build/contracts/Authentication.json','utf8'));

const contract_abi1 = jsonObject1.abi;
const contract_address1 = "0x388D9370d1476ECe072D0EFa07ab048fE7075627";

const contract_abi2 = jsonObject2.abi;
const contract_address2 = "0x8dd9E87CE7B0af4C2F03101D22cFa1175f3e862B";


const contract = new web3.eth.Contract(contract_abi1, contract_address1);
const contract2 = new web3.eth.Contract(contract_abi2, contract_address2);
web3.eth.defaultAccount='0x4a393CD5175000947Fe11226A1333d63837cC863';

async function add_person(size){
    let hex = '';
    for(let i = 0; i < size; i++){
        let random = Math.round(Math.random() * 4);
        switch(random){
            case 0:
                hex = await contract.methods.set("tom",20).send({from: web3.eth.defaultAccount,gas:3000000}).then();
            case 1:
                hex = await contract.methods.set("risa",27).send({from: web3.eth.defaultAccount,gas:3000000}).then();
            case 2:
                hex = await contract.methods.set("alice",28).send({from: web3.eth.defaultAccount,gas:3000000}).then();
            case 3:
                hex = await contract.methods.set("bob",32).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }
        await send_tx_hash(hex.transactionHash.substr(2));
    }
    //get_person_all();
}

async function send_tx_hash(hex){
    const hash = await contract2.methods.set_tx(hex,web3.eth.defaultAccount).send({from: web3.eth.defaultAccount,gas:3000000}).then();
    fs.appendFileSync('./privatekey', hex + '\n', 'utf-8');
}

async function auth(address){
    let contents = fs.readFileSync('./privatekey', 'utf-8').split('\n');
    let hash = soliditySha3(contents[contents.length - 2], contents[contents.length - 3], contents[contents.length - 4], contents[contents.length - 5], contents[contents.length - 6]);
    const isSuccess = await contract2.methods.auth(hash, address).call();
    console.log(isSuccess);
}

async function get_person(name){
    let persons = new Array();
    let person;
    const arr_length = await contract.methods.getlength().call();
    for(let i = 0; i < arr_length;i++){
        try{
            person = await contract.methods.get(i, name).call()
            if(person[0] === 'end_of_array'){
                break;
            }else{
                persons.push(person);
            }
            i = person[2];
        }catch(err){
            //nothing to do
            //when I make code in this space
            //error is occurrence
        }
    }
    console.log(persons);
};

async function get_person_all(){
    let persons = new Array();
    const arr_length = await contract.methods.getlength().call();
    for(let i = 0;i<arr_length;++i){
        persons.push(await contract.methods.get_all(i).call());
    }
    console.log(persons);
}

//fucntion save_Tx()

//add_person(6);
auth(web3.eth.defaultAccount);
//get_person('alice');
//get_person_all();