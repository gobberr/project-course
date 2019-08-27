# Project Course
Smart Contract on Ethereum. See *report.pdf* for more details about scenario.

# Instruction
### Prerequisites
* nodejs and npm
* Ganache-cli
```
npm install -g ganache-cli 
```
* Truffle
```
npm install -g truffle
```

### Installation depencencies
```
npm install
```

### Running
Start Ganache blockchain on port 7545
```
ganache-cli -p 7545
```
* Note: save the node's private key (that are necessary for the nexts steps) 

Compile Smart Contract using Truffle framework 
```
truffle compile
```

Deploy contract on Ganache blockchain
```
truffle migrate --network development
```

Launch frontend application on port 8000
```
npm run dev
```

### Authentication
* Add Metamask Chrome extension (https://www.metamask.io)
* Create an account
* Import the Ganache blockchain node using private key 
    * Note: node private key are provided by ganache-cli logs on terminal
    * Note: add new rpc network at localhost:7545. In this way, Metamask can connect to Ganache blockchain
* Then you can send transaction and interact with the contract 

### Bugs report
For more informations or bugs report, write to me at rupert.gobber@studenti.unitn.it