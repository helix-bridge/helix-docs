---
sidebar_position: 1
sidebar_label: Client
---

# Helix Relayer Client

This is an open-source JavaScript software, and you can find more information about it on their [GitHub repository](https://github.com/helix-bridge/relayer). Refer to the README file in the repository for detailed guides.

Please make sure to carefully follow the instructions provided in the README for a successful setup and deployment of the Helix Relayer Client.

Here's a brief overview of the steps to deploy a Relayer:

- **Indexer Service Preparation (Skip if using Helix's public service)**

  If you're not using Helix's public service, you'll need to deploy your own Indexer service. This may involve setting up and configuring an Indexer to index and provide on-chain data.

  If you are not connected to the Helix public service, the Helix app will not be able to display your relayer information and will be unable to complete recommendations when users send transactions.

- **Building from Source**

  Download the Relayer's source code and compile it according to the instructions in the project's documentation. Typically, this involves installing build tools, dependencies, and running build commands.

- **Configuration**

  In the Relayer's configuration file, specify information about the bridges you want to interact with. This includes details about the source and target chains, such as chain types, connection details, contract addresses, etc.

- **Running**

  Run the client and ensure it remains online, ready to handle relaying requests. Relayers usually listen on a specific port, awaiting requests from users.

- **On-chain Registeration**

  Depending on the bridge's requirements, you may need to register the Relayer's identity on-chain, stake a certain amount as a bond, and establish the fee structure. This ensures the credibility and availability of the Relayer.

It's crucial to ensure that the Relayer client runs smoothly and remains online before attempting to register as a Relayer. Failing to do so could result in penalties or other consequences, as reliability and uptime are typically essential criteria for becoming and remaining a Relayer in most bridge ecosystems. Therefore, it's essential to thoroughly test and monitor your Relayer setup to meet the required standards before registering and actively participating in the bridge network.
