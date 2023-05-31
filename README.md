# Smart Contract Astral Object
## Overview
Smart Contract Astral Object, or SCAO, is a fully independent developed smart contract for Ethereum that try to collimate the galactic space shadowed by the "Zone of Avoidance".
The Zone of Avoidance, or Zone of Galactic Obscuration, is an area in the galactic plane where dust, gas, and stars obstruct the view and sensors of the visible spectrum.
Taking deliberate inspiration from the experiences of Foldit and SETI@home, the project focuses on developing a system capable of overcoming this obscuration by distributing analyses publicly among machines, which will have the ability to choose and promote their own perspective and classification of celestial areas or bodies.
More specifically, all peer nodes can propose a viewpoint based on pre-existing astronomical data (as well as data validated subsequently within the blockchain), their own simulations, and assumptions. This viewpoint will be validated by the majority of the remaining peers if they consider it acceptable according to their parameters. At the end of the negotiation, virtual telescopes and astronomical sensors will point in the indicated direction, and if the simulation proves to be true, the proposal of the winning peer will be inserted into the blockchain, along with its identifier.
Thus, the computational part of SETI@home is carried forward, as well as the "puzzle" aspect of Foldit, along with distributed assistance for research.
## Premise
The system is fully working, but, for now, only by automated tests runned by JavaScript interfaces to the smart contract, therefore there's no human interaction in the process to choose some data to analyze rather than another, nor the generated astral datas have some physical meaning, because it's all pseudo-random generated.
Also it's very important to clarify most parts of the calculations made to perform a simulations are overly simplified, even invented by me, just for the sake of the project.
## In-depth view
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
