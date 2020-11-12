const fs = require('fs');
/*
const hash = 'b1c83adf223b8abbeca2506efc5a875cd0d0810b2aa9fc1df8823360a1b537df' + '\n';
fs.appendFileSync('./privatekey', hash, 'utf-8');
*/

let contents = fs.readFileSync('./privatekey', 'utf-8').split('\n');
for(let i = 1;i <= 5;i++){
    console.log(contents[contents.length - i - 1]);
}