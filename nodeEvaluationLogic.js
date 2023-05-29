const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const gasLimit = 500000;

const fs = require('fs');
const abiFile = JSON.parse(fs.readFileSync('./build/contracts/ProposalManager.json'));
const contractABI = abiFile.abi;

const contractAddressFile = fs.readFileSync('./contractAddress.txt', 'utf-8');
const contractAddress = contractAddressFile.trim();
console.log('contractAddress:', contractAddress);

// Connect to the Ethereum network using Infura
const web3 = new Web3('HTTP://127.0.0.1:8545');

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);




const earthMass = BigNumber('5.9722e24');
const solMass = BigNumber('1.98847e30');

// Function to generate a random number within a specified range
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}

function getRandomBigNumber(min, max) {
  // Convert the min and max values to BigNumber objects
  const minBN = new BigNumber(min);
  const maxBN = new BigNumber(max);

  // Generate a random value between 0 and 1 using the BigNumber library
  const randomValue = BigNumber.random();

  // Calculate the range by subtracting min from max
  const range = maxBN.minus(minBN);

  // Scale the random value to fit within the range
  const scaledValue = randomValue.times(range);

  // Add the scaled value to the min value to get the randomized value
  const randomizedValue = scaledValue.plus(minBN);

  // Return the randomized value as a string
  return randomizedValue.toString();
}

function getRandomID(){
  timestamp = Date.now().toString(); // Get current timestamp as string
  random = Math.random().toString().substring(2, 8); // Get random number as string
  newID = `${timestamp}-${random}`;
  return newID;
}

//  Function to set the reference analysis values
function setReferenceValues(){
  refDw = BigNumber( getRandomBigNumber(BigNumber('3.3e26'), BigNumber('3.9e26')) );
  refT = +getRandomNumber(0, 0.15).toFixed(4);
  refComposition = [
    +getRandomNumber(0, 0.15).toFixed(4),
    +getRandomNumber(0, 0.15).toFixed(4),
    +getRandomNumber(0, 0.15).toFixed(4),
  ];
  a = refComposition[0]+refComposition[1];
  refDspect = +getRandomNumber(0, 0.15).toFixed(4);
  refDmagnitude = Math.floor(getRandomNumber(2, 5));
  //refTreshold = 40;
  refTreshold = +getRandomNumber(20, 100).toFixed(2);
  console.log('Reference values --> ', 'Dw: ', +refDw.toFixed(0).toString(), 'W', '  T: ', +(refT*100).toFixed(2), '%', '  Composition: ', refComposition, '* 100 %', '  Ds: ', +(refDspect*100).toFixed(2), '%', '  Treshold: ',  refTreshold);
}

// Function to extract Proposals array
async function extractProposals() {
  try {
    proposalsCount = await contract.methods.getProposalsCount().call();
    extractedProposals = [];
    
    for (let i = 0; i < proposalsCount; i++) {
      proposal = {
        id: i,    //  Index of the proposal in the proposals array
        astralDataID: await contract.methods.getProposalDataID(i).call(),   // ID of the astral data associated to the proposal
        isAccepted: await contract.methods.getProposalAccepted(i).call(),
      };
      extractedProposals.push(proposal);
      if(i > 0 && proposal && extractedProposals[i] && extractedProposals[i-1] && proposal.id == extractedProposals[i-1].id){
        extractedProposals.pop();
        console.error('Proposal already extracted: ', extractedProposals[i]);
      }
    }
    console.log('Proposals extracted:', extractedProposals);
    extractAstralDatas(extractedProposals);

  } catch (error) {
    console.error('Error extracting proposals:', error);
  }
}

