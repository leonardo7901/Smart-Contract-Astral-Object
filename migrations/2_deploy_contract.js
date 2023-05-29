const ProposalManager = artifacts.require('ProposalManager');

module.exports = async function (deployer, network, accounts) {
  const fs = require('fs');
  await deployer.deploy(ProposalManager);
  const deployedContract = await ProposalManager.deployed();
  const deployedAddress = deployedContract.address;
  fs.writeFileSync('contractAddress.txt', deployedAddress);
  console.log('Contract address written to contractAddress.txt');
  console.log('Contract Address:', deployedContract.address);
};
