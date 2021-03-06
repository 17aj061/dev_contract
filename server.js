var createError = require('http-errors');
var express = require('express');
var path = require('path');

var app = express();

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:22000'));
const performance = require('perf_hooks').performance;

const fs = require('fs');
const {soliditySha3} = require('web3-utils');
const jsonObject1 = JSON.parse(fs.readFileSync('./build/contracts/SimpleStorage.json','utf8'));
const jsonObject2 = JSON.parse(fs.readFileSync('./build/contracts/Authentication.json','utf8'));
const jsonObject3 = JSON.parse(fs.readFileSync('./build/contracts/FixStorage.json','utf8'));

const contract_abi1 = jsonObject1.abi;
const contract_address1 = "0xd30E0b851649cF232ad353505b4ED625D31d949A";

const contract_abi2 = jsonObject2.abi;
const contract_address2 = "0x398766a57AF63fAAca7d709F584A42dF03d16e0d";

const contract_abi3 = jsonObject3.abi;
const contract_address3 = "0x68a8f98181a5129ec833A2773531c0816a7Af771";

const contract = new web3.eth.Contract(contract_abi1, contract_address1);
const contract2 = new web3.eth.Contract(contract_abi2, contract_address2);
const contract3 = new web3.eth.Contract(contract_abi3, contract_address3);
web3.eth.defaultAccount='0xe49a2b3ddfd9174aed0a4b2767e4e3d444d5d4c8';

app.get('/send', function(req, res){
    const getter = async () => {
      let persons = new Array();
      let person;
      let name = 'eve';
      let startTime , endTime;
      const arr_length = await contract3.methods.get_name_length(name).call();
      startTime = performance.now(); //計測開始
      for(let i = 0; i < arr_length;i++){
          try{
              person = await contract3.methods.get_using_name(i, name).call()
              persons.push(person);
          }catch(err){
          }
      }
      endTime = performance.now(); //計測終了
      console.log((endTime - startTime) / 1000);
      res.send(persons);
    }
    getter();
    console.log('===============================');
});

app.get('/pre', function(req, res){
  const getter = async () => {
    let persons = new Array();
    let person;
    let name = 'eve';
    let startTime , endTime;
    const arr_length = await contract3.methods.getlength().call();
    startTime = performance.now(); //計測開始
    for(let i = 0; i < arr_length;i++){
        try{
            person = await contract3.methods.get(i, name).call()
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
    res.send(persons);
  }
  getter();
  console.log('===============================');
});

app.get('/set', async function(req,res){
  let hex = '';
  let startTime , endTime;
  startTime = performance.now();
  hex = await contract3.methods.set("alice",28).send({from: web3.eth.defaultAccount,gas:3000000}).then();
  endTime = performance.now();
  console.log((endTime - startTime) / 1000);
  res.send(hex.transactionHash.substr(2));
  //console.log('===============================');
})

/*
app.use(function(req, res, next) {
  next(createError(404));
});*/

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


app.listen(10001, function(){
  console.log("listen at localhost:10001");
});
