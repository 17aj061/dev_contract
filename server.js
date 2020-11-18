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

const contract_abi1 = jsonObject1.abi;
const contract_address1 = "0xD6D37920D099b7d45491c54eb262e411e3E5e438";

const contract_abi2 = jsonObject2.abi;
const contract_address2 = "0x742168378Bf5242B7e1a54B0B929286725F3D2c1";


const contract = new web3.eth.Contract(contract_abi1, contract_address1);
const contract2 = new web3.eth.Contract(contract_abi2, contract_address2);
web3.eth.defaultAccount='0xd39770a02f707472f495167ee8F3C8E3a6f728E5';

app.get('/send', function(req, res){
    const getter = async () => {
        let persons = new Array();
        let person;
        let startTime , endTime;
        const arr_length = await contract.methods.getlength().call();
        startTime = performance.now(); //計測開始
        for(let i = 0; i < arr_length;i++){
            try{
                person = await contract.methods.get(i, 'alice').call()
                if(person[0] === 'end_of_array'){
                    break;
                }else{
                    persons.push(person);
                }
                i = person[2];
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

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


app.listen(10000, function(){
  console.log("listen at localhost:10000");
});
