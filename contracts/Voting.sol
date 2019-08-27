pragma solidity ^0.5.0;

contract VotingContract {
    
    // an event that is called whenever a Candidate is added so the frontend could appropriately display the candidate with the right element id (it is used to vote for the candidate, since it is one of arguments for the function "vote")
    event AddedCandidate(uint candidateID);
    
    address owner; 
    function Voting() public { // constructor
        owner=msg.sender;
    }
    
    struct Voter { // describes a Voter, which has an id and the ID of the candidate they voted for
        bytes32 uid; // bytes32 type are basically strings
        uint candidateIDVote;
        bytes32 date;
    }

    struct Candidate { // describes a Candidate
        bytes32 name;
        bytes32 party;         
        bool doesExist; // to check if this Struct exists
    }

    // These state variables are used keep track of the number of Candidates/Voters and used to as a way to index them     
    uint numCandidates; // declares a state variable - number Of Candidates
    uint numVoters;
    
    // Think of these as a hash table, with the key as a uint and value of the struct Candidate/Voter. These mappings will be used in the majority of our transactions/calls. These mappings will hold all the candidates and Voters respectively
    mapping (uint => Candidate) candidates;
    mapping (uint => Voter) public voters;
    
    function addCandidate(bytes32 name, bytes32 party) public {        
        uint candidateID = numCandidates++; // candidateID is the return variable
        candidates[candidateID] = Candidate(name,party,true); // Create new Candidate Struct with name and saves it to storage.
        emit AddedCandidate(candidateID);
    }

    function vote(bytes32 _userID, uint _candidateID) public returns (bool) {        
        if (candidates[_candidateID].doesExist == true) { // checks if the struct exists for that candidate            
            if(isValidVoter(_userID)) {
                uint position = numVoters++;
                voters[position] = Voter(_userID,_candidateID,"date");
                return true;
            } else {
                return false;
            }           
        }
    }

    function totalVotes(uint _candidateID) public view returns (uint) {
        uint numOfVotes = 0; 
        for (uint i = 0; i < numVoters; i++) { // for each voters
            if (voters[i].candidateIDVote == _candidateID) { // if the voter votes for this specific candidate, we increment the number
                numOfVotes++;
            }
        }
        return numOfVotes; 
    }

    function isValidVoter(bytes32 _uid) private view returns (bool) {
        for (uint i = 0; i < numVoters; i++) {
            if(voters[i].uid == _uid) {
                return false;
            }
        }    
        return true;
    }

    function getNumOfCandidates() public view returns(uint) {
        return numCandidates;
    }

    function getNumOfVoters() public view returns(uint) {
        return numVoters;
    }

    function getCandidate(uint _candidateID) public view returns (uint,bytes32, bytes32) {
        return (_candidateID,candidates[_candidateID].name,candidates[_candidateID].party);
    }

}