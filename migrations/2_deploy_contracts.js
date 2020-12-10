const XCU = artifacts.require('CuprumXCU');
const Proxy = artifacts.require('AdminUpgradeabilityProxyXCU');

module.exports = async function(deployer) {
  await deployer;

  await deployer.deploy(XCU);
  const proxy = await deployer.deploy(Proxy, XCU.address);
  const proxiedXCU = await XCU.at(proxy.address);
  await proxy.changeAdmin("0x75E2d5B3Ed2A8854B416edf16C4b9Aa901dD4ea5");
  await proxiedXCU.initialize();
};
