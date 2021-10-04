const BackupHashStorage = artifacts.require("./BackupHashStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(BackupHashStorage);
};
