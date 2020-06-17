var ERC721MintableComplete = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: accountOne});

            await this.contract.mint(accountOne, 1, {from: accountOne});
            await this.contract.mint(accountOne, 12, {from: accountOne});
            await this.contract.mint(accountOne, 123, {from: accountOne});
            await this.contract.mint(accountOne, 1234, {from: accountOne});
            await this.contract.mint(accountTwo, 12345, {from: accountOne});
        });

        it('should return total supply', async function () { 
            const totalSupply = await this.contract.totalSupply.call();
            assert.equal(5, totalSupply, "Incorrect supply count");
        });

        it('should get token balance', async function () { 
            const balance = await this.contract.balanceOf.call(accountOne, {from: accountOne});
            assert.equal("4", balance, "account balance should be 4");
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/${tokenId}
        it('should return token uri', async function () { 
            const tokenId = 123;
            const tokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/123";
            const toVerifyURI = await contract.tokenURI.call(tokenId);
            assert.equal(tokenURI, toVerifyURI, "Invalid token URI");
        });

        it('should transfer token from one owner to another', async function () { 
            const tokenId = 12;
            await this.contract.transferFrom(accountOne, accountTwo, tokenId, {from: accountOne});
            let toVerifyOwner = await this.contract.ownerOf(tokenId);

            assert.equal(accountTwo, toVerifyOwner, "Ownership should be transferred to second account.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: accountOne});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            const failed = false;
            try {
                await this.contract.mint(accountTwo, 99, { from: accountTwo});
            } catch(error){
                failed = true;
            }
            assert(failed, "Only contract owner shpuld be able to mint tokens");
        })

        it('should return contract owner', async function () { 
            const contractOwner = await this.contract.getOwner.call();
            assert(contractOwner, accountOne, "Incorrect contract owner");
        })

    });
})