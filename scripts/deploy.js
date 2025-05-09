const { ethers } = require("hardhat");

async function main () {
    const mockUSDC = await ethers.getContractFactory("mockUSDC");
    console.log('Deploying mockUSDC contract...');
    const mockUSDCContract = await mockUSDC.deploy();
    const mockUSDCContractAddress = await mockUSDCContract.getAddress();
    console.log('mockUSDC contract deployed to:', mockUSDCContractAddress);

    // const governanceToken = await ethers.getContractFactory("GovernanceToken");
    // console.log('Deploying governanceToken contract...');
    // const governanceTokenContract = await governanceToken.deploy();
    // const governanceTokenContractAddress = await governanceTokenContract.getAddress();
    // console.log('governanceToken contract deployed to:', governanceTokenContractAddress);

    const arbitrators = [
        "0xf2808E6b28A2aA13A9Ce5dD330190dC992E4f57A",
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    ];

    const EscrowFactory = await ethers.getContractFactory("EscrowFactory");
    console.log('Deploying EscrowFactory ...');
    const escrowFactory = await EscrowFactory.deploy(mockUSDCContractAddress, arbitrators);
    const escrowFactoryAddress = await escrowFactory.getAddress();
    console.log('EscrowFactory deployed to:', escrowFactoryAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });