// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract ProposalManager {

    struct astralData{
        string id;
        int[] position;
        int Dw;
        int[] radioComposition;
        int lambda;
        int[] Ds;
        int[] magnitude;
    }

    struct astralObject{
        string id;
        int[] position;
        string tag;
        int T;
        bool[] composition;
        int mass;
    }

    // Struct to represent a proposal
    struct Proposal {
        address proposer;
        uint dataID;
        astralObject object;
        int voteCount;
        bool isAccepted;
        mapping(address => bool) voters;
    }

    address masterNode;
    
    //Array to store all astral datas
    astralData[] public astralDatas;

    // Array to store all the proposals
    Proposal[] public proposals;
    
    //  Array to store all the winning proposals
    Proposal[] public winnerProposals;

    // Mapping to keep track of authorized accounts
    mapping(address => bool) public authorizedAccounts;
    
    // Constructor to set the deployer's account as authorized by default
    constructor() {
        authorizedAccounts[msg.sender] = true;
        masterNode = msg.sender;
    }
    
    // Modifier to restrict certain functions to authorized accounts only
    modifier onlyAuthorized() {
        require(authorizedAccounts[msg.sender], "Only authorized accounts can perform this action");
        _;
    }

    function addAstralData(string memory id, int[] memory position, int Dw, int[] memory radioComposition, int lambda, int[] memory Ds, int[] memory magnitude) public onlyAuthorized{
        astralData memory newAstralData;
        newAstralData.id = id;
        newAstralData.position = position;
        newAstralData.Dw = Dw;
        newAstralData.radioComposition = radioComposition;
        newAstralData.lambda = lambda;
        newAstralData.Ds = Ds;
        newAstralData.magnitude = magnitude;
        astralDatas.push(newAstralData);

        emit astralDataAdded(newAstralData.id);
    }

    function getAstralDataID(uint index) public view returns (string memory) {
        return astralDatas[index].id;
    }

    function getAstralDataPosition(uint index) public view returns (int[] memory) {
        return astralDatas[index].position;
    }

    function getAstralDataDw(uint index) public view returns (int) {
        return astralDatas[index].Dw;
    }

    function getAstralDataRadioComposition(uint index) public view returns (int[] memory) {
        return astralDatas[index].radioComposition;
    }

    function getAstralDataLambda(uint index) public view returns (int) {
        return astralDatas[index].lambda;
    }

    function getAstralDataDs(uint index) public view returns (int[] memory) {
        return astralDatas[index].Ds;
    }

    function getAstralDataMagnitude(uint index) public view returns (int[] memory) {
        return astralDatas[index].magnitude;
    }

    function getAstralDatasCount() public view returns (uint256) {
        return astralDatas.length;
    }

    function getAstralDatas() public view returns (astralData[] memory) {
        return astralDatas;
    }
    
    // Function to add a new proposal
    function addProposal(uint dataID, string memory id, int[] memory position, string memory tag, int T, bool[] memory composition, int mass) public {
        // Create a new proposal and push it to the proposals array
        Proposal storage newProposal = proposals.push();
        newProposal.proposer = msg.sender;
        newProposal.dataID = dataID; 
        newProposal.object.id = id;
        newProposal.object.position = position;
        newProposal.object.tag = tag;
        newProposal.object.T = T;
        newProposal.object.composition = composition;
        newProposal.object.mass = mass;
        newProposal.voteCount = 0;
        newProposal.isAccepted = false;
        
        // Emit an event indicating the new proposal has been added
        emit ProposalAdded(proposals.length - 1);
    }

    function getProposalsCount() public view returns (uint256) {
        return proposals.length;
    }

    function getProposalProposerID(uint index) public view returns (address) {
        return proposals[index].proposer;
    }

    function getProposalDataID(uint index) public view returns (uint256){
        return proposals[index].dataID;
    }

    function getProposalsVoteCount(uint index) public view returns (int){
        return proposals[index].voteCount;
    }

    function getProposalAccepted(uint index) public view returns(bool){
        return proposals[index].isAccepted;
    }

    function getProposalAlreadyVoted(uint index) public view returns (bool) {
        return proposals[index].voters[msg.sender];
    }
    
    // Function to vote on a proposal
    function vote(uint256 proposalIndex, int voting) public {
        require(proposalIndex < proposals.length, "Invalid proposal index");
        require(!proposals[proposalIndex].voters[msg.sender], "You have already voted for this proposal");
        
        // Increment the vote count for the specified proposal
        proposals[proposalIndex].voteCount += voting;
        
        // Mark the sender as a voter for the specified proposal
        proposals[proposalIndex].voters[msg.sender] = true;
        
        // Emit an event indicating the vote has been cast
        emit VoteCast(proposalIndex, msg.sender);
    }

    function markProposalAsAccepted(uint256 index) public onlyAuthorized {
        require(index < proposals.length, "Invalid proposal index");
        require(!proposals[index].isAccepted, "Proposal is already marked as accepted");
        
        proposals[index].isAccepted = true;
        Proposal storage tmp = winnerProposals.push();
        tmp = proposals[index];

        emit ProposalAccepted(index, proposals[index].proposer);
    }
    
    // Events to communicate changes and actions
    event astralDataAdded(string indexed newAstralDataID);
    event ProposalAdded(uint256 indexed proposalIndex);
    event VoteCast(uint256 indexed proposalIndex, address indexed voter);
    event ProposalAccepted(uint indexed proposalIndex, address indexed proposersAddress);
}
