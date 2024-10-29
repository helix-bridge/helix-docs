---
sidebar_position: 2
sidebar_label: Protocol
---

# Protocol

## Terminology

### Source Chain and Target Chain
These refer to the originating blockchain network (source chain) and the destination blockchain network (target chain) involved in cross-chain asset transfers. They can also refer to the caller and the callee in a remote chain call. Typically, the target chain requires a light client for the source chain to verify messages or events from the source chain in a cross-chain context.

### Native Asset and Mapped Asset
This is a relative concept. A native asset refers to an asset that exists on its original chain, such as BTC on the Bitcoin network, rather than a wrapped or mapped version or an asset bridged to another chain, like wBTC. Here, a native asset typically refers to an asset that has not yet been bridged, such as ETH on the Ethereum network, while a mapped asset is issued on another chain based on a locking proof within the CBA model framework.

### Relayer
An entity responsible for executing information transfer tasks.

## CBA Model

Cryptocurrency Backed Asset (CBA) is an asset model involving a Backing module on the source chain and an Issuing module on the target chain. Further details on the CBA model are available in the relevant sections of the technical whitepaper.

* XTokenBacking Module
Provides the ability to lock and unlock native assets on the source chain.

* XTokenIssuing Module
Issues and burns mapped assets on the target chain.

## Cross-Chain Protocol
The sequence diagram of the cross-chain protocol is shown below:

### Asset Registration and Cross-Chain Issuance
Asset registration involves registering a native asset with the Backing module on the source chain, mapping it to a corresponding asset on the target chain. Typically, this registration occurs on the native chain, which is also the source chain of the bridge. By registering, the cross-chain bridge supports the asset's transfer across chains connected to the source chain network.

* The custodian registers the corresponding native and mapped assets on the source and target chains and links them via contract interfaces.
* The mapped asset is a standard ERC20 token, and the Issuing contract on the target chain holds issuance permissions.

### Lock and Issue Process
Cross-chain asset transfer locks native assets on the source chain as collateral for issuing mapped assets on the target chain. Once assets are registered, they can be transferred cross-chain using the XToken bridge.

* The user locks a specified amount of native assets on the source chain by calling the lock interface of the XTokenBacking module, designating a receiving account on the target chain. The source chain generates proof of the successful lock.
* The Relayer transmits this lock proof as a cross-chain message to the XTokenIssuing module on the target chain.
* The XTokenIssuing module issues an equivalent amount of mapped assets to the designated receiving account based on the received proof.

### Cross-Chain Redemption Process
Cross-chain redemption involves burning mapped assets on the target chain to unlock the native assets on the source chain. Unlocking collateral assets requires burn proof from the mapped assets. Users can unlock collateral assets by burning mapped assets.

* On the target chain, mapped asset holders call the burn and redeem interface of the XTokenIssuing module, burning a specified quantity of mapped assets and designating a receiving account on the source chain.
* The Relayer transmits the burn proof to the XTokenBacking module on the source chain.
* The XTokenBacking module unlocks the equivalent amount of native assets to the specified receiving account based on the received proof.

### Transactions
The transaction model in asset bridging ensures atomicity in cross-chain transactions, meaning each transaction has a closed state and does not lose user assets apart from any required transaction fees. The asset is either transferred successfully to the target chain or returned to the original chain.

When a user locks assets on the source chain, mapped assets are issued on the target chain.

* If issuance is successful, the user receives the mapped assets on the target chain, and the transaction completes.
* If issuance fails, the user can obtain proof of failure from the target chain to retrieve their locked assets on the source chain, ending the transaction.

This approach does not rely on the bridge’s underlying messaging response, needing only a single message from the source to the target chain in successful scenarios and an additional reverse message for failures. Reverse messages must be retryable to ensure eventual success.

On the source chain, metadata for each transaction is saved to enable rollback if needed, while the target chain saves each successful transaction ID to obtain failure proof if a transaction fails.
