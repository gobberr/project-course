import "../css/style.css"

import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

// get build artifacts from compiled smart contract and create the truffle contract
import votingArtifacts from "../../build/contracts/VotingContract.json"
var VotingContract = contract(votingArtifacts)

window.App = { // called when web3 is set up
  
  start: function() { // setting up contract providers and transaction defaults for all contract instances   
    VotingContract.setProvider(window.web3.currentProvider) 
    VotingContract.defaults({from: window.web3.eth.accounts[0]}) // account selected in metamask   
    
    VotingContract.deployed().then(function(instance) { // creates an VotingContract instance that represents default address managed by VotingContract

      instance.getNumOfCandidates().then(function(numOfCandidates){ //set up environment  
        console.log("numero di candidati: " + numOfCandidates)    
        if (numOfCandidates == 0){ // adds candidates to Contract if there aren't any
          console.log("Non ci sono candidati nella blockchain")
        }
        else { // if candidates were already added to the contract we loop through them and display them
          console.log("Ci sono " + numOfCandidates + " candidati nella blockchain")
          for (var i = 0; i < numOfCandidates; i++ ){
            // gets candidates and displays them
            instance.getCandidate(i).then(function(data){
              $("#candidate-box").append(`<input class="form-check-input" name="candidate" type="radio" id=${data[0]}><label class="form-check-label" for=${data[0]}>${window.web3.toAscii(data[1])}</label><br>`)
            })
          }
        }
        window.numOfCandidates = numOfCandidates 
      })
    }).catch(function(err){ console.error("ERROR! " + err.message) })
  },


  vote: function() {
    //var uid = $("#id-input").val() //getting user inputted id
    var uid = window.web3.eth.accounts[0]
    console.log("address = " + uid)    
    if ($("#candidate-box :radio:checked").length = 1) { 
      var candidateID = $("#candidate-box :radio:checked").id // if both are checked, choose the first one
    } else {      
      $("#msg").html("<p>Select the candidate you want to vote</p>") // print message if user didn't vote for candidate
      return
    }        
    VotingContract.deployed().then(function(instance){ // call to smart contract function
      instance.vote(uid, parseInt(candidateID))
      .then(function(result){        
        $("#msg").html("<p>Vote sended</p>")
      })
    }).catch(function(err){ console.error("ERROR! " + err.message) })
  },


  findNumOfVotes: function() { 
    VotingContract.deployed().then(function(instance){
      // this is where we will add the candidate vote Info before replacing whatever is in #vote-box
      var box = $("<section></section>")      
      for (var i = 0; i < window.numOfCandidates; i++){ // loop through candidates and display their votes        
        
        var candidatePromise = instance.getCandidate(i) // calls two smart contract functions
        var votesPromise = instance.totalVotes(i)
        Promise.all([candidatePromise,votesPromise]).then(function(data){ // resolves Promises by adding them to the variable box
          box.append(`<p>${window.web3.toAscii(data[0][1])}: ${data[1]}</p>`)
        }).catch(function(err){ console.error("ERROR! " + err.message) })
      }
      $("#vote-box").html(box)
    })
  },


  addNewCandidate: function() { 
    VotingContract.deployed().then(function(instance){
      console.log("new candidate")
      var candidateName = $("#id-input").val() //getting user inputted id
      if (candidateName == "") {
        $("#msg-candidate").html("<p>Insert the candidate name</p>")
        return
      } else {
        console.log("name: " + candidateName)
        instance.addCandidate(candidateName,"").then(function(result){
          $("#candidate-box").append(`<input class='form-check-input' type='radio' name='candidate' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>${candidateName}</label><br>`)
        })
      }
    })
  }
}


window.addEventListener("load", function() {  // When the page loads, we create a web3 instance and set a provider. We then set up the app
  if (typeof web3 !== "undefined") {
    //console.log(web3)
    // If there is a web3 instance(in Mist/Metamask), then we use its provider to create our web3object
    window.web3 = new Web3(web3.currentProvider)
  } else {
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    // window.web3 = new Web3(new Web3.providers.HttpProvider("http://40.78.5.195:9545")) // if blockchain is running on remote server
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))
  }
  window.App.start() // initializing the App
})