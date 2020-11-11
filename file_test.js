const fs = require('fs');
const hash = 'b1c83adf223b8abbeca2506efc5a875cd0d0810b2aa9fc1df8823360a1b537df' + '\n';
fs.appendFileSync('./privatekey', hash, 'utf-8');

let contents = fs.readFileSync('./privatekey', 'utf-8');
let lines = contents.split('\n')
console.log(lines.length-1);
for(let i = 1;i <= 10;i++){
    console.log(lines[lines.length - i]);
}