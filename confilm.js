const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));
const performance = require('perf_hooks').performance;
const fetch = require('node-fetch');

const fs = require('fs');
const {soliditySha3} = require('web3-utils');
const jsonObject1 = JSON.parse(fs.readFileSync('./build/contracts/SimpleStorage.json','utf8'));
const jsonObject2 = JSON.parse(fs.readFileSync('./build/contracts/Authentication.json','utf8'));
const jsonObject3 = JSON.parse(fs.readFileSync('./build/contracts/FixStorage.json','utf8'));

const contract_abi1 = jsonObject1.abi;
const contract_address1 = "0x5b950deeD4A9dCdEf9184F3d41f3ac57f85Ad325";

const contract_abi2 = jsonObject2.abi;
const contract_address2 = "0xd39e69A28f87093F43b3F14b7Df5A0EAFEBaa785";

const contract_abi3 = jsonObject3.abi;
const contract_address3 = "0xd50227e108618aEdF30C8DF4D0dC91Db653E0641";

const contract = new web3.eth.Contract(contract_abi1, contract_address1);
const contract2 = new web3.eth.Contract(contract_abi2, contract_address2);
const contract3 = new web3.eth.Contract(contract_abi3, contract_address3);

web3.eth.defaultAccount='0xf71e23a6f9Cc70b71700a2399a564BCfAB0cDfeB';

async function add_person_fix(size){
    let hex = '';
    for(let i = 0; i < size; ++i){
        let random = Math.round(Math.random() * 4);
        //console.log(random);
        console.log(i);
        if(random === 0){
            hex = await contract.methods.set("tom",20).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }else if(random === 1){
            hex = await contract.methods.set("risa",27).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }else if(random === 2){
            hex = await contract.methods.set("alice",28).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }else if(random === 3){
            hex = await contract.methods.set("bob",32).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }else{
            hex = await contract3.methods.set("eve",33).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }
        await send_tx_hash(hex.transactionHash.substr(2));
    }
}

async function add_person(size){
    let hex = '';
    for(let i = 0; i < size; ++i){
        let random = Math.round(Math.random() * 4);
        console.log(i);
        if(random === 0){
            hex = await contract3.methods.set("tom",20).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }else if(random === 1){
            hex = await contract3.methods.set("risa",27).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }else if(random === 2){
            hex = await contract3.methods.set("alice",28).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }else{
            hex = await contract3.methods.set("bob",32).send({from: web3.eth.defaultAccount,gas:3000000}).then();
        }
        await send_tx_hash(hex.transactionHash.substr(2));
    }
}

async function send_tx_hash(hex){
    const hash = await contract2.methods.set_tx(hex).send({from: web3.eth.defaultAccount,gas:3000000}).then();
    fs.appendFileSync('./privatekey', hex + '\n', 'utf-8');
}

async function auth(){
    let key = fs.readFileSync('./privatekey', 'utf-8').split('\n');
    let hash = soliditySha3(key[key.length - 2], key[key.length - 3], key[key.length - 4], key[key.length - 5], key[key.length - 6]);
    const isSuccess = await contract2.methods.auth(hash).call();
    console.log(isSuccess);
}

async function get_person(name){
    let persons = new Array();
    let person;
    let startTime , endTime;
    const arr_length = await contract.methods.getlength().call();
    startTime = performance.now(); //計測開始
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
    endTime = performance.now(); //計測終了
    //console.log(await contract.methods.getlength().call());
    console.log((endTime - startTime) / 1000);
    //console.log(persons);
};

async function get_person_fix(name){
    let persons = new Array();
    let person;
    let startTime , endTime;
    const arr_length = await contract3.methods.get_name_length(name).call();
    startTime = performance.now(); //計測開始
    for(let i = 0; i < arr_length;i++){
        try{
            person = await contract3.methods.get_using_name(i).call()
            persons.push(person);
        }catch(err){
        }
    }
    endTime = performance.now(); //計測終了
    //console.log(await contract.methods.getlength().call());
    console.log((endTime - startTime) / 1000);
    console.log(persons);
};

async function get_person_all(){
    let persons = new Array();
    const arr_length = await contract3.methods.getlength().call();
    for(let i = 0;i<arr_length;++i){
        persons.push(await contract3.methods.get_all(i).call());
    }
    console.log(persons);
}

//add_person(10);
//add_person_fix(800);
//auth(web3.eth.defaultAccount);
//get_person('eve');
//get_person_all();
//get_person_fix('eve');

async function runtime(){
    for(let i = 0;i < 100;i++){
        let start,end;
        start = performance.now();
        const response = await fetch('http://127.0.0.1:10001/send');
        end = performance.now();
        console.log((end - start) / 1000);
    }
}
runtime();

async function runtime_pre(){
    for(let i = 0;i < 100;i++){
        let start,end;
        start = performance.now();
        const response = await fetch('http://127.0.0.1:10001/pre');
        end = performance.now();
        console.log((end - start) / 1000);
    }
}
//runtime_pre();

const send_mes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:10001/send');
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
};

//send_mes();