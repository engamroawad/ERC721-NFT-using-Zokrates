var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
            await this.contract.mint(account_one,1,{from: account_one});
            await this.contract.mint(account_one,2,{from: account_one});
            await this.contract.mint(account_two,3,{from: account_one});
            await this.contract.mint(account_two,4,{from: account_one});
            // TODO: mint multiple tokens
        })

        it('should return total supply', async function () { 
            totalSupply=await this.contract.totalSupply();
            assert.equal(totalSupply, 4, "Incorrect supply number");
        })

        it('should get token balance', async function () { 
            tokenBalance= await this.contract.balanceOf(account_one);
            assert.equal(tokenBalance, 2, "Incorrect balance");
            tokenBalance= await this.contract.balanceOf(account_two);
            assert.equal(tokenBalance, 2, "Incorrect balance");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            uri= await this.contract.tokenURI(1);
            assert.equal(uri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Incorrect token uri");
            uri= await this.contract.tokenURI(2);
            assert.equal(uri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", "Incorrect token uri");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one,account_two,1);
            newOnwer=await this.contract.ownerOf(1);
            assert.equal(newOnwer, account_two, "transfer from not working");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            failed=false;
            try{
                 await this.contract.mint(account_one,1,{from: account_two});
            }
             catch(e){
                failed=true;
            }
            assert.equal(failed, true, "failed dd"); 
        })

        it('should return contract owner', async function () { 
            owner=await this.contract.getOwner();
            assert.equal(owner, account_one, "incorrect onwner");
        })

    });
})