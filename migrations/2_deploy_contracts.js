const HelloWorld = artifacts.require("HelloWorld");

module.exports = function(deployer) {
  deployer.deploy(HelloWorld, "Hello, Blockchain!", { gas: 5000000 });
};
