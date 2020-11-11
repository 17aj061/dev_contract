const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));

const fs = require('fs');
const { keccak256 } = require('web3-utils');
const jsonObject = JSON.parse(fs.readFileSync('./build/contracts/SimpleStorage.json','utf8'));

const contract_abi = jsonObject.abi;
const contract_address = "0x036D45821A7d1B5A365E8E0dea49a58f3d465b04";

const contract = new web3.eth.Contract(contract_abi, contract_address);
web3.eth.defaultAccount='0x4a393CD5175000947Fe11226A1333d63837cC863';

async function add_person(size){
    for(let i = 0; i < size; i++){
        let random = Math.round(Math.random() * 4);
        switch(random){
            case 0:
                await contract.methods.set("tom",20).send({from: web3.eth.defaultAccount,gas:3000000}).then();
            case 1:
                await contract.methods.set("risa",27).send({from: web3.eth.defaultAccount,gas:3000000}).then();
            case 2:
                await contract.methods.set("alice",28).send({from: web3.eth.defaultAccount,gas:3000000}).then();
            case 3:
                await contract.methods.set("bob",32).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }
    }
    get_person_all();
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
        //console.log(await contract.methods.getlength().call());
    }
    console.log(persons);
}

async function authentication(){
    
}

//fucntion save_Tx()

//add_person(2);
//get_person('alice');
get_person_all();