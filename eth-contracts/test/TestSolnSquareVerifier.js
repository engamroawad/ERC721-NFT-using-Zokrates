// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
const fs = require('fs');
const truffleAssert = require('truffle-assertions');

// Test verification with correct proof
// - use the contents from proof.json generated from zokrates steps
contract('TestSquareVerifierSlon', accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    describe('test soln verifier', function () {
        beforeEach(async function () {
            this.contract = await SolnSquareVerifier.new({ from: account_one });
        })

        it('should submit proof and mint token', async function () { 
            // Test verification with incorrect proof
            t=await this.contract.addSolution({from: account_one });

            truffleAssert.eventEmitted(t, 'solutionAdded', (ev) => {
                return ev.index == 0 ;
            });

            proof = JSON.parse(fs.readFileSync("/home/amr/BlockChain/Blockchain-Capstone/zokrates/code/square/proof_1.json"));
             await this.contract.mintNewNFT(0,proof.proof ,proof.inputs,account_two,1,{from: account_one });

             totalSupply=await this.contract.totalSupply();
             assert.equal(totalSupply, 1, "Incorrect supply number");


             t=await this.contract.addSolution({from: account_one });

             truffleAssert.eventEmitted(t, 'solutionAdded', (ev) => {
                 return ev.index == 1 ;
             });
 
             proof = JSON.parse(fs.readFileSync("/home/amr/BlockChain/Blockchain-Capstone/zokrates/code/square/proof_2.json"));
              await this.contract.mintNewNFT(1,proof.proof ,proof.inputs,account_two,2,{from: account_one });
 
              totalSupply=await this.contract.totalSupply();
              assert.equal(totalSupply, 2, "Incorrect supply number");
        });

       
    })

});
