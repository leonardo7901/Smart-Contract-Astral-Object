# Smart Contract Astral Object
## Overview
**Smart Contract Astral Object**, or SCAO, is a fully independent developed smart contract for Ethereum that try to collimate the galactic space shadowed by the "**Zone of Avoidance**". </br>
The Zone of Avoidance, or Zone of Galactic Obscuration, is an area in the galactic plane where dust, gas, and stars obstruct the view and sensors of the visible spectrum. </br>
Taking deliberate inspiration from the experiences of [Foldit](https://fold.it/) and [SETI@home](https://setiathome.berkeley.edu/), the project focuses on developing a system capable of overcoming this obscuration by distributing analyses publicly among machines, which will have the ability to choose and promote their own perspective and classification of celestial areas or bodies. More specifically, all peer nodes can propose a **point of view/PoV** based on pre-existing astronomical data (as well as data validated subsequently within the blockchain), their own simulations, and assumptions. This viewpoint will be validated by the majority of the remaining peers if they consider it acceptable according to their parameters. At the end of the negotiation, virtual telescopes and astronomical sensors will point in the indicated direction, and if the simulation proves to be true, the proposal of the winning peer will be inserted into the blockchain, along with its identifier. </br>
Thus, the computational part of SETI@home is carried forward, as well as the "puzzle" aspect of Foldit, along with distributed assistance for research.
## Premise
The system is fully working, but, for now, only by automated tests runned by JavaScript interfaces to the smart contract, therefore there's no human interaction in the process to choose some data to analyze rather than another, nor the generated astral datas have some physical meaning, because it's all pseudo-random generated.
Also it's very important to clarify that most parts of the calculations made to perform a simulations are overly simplified, **even invented by me**, just for the sake of the project.
## In-depth view
To simplify the use cases, here are given five examples of possible astral object: _Rocky planet_, _Gas giant_, _Star_, _Supernova_ and _Black hole_, each with their unique values of _mass_, _composition_, _temperature_, _difference of spectrum_ and _microlensing magnitude_.
- The _mass_ is calculated by the [Transit method](https://exoplanets.nasa.gov/faq/31/whats-a-transit/), that occurs when the light of a space area dimmer at constat intervals. Here the calculations are made by taking the luminosity of our star [Sol](https://en.wikipedia.org/wiki/Sun) **W<sub>Sol</sub> = 3,827×10<sup>26</sup> W ≈ 4×10<sup>26</sup> W = W<sub>Sol<sub>i</sub></sub>**, passed by the Earth **W<sub>Sol<sub>f</sub></sub> = 4×10<sup>25</sup> W**. So the equation will be **W<sub>Sol<sub>i</sub></sub> - W<sub>Sol<sub>f</sub></sub> = 3.6×10<sup>26</sup> W = ΔW<sub>Earth</sub>**. Now with this simple proportion **ΔW<sub>Earth</sub> : mass<sub>Earth</sub> = ΔW<sub>y</sub> : mass<sub>x</sub>**, with ΔW<sub>y</sub> given by the astral data and mass<sub>x</sub> variable, we can find the mass of any object.
- The _difference of spectrum_ is a value gathered by [Spectroscopic](https://imagine.gsfc.nasa.gov/science/toolbox/spectra1.html#:~:text=Thus%2C%20astronomers%20can%20identify%20what%20kinds%20of%20stuff,and%20density%20of%20that%20element%20in%20the%20star.) sensors that will tell us if the body is a _star_ or not, if it fits in that range (typically from **ultraviolet** to **radio**; 10<sup>-8</sup> -> 10<sup>3</sup>.
- The _microlensing magnitude_ is calculated using the [Gravitational microlensing method](https://www.universetoday.com/138141/gravitational-microlensing-method/#:~:text=What%20is%20the%20Gravitational%20Microlensing%20Method%3F%201%20Description%3A,...%204%20Examples%20of%20Gravitational%20Microlensing%20Surveys%3A%20), which sates that an object passing in front of another, it will bend the fabric of space-time by orders of magnitudes relatively at it's gravitational pull. Based on that, our sensors will gather that magnitude of a locked point, after and before the passing of the space anomaly (M<sub>i</sub> ; M<sub>f</sub>), guessing which exotic body it is.
- The _composition_ is calculated by analyzing three different [radio wavelength](https://www.esa.int/Science_Exploration/Space_Science/Observations_Seeing_in_radio_wavelengths) measurment taken by the sensor, each corresponding with **Hydrogen _H_ = 21 cm**, **Helium _He_ = 2.86 cm** and **Silicium _Si_ = 100 cm** (last one is made up, since the spectrum of Silicium is not in the radio wavelegths).
- The _temperature_ is calculated by the [Wien's displacement law](https://en.wikipedia.org/wiki/Wien%27s_displacement_law), where harvested peaks of infrared wavelength can tell us the temperature of a body.

The first three (_strong_) methods can give us a fairly good chance of positive guess, beign specific tools for each _exo-planets_, _stars_ and _exotic objects_; meanwhile the last two (_weaks_) instruments says more about physical feature of that locked point, which can be misleading.

The system is composed by two fundamental actors: 
- The **master node**, which is our collection of telescopes and sensors, which inject the smart contract with astral datas that virtually retrive form space observations. Then, if a proposed PoV gathers the majority of positives votes among **peer nodes**, it will run an accurate physical measurement to check if it says the truth, and in that case, the proposal is accepted.
- The **peer node**, which is whoever connects itself to the smart contract, able to do computations, simulations and guesses to whatever is the meaning of the astral data extracted, giving the possibility to certificate the discover of a new astral object.
# Prerequisites
-   [Install](https://nodejs.org/en/download) Node.js and npm in your machine.
-   [Install](https://trufflesuite.com/ganache/) Ganache in your machine.
-   [Install](https://trufflesuite.com/truffle/) Truffle in your machine (or use `npm install truffle -g` from CLI).
-   [Install](https://git-scm.com/downloads) Git in your machine.
# Usage
1.  Clone the repository on you machine.
2.  Run `npm install` to automatically install the dependencies inside `package.json`.
3.  Compile and deploy the smart contract `proposalManager.sol` inside `contracts` folder.
    - Ensure that Ganache is running and able to link the deploy, [configuring](https://www.geeksforgeeks.org/how-to-use-ganache-truffle-suite-to-deploy-a-smart-contract-in-solidity-blockchain/) the parameters of the host server and the request.
5.  Now you can run the `*.js` script, each for the **master node**, **peer node** and their use cases.
