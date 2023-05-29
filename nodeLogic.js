const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const gasLimit = 500000;

const fs = require('fs');
const abiFile = JSON.parse(fs.readFileSync('./build/contracts/ProposalManager.json'));
const contractABI = abiFile.abi;

const contractAddressFile = fs.readFileSync('./contractAddress.txt', 'utf-8');
const contractAddress = contractAddressFile.trim();
console.log('contractAddress:', contractAddress);

// Connect to the Ethereum network using Ganache
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
  var timestamp = Date.now().toString(); // Get current timestamp as string
  var random = Math.random().toString().substring(2, 8); // Get random number as string
  var newID = `${timestamp}-${random}`;
  return newID;
}




//  Function to set the reference analysis values, in order to give a personal PoV
function setReferenceValues(){
  refDw = BigNumber( getRandomBigNumber(BigNumber('3.3e26'), BigNumber('3.9e26')) );
  refT = +getRandomNumber(0, 0.15).toFixed(4);
  refComposition = [
    +getRandomNumber(0, 0.15).toFixed(4),
    +getRandomNumber(0, 0.15).toFixed(4),
    +getRandomNumber(0, 0.15).toFixed(4),
  ];
  refDspect = +getRandomNumber(0, 0.15).toFixed(4);
  refDmagnitude = Math.floor(getRandomNumber(2, 5));
  //refTreshold = 40;
  refTreshold = +getRandomNumber(0, 100).toFixed(2);
  console.log('Reference values --> ', 'Dw: ', +refDw.toFixed(0).toString(), 'W', '  T: ', +(refT*100).toFixed(2), '%', '  Composition: ', refComposition, '* 100 %', '  Ds: ', +(refDspect*100).toFixed(2), '%', '  Treshold: ',  refTreshold);
}

// Function to extract astralDatas array
async function extractAstralDatas() {
  try {
    astralDatasCount = await contract.methods.getAstralDatasCount().call();
    extractedAstralDatas = [];

    for (let i = 0; i < astralDatasCount; i++) {
      astralData = {
        index: i,
        id: await contract.methods.getAstralDataID(i).call(),
        position: await contract.methods.getAstralDataPosition(i).call(),
        Dw: await contract.methods.getAstralDataDw(i).call(),
        radioComposition:  await contract.methods.getAstralDataRadioComposition(i).call(),
        lambda: await contract.methods.getAstralDataLambda(i).call(),
        Ds: await contract.methods.getAstralDataDs(i).call(),
        magnitude: await contract.methods.getAstralDataMagnitude(i).call(),
      };
      extractedAstralDatas.push(astralData);
      //  If the astralData is already extracted, do nothing
      if(i > 0 && astralData && extractedAstralDatas[i] && extractedAstralDatas[i-1] && astralData.id == extractedAstralDatas[i-1].id){
        extractedAstralDatas.pop();
        console.error('Data already extracted: ', extractedAstralDatas[i]);
      }
    }
    console.log('AstralDatas extracted:', extractedAstralDatas);
    processAstralDatas(extractedAstralDatas);

  } catch (error) {
    console.error('Error extracting astralDatas:', error);
  }
}

usedAstralDatas = [];
//  Function to process astralData
function processAstralDatas(extractedAstralDatas) {
  try{
    if (extractedAstralDatas && extractedAstralDatas.length > 0){
      const wienConstant = BigNumber('2.898e-3');
      const hydrogenRadioWaveLenght = 21;
      const heliumRadioWavelenght = 286;
      const siliciumRadioWavelenght = 100;
      
      //   Pick a random index from the extractedAstralDatas array
      c = Math.floor(getRandomNumber(0, extractedAstralDatas.length - 1))
      
      //  If the astralData is already processed, do nothing
      if(!usedAstralDatas.includes(c) && c < extractedAstralDatas.length){
        usedAstralDatas.push(c);
        position = extractedAstralDatas[c].position;
        
        mass = earthMass.multipliedBy(BigNumber(extractedAstralDatas[c].Dw)).dividedBy(refDw);    //  From DwEarth : earthMass = Dwx : m -> m = (earthMass * Dw) / DwEarth 

        // If the given radio wavelenght fit in the range of an element, extended by a tollerance value (refComposition), then the object probably have that element
          if (
            extractedAstralDatas[c].radioComposition[0] >=
              hydrogenRadioWaveLenght -
                hydrogenRadioWaveLenght * refComposition[0] &&
            extractedAstralDatas[c].radioComposition[0] <=
              hydrogenRadioWaveLenght +
                hydrogenRadioWaveLenght * refComposition[0]
          ) {
            H = true;
          } else {
            H = false;
          }
          if (
            extractedAstralDatas[c].radioComposition[1] >=
              heliumRadioWavelenght -
                heliumRadioWavelenght * refComposition[1] &&
            extractedAstralDatas[c].radioComposition[1] <=
              heliumRadioWavelenght +
                heliumRadioWavelenght * refComposition[1]
          ) {
            He = true;
          } else {
            He = false;
          }
          if (
            extractedAstralDatas[c].radioComposition[2] >=
              siliciumRadioWavelenght -
                siliciumRadioWavelenght * refComposition[2] &&
            extractedAstralDatas[c].radioComposition[2] <=
              siliciumRadioWavelenght +
                siliciumRadioWavelenght * refComposition[2]
          ) {
            Si = true;
          } else {
            Si = false;
          }
        
        //  By the Wien Displacement Law, T = WienConstant / (lambda/10e10)
        T = (wienConstant.dividedBy(BigNumber(extractedAstralDatas[c].lambda).dividedBy('10e10')));
        
        //  Saves the border values of the Ds range
        if (extractedAstralDatas[c].Ds[0] != -1 && extractedAstralDatas[c].Ds[1]!= -1) {
          minDs = extractedAstralDatas[c].Ds[0];
          maxDs = extractedAstralDatas[c].Ds[1];
        }
        else{
          minDs = -1;
          maxDs = -1;
        }
        
        //  From the given values, calculate the difference between the order of magnitude.
        if (extractedAstralDatas[c].magnitude[0] != -1 && extractedAstralDatas[c].magnitude[1] != -1) {
          magnitude1 = Math.log10(Math.abs(extractedAstralDatas[c].magnitude[0]));
          magnitude2 = Math.log10(Math.abs(extractedAstralDatas[c].magnitude[1]));
          difference = Math.abs(magnitude2 - magnitude1);
        }
        else{
          difference = -1;
        }

        //  Saves the processed values in a 'struct'
        processedData = {
          index: extractedAstralDatas[c].index,
          id: extractedAstralDatas[c].id,
          position: position,
          mass: mass,
          composition: [H, He, Si],
          T: T,
          Ds: [minDs, maxDs],
          difference: difference,
        }

        console.log('AstralData processed:', processedData);
        analysisAstralDatas(processedData);
  
      }
      else{
        console.error('AstralData not processed: non-existent or already proccessed data.');
      }
    }
  }catch(error){
    console.error('Error processing astralDatas:', error);
  }
  
}

