const XCUMock = artifacts.require('XCUWithBalance.sol');
const Proxy = artifacts.require('AdminUpgradeabilityProxyXCU.sol');

const assertRevert = require('./helpers/assertRevert');

// Test that the XCU contract can reclaim XCU it has received.
// Note that the contract is not payable in Eth.
contract('CanReclaimFunds', function ([_, admin, owner, assetProtectionRole, anyone]) {
  const amount = 100;

  beforeEach(async function () {
    // Create contract and token
    const xcu = await XCUMock.new({from: owner});
    const proxy = await Proxy.new(xcu.address, {from: admin});
    const proxiedXCU = await XCUMock.at(proxy.address);
    await proxiedXCU.initialize({from: owner});
    await proxiedXCU.initializeBalance(owner, amount);
    this.token = proxiedXCU;

    // Send token to the contract
    await this.token.transfer(this.token.address, amount, {from: owner});
    const balance = await this.token.balanceOf(owner);
    assert.equal(0, balance.toNumber());
    const contractBalance = await this.token.balanceOf(this.token.address);
    assert.equal(amount, contractBalance);

    // freeze the contract address to mimick the current state on mainnet
    await this.token.setAssetProtectionRole(assetProtectionRole, {from: owner});
    await this.token.freeze(this.token.address, {from: assetProtectionRole});
  });

  it('should not accept Eth', async function () {
    await assertRevert(
      web3.eth.sendTransaction({from: owner, to: this.token.address, value: amount})
    );
  });

  it('should allow owner to reclaim tokens', async function () {
    await this.token.reclaimXCU({from: owner});

    const balance = await this.token.balanceOf(owner);
    assert.equal(amount, balance);
    const contractBalance = await this.token.balanceOf(this.token.address);
    assert.equal(0, contractBalance);
  });

  it('should allow only owner to reclaim tokens', async function () {
    await assertRevert(
      this.token.reclaimXCU({from: anyone})
    );
  });
});
