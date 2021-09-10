SolnVerifier =require('../eth-contracts/build/contracts/SolnSquareVerifier.json');
const HDWalletProvider = require('truffle-hdwallet-provider');

const Userinkeby= false

Web3 =require('web3');
config=require('./config.json')
fs =require('fs');

const mnemonic = fs.readFileSync("/home/amr/BlockChain/.secret").toString().trim();
const infuraKey = "c91c1ea44b144661b87f0f0e14e9935d";
if(Userinkeby){
    const provider=new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`)
    web3 = new Web3(provider)
}else{
    web3 = new Web3(new Web3.providers.WebsocketProvider(config.localhost.url.replace('http', 'ws')));
}

verifier = new web3.eth.Contract(SolnVerifier.abi, config.localhost.appAddress);
account_one = ''
web3.eth.getAccounts(async (error, accts) => {

    account_one = accts[0];
    path = '../zokrates/code/square/proof_'
    for (i = 0; i < 10; i++) {
       await verifier.methods.addSolution().send({ from: account_one });
       console.log("add solution no:"+i);
    }
    for (i = 0; i < 10; i++) {
        proof = JSON.parse(fs.readFileSync(path + (i +1).toLocaleString('en-US', {minimumIntegerDigits: 1, useGrouping:false})+ ".json"));
        await verifier.methods.mintNewNFT(i, proof.proof, proof.inputs, account_one, i+1).send({ from: account_one,gas:10000000 });
        console.log("Minted Token ID:"+i+1);
    }
    totalSupply=await verifier.methods.totalSupply().call({ from: account_one});
    console.log("total supply is now: "+totalSupply);
});



 