function analysisAstralDatas(processedData){
  // Set the reference constants for the various astral objects
  const starMinSpectWavelength = Math.pow(10, 8);
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
    snMass: [solMass.multipliedBy(10), solMass.multipliedBy(50)],
    snComposition: [false, false, false],
    snTemp: [50000, undefined],
  };
  const blackHole = {
    bMass: [solMass.multipliedBy(50), undefined],
    bComposition: [null, null, null],
    bTemp: [50000, undefined],
  };

  // Set to 0 an array with the score of each astral object 
  objectGuess = [0, 0, 0, 0, 0];

  try{
    //  Check in wich range the mass fits, then add or subtract points depending on the range
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

    //  Each type of astral object has or not certain type of element. Based on that, points are added or subtracted
    //  H
    if(processedData.composition[0]){
        objectGuess[0] += 0;
        objectGuess[1] += 17.5;
        objectGuess[2] += 12.5;
        objectGuess[3] -= 20;
        objectGuess[4] -= 20;
    }
    else if(!processedData.composition){
      objectGuess[0] += 0;
      objectGuess[1] -= 17.5;
      objectGuess[2] -= 12.5;
      objectGuess[3] += 10;
      objectGuess[4] += 5;
    }
    //  He
    if(processedData.composition[1]){
      objectGuess[0] += 0;
      objectGuess[1] += 17.5;
      objectGuess[2] += 12.5;
      objectGuess[3] -= 20;
      objectGuess[4] -= 20;
    }
    else if(!processedData.composition[1] == 0){
      objectGuess[0] += 0;
      objectGuess[1] -= 17.5;
      objectGuess[2] -= 12.5;
      objectGuess[3] += 10;
      objectGuess[4] += 5;
    }
    //  Si
    if(processedData.composition[2]){
      objectGuess[0] += 50;
      objectGuess[1] -= 50;
      objectGuess[2] -= 50;
      objectGuess[3] -= 50;
      objectGuess[4] -= 50;
    }
    else if(!processedData.composition[2]){
      objectGuess[0] -= 50;
      objectGuess[1] += 30;
      objectGuess[2] += 10;
      objectGuess[3] += 10;
      objectGuess[4] += 5;
    }
    
    //  Each type of astral has his range of temperature. Based on that, points are added or subtracted
    if(processedData.T){
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
    
    //  If a Ds is extracted, check if it fits in the range of the star, then will be added or subtracted some points
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
    
    //  If a difference is extracted, check if it is less or greater than the value set by reference (refDmagnitude), then will be added or subtracted some points
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
    
    //  Retrive the max PoV quality of the astral object with its index. If it is higher or equal than the value set by reference (refTreshold), then a type of astral object can be guessed
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
      
      //  Struct to encapuslate the guessed object
      guessedAstralObject = {
        gDataId: processedData.index,
        gID: getRandomID(),
        gPosition: processedData.position,
        gTag: tag,
        gTemp: processedData.T,
        gComposition: processedData.composition,
        gMass: processedData.mass,
      };
      for(let i = 0; i < objectGuess.length; i++){
        console.log(objectGuess[i]);
      }
      console.log('Good guess analyzed! Dispatching proposal... ', guessedAstralObject)
      createProposal(guessedAstralObject);
    }
    else{
      console.error('Error analyzing astralDatas: insufficent or bad data quality');
      tag = "unknown";
    }

  }catch(error){
    console.error('Error analyzing astralDatas:', error);
  }
  
}

async function createProposal(guessedAstralObject){
  try{
    publicAccounts = await web3.eth.getAccounts();
    publicNodeSender = publicAccounts[1];
    await contract.methods.addProposal(guessedAstralObject.gDataId, guessedAstralObject.gID, guessedAstralObject.gPosition, guessedAstralObject.gTag, (guessedAstralObject.gTemp | 0), guessedAstralObject.gComposition, BigNumber(guessedAstralObject.gMass).toFixed(0)).send({from: publicNodeSender, gas: gasLimit });
    console.log("Proposal dispatched!");
  }catch (error) {
    console.error('Error creating proposal:', error);
  }
}

setReferenceValues();

setInterval(extractAstralDatas, 2000);
