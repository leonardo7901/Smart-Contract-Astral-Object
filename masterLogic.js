//  load the required libraries
const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const gasLimit = 500000;

//  parse the '.json' file to retrive the updated ABI on every deployment
const fs = require('fs');
const abiFile = JSON.parse(fs.readFileSync('./build/contracts/ProposalManager.json'));
const contractABI = abiFile.abi;

// parse the '.txt' file to retrive the updated contract address on every deployment
const contractAddressFile = fs.readFileSync('./contractAddress.txt', 'utf-8');
const contractAddress = contractAddressFile.trim();
console.log('contractAddress:', contractAddress);

// Connect to the Ethereum network using Ganache
const web3 = new Web3('HTTP://127.0.0.1:8545'); 

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);




//  Set constants
const wienConstant = BigNumber('2.898e-3');   //  Wien constant: from https://en.wikipedia.org/wiki/Wien%27s_displacement_law
const earthMass = BigNumber('5.9722e24');     
const solMass = BigNumber('1.98847e30');
const DwEarth = BigNumber('3.6e26');    //  Wattage delta of luminosity, when Earth pass in front of Sol -> 4e26 - 4e25 


// Function to generate a random number within a specified range and with random number of digits within the range
function getRandomLargeNumber(min, max) {
  var numDigits = Math.floor(Math.random() * (max.toString().length - min.toString().length + 1)) + min.toString().length;
  var value = '';

  for (var i = 0; i < numDigits; i++) {
    var digit = Math.floor(Math.random() * 10);  // Generate a random digit from 0 to 9
    value += digit.toString();
  }

  var randomNumber = parseInt(value);
  if (randomNumber < min || randomNumber > max) {
    return getRandomLargeNumber(min, max);  // Recursive call to ensure the number falls within the range
  }
  return randomNumber;
}

// Function to generate a random number within a specified range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random Big Number within a specified range
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

// Function to generate a random unique ID
function getRandomID(){
  var timestamp = Date.now().toString(); // Get current timestamp as string
  var random = Math.random().toString().substring(2, 8); // Get random number as string
  var newID = `${timestamp}-${random}`;
  return newID;
}

