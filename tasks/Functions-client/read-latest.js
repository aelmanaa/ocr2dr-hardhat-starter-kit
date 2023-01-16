const path = require("path")
const { getDecodedResultLog } = require("../../FunctionsRequestSimulator")

task("functions-read", "Reads the latest response returned to a FunctionsConsumer client contract")
  .addParam("contract", "Address of the client contract to read")
  .addOptionalParam("path", "Path to request configuration file")
  .setAction(async (taskArgs) => {
    if (network.name === "hardhat") {
      throw Error(
        'This command cannot be used on a local hardhat chain.  Please specify a valid network or simulate an FunctionsConsumer request locally with "npx hardhat functions-simulate".'
      )
    }

    console.log(`Reading data from Functions client contract ${taskArgs.contract} on network ${network.name}`)
    const clientContractFactory = await ethers.getContractFactory("FunctionsConsumer")
    const clientContract = await clientContractFactory.attach(taskArgs.contract)

    let latestResponse = await clientContract.latestResponse()

    // Build the parameters to make a request from the client contract
    const requestConfigPath = taskArgs.path
    let requestConfig
    if (requestConfigPath) {
      console.log(`load request config file from ${requestConfigPath}`)
      requestConfig = require(path.resolve(requestConfigPath))
    } else {
      console.log(`no load request config file provided. Load config from ./Functions-request-config.js`)
      requestConfig = require("../../Functions-request-config.js")
    }
    console.log(
      `\nOn-chain response represented as a hex string: ${latestResponse}\n${getDecodedResultLog(
        requestConfig,
        latestResponse
      )}`
    )
  })
