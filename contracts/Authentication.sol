// SPDX-License-Identifier: MIT
// データ格納トランザクションを実行するたびにsetコントラクトが呼び出されることが望ましい
pragma solidity >=0.4.0 <0.8.0;

contract Authentication{
    
    //トランザクションを格納するための構造体(txhashとアドレスを紐付ける)
    struct Transaction{
        string transaction;
        address from;
    }
    
    //トランザクションとアドレスを格納している可変長配列
    Transaction[] private transactions;
    
    //tx hashの先頭0xはユーザ側で切り取って格納する(なぜかbytes32形式だとハッシュの結果が変わる)
    function set_tx(string memory _hash) public {
        transactions.push(Transaction(_hash , msg.sender));
    }

    //認証部分
    function auth(bytes32 _hash) public view returns (bool){
        uint tx_count = 0;
        uint finish_count = 5; //いくつのトランザクションを用いるかを指定するカウンタ
        string[5] memory txs; //アドレス適合ハッシュを格納しておくための固定長string配列
        
        //配列を後ろから探索しアドレスが一致していればtxsに格納
        for(uint i = transactions.length - 1; i >= 0; i--){
            //アドレスが一致しているかの確認
            if(keccak256(abi.encodePacked(transactions[i].from)) == keccak256(abi.encodePacked(msg.sender))){
                txs[tx_count] = transactions[i].transaction; //txs配列の長さで得られる位置にtxhashを格納
                tx_count++;
            }
            //txs配列の長さとfinish_countが一致していればループを抜ける
            if(tx_count == finish_count){
                break;
            }
        }
        
        //txs配列の要素すべてとユーザ側から送られてきた_hashが一致していればtrueを返却(でなければfalseを返却)
        return (keccak256(abi.encodePacked(txs[0],txs[1],txs[2],txs[3],txs[4])) == _hash);
    }
}