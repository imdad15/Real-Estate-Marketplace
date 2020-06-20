var Verifier = artifacts.require('Verifier');
    
// Test verification with incorrect proof
contract('Verifier', accounts => {

    const account_one = accounts[0];
    let proof = require('./proof');

    describe('test verifier - zokrates', function () {
        beforeEach(async function () {
            this.contract = await Verifier.new({ from: account_one });
        })

        it('Test verification with correct proof', async function () {
            const { proof: { a, b, c }, inputs: inputs } = proof;
            const isVerified = await this.contract.verifyTx.call(a, b, c, inputs, {from: account_one});

            assert.equal(true, isVerified, "Invalid proof result");
        })

        it('Test verification with incorrect proof', async function () {
            const { proof: { a, b, c } } = proof;
            const isVerified = await this.contract.verifyTx.call(a, b, c, [99,90], {from: account_one});

            assert.equal(false, isVerified, "Invalid proof result");
        })

    });
})

