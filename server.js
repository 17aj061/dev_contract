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
const contract_address1 = "0xc37e77A5542aC74347958a6e27752c0616bD6ce6";

const contract_abi2 = jsonObject2.abi;
const contract_address2 = "0x5b3CA99C0673f79Fbe04eA4F314FC968e4a1256b";


const contract = new web3.eth.Contract(contract_abi1, contract_address1);
const contract2 = new web3.eth.Contract(contract_abi2, contract_address2);
web3.eth.defaultAccount='0x962086B3AcC7B02043aB3b3922280F043423d851';

app.get('/send', function(req, res){
    async function a(){
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
                //nothing to do
            }
        }
        endTime = performance.now(); //計測終了
        //console.log(await contract.methods.getlength().call());
        console.log((endTime - startTime) / 1000);
        res.send(persons);
        //console.log(persons);
    }
    a();
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
