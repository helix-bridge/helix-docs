---
sidebar_position: 3
sidebar_label: Deployment
---

# Deployment

## Contract Deployment and Configuration

### Messager
* Connecting two chains requires a Messager, with options available here:
  * Choose the appropriate type based on both chains' support, or reuse an existing Messager if available.
  * The type can be found [here](https://github.com/helix-bridge/contracts/tree/master/helix-contract/contracts/messagers)
* After deploying the Messager, configure it for bidirectional communication:
  * Use the setRemoteMessager interface to set up connections, noting that interface parameters may vary depending on the Messager type.
* Grant XTokenBridge (either XTokenBacking or XTokenIssuing) permission to use the Messager:
  * Use setWhiteList to authorize XTokenBridge, which should be configured after deploying XTokenBridge (details below) and obtaining its address.

### XTokenBridge (XTokenBacking & XTokenIssuing)

* Repository: [XToken Contracts](https://github.com/helix-bridge/xtoken-monorepo/tree/main/packages/xtoken-contract)
* Deploy XTokenBacking on the source chain and XTokenIssuing on the issuing chain using a proxy contract method.
* Once deployed, connect XTokenBacking and XTokenIssuing using the Messager
  * Authorize the Messager before connecting (see authorization details in the Messager section above).
  * Use `setSendService` and `setReceiveService` to link both sides, specifying the opposite chain ID, the counterpart XTokenBridge address, and the local Messager Service address.
* Register Tokens
  * Use `registerOriginalToken` on XTokenBacking and `updateXToken` on XTokenIssuing to register native tokens and their mapped counterparts. If no mapped token exists, create one that follows the standard [IXToken interface](https://github.com/helix-bridge/xtoken-monorepo/blob/main/packages/xtoken-contract/contracts/interfaces/IXToken.sol).
  * Set a daily transaction limit with `setDailyLimit`.

### GuardV3 [optional]
* Deploy the GuardV3 contract: [GuardV3 Contract](https://github.com/helix-bridge/xtoken-monorepo/blob/main/packages/xtoken-contract/contracts/templates/GuardV3.sol)
* Use `updateGuard` to set the guard address. For any XTokenBridge with a non-zero guard address, transactions must go through Guard, and users will need to perform a claim action upon message delivery.

### WTokenConvertor [optional]
* If native token support is needed, deploy the WTokenConvertor contract: [WTokenConvertor Contract](https://github.com/helix-bridge/xtoken-monorepo/blob/main/packages/xtoken-contract/contracts/templates/WTokenConvertor.sol)
* This contract allows conversion between native tokens and WToken, enabling cross-chain WToken transfers via XTokenBridge.

### Additional Extensions
* GuardV3 and WTokenConvertor are specific scenarios for XToken callback extensions. Developers can implement custom extensions, provided they comply with the [IXTokenCallback interface](https://github.com/helix-bridge/xtoken-monorepo/blob/main/packages/xtoken-contract/contracts/interfaces/IXTokenCallback.sol).
* Extensions can be chained in sequence by specifying receipt and extData.

## Indexer
### Subgraph
* Currently, only supports msgport message types: [Subgraph Repository](https://github.com/helix-bridge/xtoken-monorepo/tree/main/packages/xtoken-indexer/subgraph)
* Deploy two subgraphs: transfer (for message sending events) and messageDispatcher (for message receiving events).
* When Guard is enabled, specify the guard address.
* For custom extensions, implement a custom subgraph tailored to the specific extension.

### Apollo
* Configure Apollo with transfer services by following the setup here: [Apollo Transfer Service](https://github.com/helix-bridge/xtoken-monorepo/blob/main/packages/xtoken-indexer/apollo/src/xtoken/transfer.service.ts)
