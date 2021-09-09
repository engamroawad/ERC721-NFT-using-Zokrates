// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
const fs = require('fs');
module.exports = function (deployer) {
  deployer.deploy(SquareVerifier);
  deployer.deploy(SolnSquareVerifier).then(() => {
    let config = {
      localhost: {
        url: 'http://localhost:8545',
        appAddress: SolnSquareVerifier.address
      }
    }
    fs.writeFileSync(__dirname + '/../../app/config.json', JSON.stringify(config, null, '\t'), 'utf-8');
  });
};
