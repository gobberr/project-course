var Voting = artifacts.require("./VotingContract.sol")

module.exports = function(deployer) {
  deployer.deploy(Voting)
}