// Function to create a new astralData with randomized values
async function createAstralData() {

  var position = [
    getRandomNumber(-1000, 1000),
    getRandomNumber(-1000, 1000),
    getRandomNumber(-1000, 1000)
  ];

  var id = getRandomID();

  //  Roll a dice in order to pick which astral type of data to create. It try to simulate the abundance of certain types of astral object and the scarcity of others
    var dice = getRandomNumber(0, 100);
    //console.log('dice', dice);

  //  Astral Data within the range of a probable Rocky Planet
  if (dice >= 0 && dice < 5){
    //  DwEarth : earthMass = Dwx : m. Dwx is the variable, m is the mass specified by the range of the possible astral object (below, m = 0.1*EarthMass and m = 2*EarthMass)
    //  The range is extended by 30% booth ways to simulate randomness
    var Dw = BigNumber( getRandomBigNumber(DwEarth.multipliedBy(earthMass.multipliedBy(0.1).minus(earthMass.multipliedBy(0.1).multipliedBy(0.3))).dividedBy(earthMass), DwEarth.multipliedBy(earthMass.multipliedBy(2).plus(earthMass.multipliedBy(2).multipliedBy(0.3))).dividedBy(earthMass)) );
    
    //  Random radio wavelenght of the possible elements. H = 21 cm ; He = 2.86 cm = 286e-2 cm ; Si = 100 cm
    //  The range is extended by 30% booth ways to simulate randomness
    var radioComposition = [
      getRandomNumber(15, 27),
      getRandomNumber(200, 372),
      getRandomNumber(50, 150)
    ];

    //  Generate a lambda value between the range tollerated by the astral object, but extended by 30% booth ways to simulate randomness
    //  Lambda values are multiplied by 10e10, in order to ensure the compatibility with Solidity
    var lambda = getRandomBigNumber(297231, 3361754)

    //  A Rocky Planet normally doesn't have Ds or magnitude
    var Ds = [-1, -1];    // Ds is the spectrum delta of a Star -> 10^-8 to 10^3 (UV to radio)
    var magnitude = [-1, -1];   //  Magnitude is an array containing the final ([0]) and initial ([1]) magnitude of the light, passed by an object

  }

  //  Astral Data within the range of a probable Gas Giant
  else if(dice >= 5 && dice < 15){
    var Dw = BigNumber( getRandomBigNumber(DwEarth.multipliedBy(earthMass.multipliedBy(2).minus(earthMass.multipliedBy(2).multipliedBy(0.3))).dividedBy(earthMass), DwEarth.multipliedBy(earthMass.multipliedBy(33000).plus(earthMass.multipliedBy(33000).multipliedBy(0.3))).dividedBy(earthMass)) );

    var radioComposition = [
      getRandomNumber(10, 30),
      getRandomNumber(200, 372),
      getRandomNumber(50, 150)
    ];
    
    var lambda = getRandomBigNumber(89169, 3361754)

    var Ds = [-1, -1];    
    var magnitude = [-1, -1];
  }

  // Astral Data within the range of a probable Star
  else if(dice >= 15 && dice < 75){
    var Dw = BigNumber( getRandomBigNumber(DwEarth.multipliedBy(earthMass.multipliedBy(33000).minus(earthMass.multipliedBy(33000).multipliedBy(0.3))).dividedBy(earthMass), DwEarth.multipliedBy(earthMass.multipliedBy(3333000).plus(earthMass.multipliedBy(33000).multipliedBy(0.3))).dividedBy(earthMass)) );

    var radioComposition = [
      getRandomNumber(20, 22),
      getRandomNumber(200, 372),
      getRandomNumber(70, 130)
    ];
    
    var lambda = getRandomBigNumber(4458, 165600);
    
    //  A star need Ds.
    //  The range is extended by 30% booth ways to simulate randomness
    var Ds = [
      getRandomLargeNumber(0.7 * Math.pow(10, 8), 1.3 * Math.pow(10, 8)),
      getRandomLargeNumber(0.7 * Math.pow(10, 3), 1.3 * Math.pow(10, 3))
    ];

    var magnitude = [-1, -1];
  }

  //  Astral Data within the range of a probable Supernova
  else if(dice >= 75 && dice < 80){
    var Dw = BigNumber( getRandomBigNumber(DwEarth.multipliedBy(earthMass.multipliedBy(3333000).minus(earthMass.multipliedBy(3333000).multipliedBy(0.3))).dividedBy(earthMass), DwEarth.multipliedBy(earthMass.multipliedBy(16650000).plus(earthMass.multipliedBy(16650000).multipliedBy(0.3))).dividedBy(earthMass)) );

    var radioComposition = [
      getRandomNumber(10, 30),
      getRandomNumber(200, 372),
      getRandomNumber(50, 150)
    ];

    var lambda = getRandomBigNumber(8280, 6900);

    //  A supernova needs Magnitude.
    var magnitude = [
      getRandomLargeNumber(1, 10000000),
      getRandomLargeNumber(1, 10000000)
    ];

    var Ds = [-1, -1];
  }

  //  Black hole
  else if(dice >= 80 && dice < 100){
    var Dw = BigNumber( getRandomBigNumber(DwEarth.multipliedBy(earthMass.multipliedBy(3333000).minus(earthMass.multipliedBy(3333000).multipliedBy(0.3))).dividedBy(earthMass), DwEarth.multipliedBy(earthMass.multipliedBy(16650000).plus(earthMass.multipliedBy(16650000).multipliedBy(0.3))).dividedBy(earthMass)) );

    var radioComposition = [
      getRandomNumber(10, 30),
      getRandomNumber(200, 372),
      getRandomNumber(50, 150)
    ];

    var lambda = getRandomBigNumber(8280, 6900);

    //  A black hole needs Magnitude.
    var magnitude = [
      getRandomLargeNumber(1, 10000000),
      getRandomLargeNumber(1, 10000000)
    ];

    var Ds = [-1, -1];
  }

  // Call the 'addAstralData' function of the smart contract
  try {
    //  Fetch the address of the master node (alias: first [0] address that deployed the contract), then send the generated astral data
    const accounts = await web3.eth.getAccounts();
    const masterNode = accounts[0];
    console.log('id: ', id, 'position: ', position, 'Dw: ', Dw, 'Ds: ', Ds, 'magnitude: ', magnitude, 'radioComposition: ', radioComposition, 'lambda: ', lambda | 0);
    await contract.methods.addAstralData(id, position, Dw, radioComposition, lambda | 0, Ds, magnitude).send({ from: masterNode, gas: gasLimit });
    console.log('New astralData created!');
  } catch (error) {
    console.error('Error creating astralData:', error);
  }
}

// Call the 'createAstralData' function every minute
setInterval(createAstralData, 2000);

/*for (var i = 0; i < 50 ; i++) {
  createAstralData();
}*/

/*console.log('Terran planet:', wienConstant.dividedBy(750 + 0.3*(750)).multipliedBy('10e10').toString(), wienConstant.dividedBy(123.15 - 0.3*(123.15)).multipliedBy('10e10').toString())
console.log('Gas Giant:', wienConstant.dividedBy(2500 + 0.3*(2500)).multipliedBy('10e10').toString(), wienConstant.dividedBy(123.15 - 0.3*(123.15)).multipliedBy('10e10').toString())
console.log('Star:', wienConstant.dividedBy(50000 + 0.3*(50000)).multipliedBy('10e10').toString(), wienConstant.dividedBy(2500 - 0.3*(2500)).multipliedBy('10e10').toString())
console.log('balck hole, supernova', wienConstant.dividedBy(50000 - 0.3*(50000)).multipliedBy('10e10').toString(), wienConstant.dividedBy(60000 + 0.3*(60000)).multipliedBy('10e10').toString())
*/
  