// Function to extract the astral data from a random proposal
async function extractAstralDatas(extractedProposals) {
  try {
    usedDatas = [];
    if (extractedProposals) {
      i = Math.floor(getRandomNumber(0, extractedProposals.length));
      publicAccounts = await web3.eth.getAccounts();
      publicNodeSender = publicAccounts[2];
      const alreadyVoted = await contract.methods.getProposalAlreadyVoted(i).call({from: publicNodeSender, gas: gasLimit});

      if(i && i < extractedProposals.length && alreadyVoted == false){
        astralData = {
          proposalID: extractedProposals[i].id,   //  see proposalID
          index: i,   // index of the astral data in the astral data array
          id: await contract.methods.getAstralDataID(i).call(),
          position: await contract.methods.getAstralDataPosition(i).call(),
          Dw: await contract.methods.getAstralDataDw(i).call(),
          composition:  await contract.methods.getAstralDataRadioComposition(i).call(),
          lambda: await contract.methods.getAstralDataLambda(i).call(),
          Ds: await contract.methods.getAstralDataDs(i).call(),
          magnitude: await contract.methods.getAstralDataMagnitude(i).call(),
        };

        usedDatas.push(astralData.index);
        if(i > 0 && usedDatas[i] && usedDatas[i-1] && usedDatas[i] == usedDatas[i-1]){
          extractedAstralDatas.pop();
          console.error('AstralData already extracted: ', extractedAstralDatas[i]);
        }
        if(astralData){
          console.log('AstralData extracted:', astralData);
          processDatas(astralData)
        }
      }
      else{
        console.error('AstralData not extracted: non-existent or associated proposal already voted')
      }
    }  
  } catch (error) {
    console.error('Error extracting astralDatas:', error);
  }
}

//  Function to process data
function processDatas(astralData) {
  try{
    if (astralData) {
      const wienConstant = BigNumber('2.898e-3');
      const hydrogenRadioWaveLenght = 21;
      const heliumRadioWavelenght = 286;
      const siliciumRadioWavelenght = 100;
  
      position = astralData.position;

      mass = earthMass.multipliedBy(BigNumber(astralData.Dw)).dividedBy(refDw);

      if (
        astralData.composition[0] >=
          hydrogenRadioWaveLenght -
            hydrogenRadioWaveLenght * refComposition[0] &&
        astralData.composition[0] <=
          hydrogenRadioWaveLenght +
            hydrogenRadioWaveLenght * refComposition[0]
      ) {
        H = true;
      } else {
        H = false;
      }
      if (
        astralData.composition[1] >=
          heliumRadioWavelenght -
            heliumRadioWavelenght * refComposition[1] &&
        astralData.composition[1] <=
          heliumRadioWavelenght +
            heliumRadioWavelenght * refComposition[1]
      ) {
        He = true;
      } else {
        He = false;
      }
      if (
        astralData.composition[2] >=
          siliciumRadioWavelenght -
            siliciumRadioWavelenght * refComposition[2] &&
        astralData.composition[2] <=
          siliciumRadioWavelenght +
            siliciumRadioWavelenght * refComposition[2]
      ) {
        Si = true;
      } else {
        Si = false;
      }

      T = +(wienConstant.dividedBy(BigNumber(astralData.lambda).dividedBy('1e7'))).toFixed(0);

      if (astralData.Ds && astralData.Ds[0] != -1 && astralData.Ds[1]!= -1) {
        minDs = astralData.Ds[0];
        maxDs = astralData.Ds[1];
      }
      else{
        minDs = -1;
        maxDs = -1;
      }
  
      if (astralData.magnitude && astralData.magnitude[0]!= -1 && astralData.magnitude[1] != -1) {
        magnitude1 = Math.log10(Math.abs(astralData.magnitude[0]));
        magnitude2 = Math.log10(Math.abs(astralData.magnitude[1]));
        difference = Math.abs(magnitude2 - magnitude1);
      }
      else{
        difference = -1;
      }

      processedData = {
        id: astralData.proposalID,
        position: position,
        mass: mass,
        composition: [H, He, Si],
        T: T,
        Ds: [minDs, maxDs],
        difference: difference,
      }
      console.log('Data processed:', processedData);
      analysisDatas(processedData);
    }
    
  }catch(error){
    console.error('Error processing astralDatas:', error);
  }
  
}

