// truffle exec ./getImplementationAddress.js --network mainnet

module.exports = function() {
  web3.eth.getStorageAt(
    // contract address
    "0x23fa450648e23b657ae40b42d789cf6712ac2732",
    // implementation slot
    "0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3",
    function (err, resp) {
      console.log(err, resp)
    }
  );
};
