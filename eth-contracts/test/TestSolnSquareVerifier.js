var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    let proof = require('./proof');

    describe('test contract SolnSquareVerifier', function () {
        beforeEach(async function () {
            this.contract = await SolnSquareVerifier.new("Bitland", "BTL", { from: account_one });
        })

        it('Test if a new solution can be added for contract', async function () {
            const { proof: { a, b, c }, inputs: input } = proof;
            let result = await this.contract.addSolution(a, b, c, input, {from: account_two});

            assert.equal(result.logs.length, 1, "No events were triggered.");
        });

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract', async function () {
            const { proof: { a, b, c }, inputs: input } = proof;
            let totalSupply = await this.contract.totalSupply.call();
            //console.log(`variables -  ${a}, ${b}, ${c}, ${input}`)
            await this.contract.verifiedMint(account_two, 5, a, b, c, input, {from: account_one});
            let newTotalSupply = (await this.contract.totalSupply.call()).toNumber();

            assert.equal(totalSupply + 1, newTotalSupply, "Invalid proof result");
        })

    });
})