function analysisDatas(processedData){
  const starMinSpectWavelength = Math.pow(10, -8);
  const starMaxSpectWavelength = Math.pow(10, 3);
  const rockyPlanet = {
    rMass: [earthMass.multipliedBy(0.1), earthMass.multipliedBy(2)],
    rComposition: [undefined, undefined, true],
    rTemp: [123.85, 476.85],
  };
  const gasGiant = {
    gMass: [earthMass.multipliedBy(2), solMass.multipliedBy(0.1)],
    gComposition: [true, true, false],
    gTemp: [undefined, 2500],
  };
  const star = {
    sMass: [solMass.multipliedBy(0.1), solMass.multipliedBy(10)],
    sComposition: [true, true, false],
    sTemp: [2500, 50000],
  };
  const superNova = {
    snMass: [solMass.multipliedBy(8), solMass.multipliedBy(50)],
    snComposition: [false, false, false],
    snTemp: [50000, undefined],
  };
  const blackHole = {
    bMass: [solMass.multipliedBy(50), undefined],
    bComposition: [null, null, null],
    bTemp: [50000, undefined],
  };

  objectGuess = [0, 0, 0, 0, 0];
  

  try{
    if(processedData){
      if(processedData.mass){
      
        if(processedData.mass.isGreaterThan(rockyPlanet.rMass[0]) && processedData.mass.isLessThanOrEqualTo(rockyPlanet.rMass[1])){
          objectGuess[0] += 40;
          objectGuess[1] -= 10;
          objectGuess[2] -= 20;
          objectGuess[3] -= 30;
          objectGuess[4] -= 40;
        }
        else if(processedData.mass.isGreaterThan(gasGiant.gMass[0]) && processedData.mass.isLessThanOrEqualTo(gasGiant.gMass[1])){
          objectGuess[0] -= 10;
          objectGuess[1] += 30;
          objectGuess[2] -= 10;
          objectGuess[3] -= 20;
          objectGuess[4] -= 30;
        }
        else if(processedData.mass.isGreaterThan(star.sMass[0]) && processedData.mass.isLessThanOrEqualTo(star.sMass[1])){
          objectGuess[0] -= 20;
          objectGuess[1] -= 10;
          objectGuess[2] += 30;
          objectGuess[3] -= 10;
          objectGuess[4] -= 20;
        }
        else if(processedData.mass.isGreaterThan(superNova.snMass[0]) && processedData.mass.isLessThanOrEqualTo(superNova.snMass[1])){
          objectGuess[0] -= 30;
          objectGuess[1] -= 20;
          objectGuess[2] -= 10;
          objectGuess[3] += 30;
          objectGuess[4] -= 10;
        }
        else if(processedData.mass.isGreaterThan(blackHole.bMass[0])){
          objectGuess[0] -= 40;
          objectGuess[1] -= 30;
          objectGuess[2] -= 20;
          objectGuess[3] -= 10; 
          objectGuess[4] += 50;
        }
      }
      if(processedData.composition[0] && processedData.composition[0] == 1){
          objectGuess[0] += 0;
          objectGuess[1] += 17.5;
          objectGuess[2] += 12.5;
          objectGuess[3] -= 20;
          objectGuess[4] -= 20;
      }
      else if(processedData.composition[0] == 0){
        objectGuess[0] += 0;
        objectGuess[1] -= 17.5;
        objectGuess[2] -= 12.5;
        objectGuess[3] += 10;
        objectGuess[4] += 5;
      }
      if(processedData.composition[1] && processedData.composition[1] == 1){
        objectGuess[0] += 0;
        objectGuess[1] += 17.5;
        objectGuess[2] += 12.5;
        objectGuess[3] -= 20;
        objectGuess[4] -= 20;
      }
      else if(processedData.composition[1] == 0){
        objectGuess[0] += 0;
        objectGuess[1] -= 17.5;
        objectGuess[2] -= 12.5;
        objectGuess[3] += 10;
        objectGuess[4] += 5;
      }
      if(processedData.composition[2] && processedData.composition[2] == 1){
        objectGuess[0] += 50;
        objectGuess[1] -= 50;
        objectGuess[2] -= 50;
        objectGuess[3] -= 50;
        objectGuess[4] -= 50;
      }
      else if(processedData.composition[2] == 0){
        objectGuess[0] -= 50;
        objectGuess[1] += 30;
        objectGuess[2] += 10;
        objectGuess[3] += 10;
        objectGuess[4] += 5;
      }
      
      if(processedData.T && processedData.T != -1){
        if(processedData.T >= rockyPlanet.rTemp[0] && processedData.T <= rockyPlanet.rTemp[1]){
          objectGuess[0] += 10;
          objectGuess[1] += 2.5;
          objectGuess[2] -= 15;
          objectGuess[3] -= 30;
          objectGuess[4] += 0;
      
        }
        else if(processedData.T <= gasGiant.gTemp[1]){
          objectGuess[0] += 2.5;
          objectGuess[1] += 5;
          objectGuess[2] -= 10;
          objectGuess[3] -= 30;
          objectGuess[4] += 0;
        }
        else if(processedData.T > star.sTemp[0] && processedData.T <= star.sTemp[1]){
          objectGuess[0] -= 20;
          objectGuess[1] -= 15;
          objectGuess[2] += 15;
          objectGuess[3] -= 5;
          objectGuess[4] -= 10;
        }
        else if(processedData.T > superNova.snTemp[0]){
          objectGuess[0] -= 30;
          objectGuess[1] -= 25;
          objectGuess[2] += 5;
          objectGuess[3] += 10;
          objectGuess[4] += 5;
        }
        else if(processedData.T > blackHole.bTemp[0]){
          objectGuess[0] -= 30;
          objectGuess[1] -= 25;
          objectGuess[2] += 5;
          objectGuess[3] += 10;
          objectGuess[4] += 5;
        }
      }
    
      if(processedData.Ds && processedData.Ds[0] != -1 && processedData.Ds[1] != -1){
        if (
          processedData.Ds[0] >= starMinSpectWavelength-(starMinSpectWavelength*refDspect) &&
            processedData.Ds[0] <= starMinSpectWavelength+(starMinSpectWavelength*refDspect) &&
          processedData.Ds[1] >= starMaxSpectWavelength-(starMaxSpectWavelength*refDspect) &&
            processedData.Ds[1] <= starMaxSpectWavelength+(starMaxSpectWavelength*refDspect)
        ){
          objectGuess[0] -= 20;
          objectGuess[1] -= 15;
          objectGuess[2] += 20;
          objectGuess[3] -= 10;
          objectGuess[4] -= 30;
        }
        else{
          objectGuess[0] += 10;
          objectGuess[1] += 10;
          objectGuess[2] -= 10;
          objectGuess[3] += 5;
          objectGuess[4] += 10;
        }
      }
    
      if(processedData.difference && processedData.difference != -1){
        if (processedData.difference < refDmagnitude) {
          objectGuess[0] -= 15;
          objectGuess[1] -= 10;
          objectGuess[2] -= 10;
          objectGuess[3] -= 50;
          objectGuess[4] += 30;
        } 
        else {
          objectGuess[0] -= 20;
          objectGuess[1] -= 20;
          objectGuess[2] -= 5;
          objectGuess[3] += 30;
          objectGuess[4] -= 30;
        }
      }
    
      PoVquality = Math.max(...objectGuess);
      maxIndex = objectGuess.indexOf(PoVquality);
      if(PoVquality >= refTreshold){
        if(maxIndex == 0){
          tag = "rockyPlanet";
        }
        else if(maxIndex == 1){
          tag = "gasGiant";
        }
        else if(maxIndex == 2){
          tag = "star";
        }
        else if(maxIndex == 3){
          tag = "superNova";
        }
        else if(maxIndex == 4){
          tag = "blackHole";
        }
        //  If the analyzed proposal return a reasonable guess, then a positive vote will be dispatched
        console.log("This is a good guess! Voting for... ", processedData.id);
        votedPoV = processedData.id
        vote = 1;
        voteProposal(votedPoV, vote);
      }
      else{
        //  If the analyzed proposal return a bad guess, then a negative vote will be dispatched
        console.error("This is a bad guess. Voting against... ", processedData.id);
        votedPoV = processedData.id
        vote = -1;
        voteProposal(votedPoV, vote);
        tag = "unknown";
      }  
    }

  }catch(error){
    console.error('Error analyzing astralDatas:', error);
  }
  
}

async function voteProposal(votedPoV, vote){
  try{
    publicAccounts = await web3.eth.getAccounts();
    publicNodeSender = publicAccounts[2];
    await contract.methods.vote(votedPoV, vote).send({from: publicNodeSender, gas: gasLimit });
    console.log("Proposal voted!");
  }catch (error) {
    console.error('Error creating proposal:', error);
  }
}

setReferenceValues();

setInterval(extractProposals, 4000);