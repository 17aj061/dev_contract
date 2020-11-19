var createError = require('http-errors');
var express = require('express');
var path = require('path');

var app = express();

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));
const performance = require('perf_hooks').performance;

const fs = require('fs');
const {soliditySha3} = require('web3-utils');
const jsonObject1 = JSON.parse(fs.readFileSync('./build/contracts/SimpleStorage.json','utf8'));
const jsonObject2 = JSON.parse(fs.readFileSync('./build/contracts/Authentication.json','utf8'));
const jsonObject3 = JSON.parse(fs.readFileSync('./build/contracts/FixStorage.json','utf8'));

const contract_abi1 = jsonObject1.abi;
const contract_address1 = "0x1541FF966F07Ffbf922ab261D8A3Dea788cd90F1";

const contract_abi2 = jsonObject2.abi;
const contract_address2 = "0xf365Da42c778D3b1A45d9200865e280779Ea6C1B";

const contract_abi3 = jsonObject3.abi;
const contract_address3 = "0x34982ED2dc1490d982B200aE0F386B7745ea2792";

const contract = new web3.eth.Contract(contract_abi1, contract_address1);
const contract2 = new web3.eth.Contract(contract_abi2, contract_address2);
const contract3 = new web3.eth.Contract(contract_abi3, contract_address3);
web3.eth.defaultAccount='0xf71e23a6f9Cc70b71700a2399a564BCfAB0cDfeB';

app.get('/send', function(req, res){
    const getter = async () => {
      let persons = new Array();
      let person;
      let name = 'alice';
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
});

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
