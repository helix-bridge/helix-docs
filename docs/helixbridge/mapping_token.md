---
group:
  title: 🔹 Protocol
  order: 2
order: 1
---

## Overview

Although the protocol is currently little used, it's an important part of Helix's business is hosting user assets and completing cross-chain asset transfers. It uses an asset registration and cross-chain protocol based on the CBA (Cryptocurrency Backed Asset) model.

## Terminology

- **Source Chain And Target Chain**
  <br>Rrefer to the source blockchain network and the target blockchain network for cross-chain asset transfer via a bridge, respectively, or the caller and the callee of a remote chain call. Generally, a light client of the source chain needs to be built on the target chain to perform cross-chain verification of messages or events from the source chain.
- **Origin Token And Mapping Token**
  <br>This is a relative term. Original token usually refer to assets that have not been bridged to the target chain., such as BTC on the Bitcoin network, ETH or USDT on the Ethernet network. As opposed to a orgin token, which is located on the source chain end of the bridge, and a mapping token, which is located on the target chain end of the bridge, and is a type of asset created with the backing of the original token.
- **Relayer**
  <br>Relayers are a group of competing and supervising entities to maintain and accomplish the bridge's information transfer tasks. Relayers cannot have a substantial impact on the safety of a bridge, but have a direct role in the stability and effectiveness of the bridge.

## CBA Model

Build the Backing module on the source chain and the Issuing module on the target chain, and the underlying call to the generic bridge message channel interface to complete the asset registration and issuance process.

<img src="/cba01.png" style="width:70%; height:70%; text-align:middle; margin-left:15%; margin-right:15%">

- **Backing**
  <br>Deployed on source chain. User tokens are locked to the Backing module, Backing generates locking proofs, and the tokens are hosted in Backing as an endorsement for asset issuance mapping on the target chain. Until the user initiates a reverse redemption operation, the tokens are unlocked again to the user's account.
- **Issuing**
  <br>Deployed on target chain. Backed by the original token in the locking model, Issuing issues mapping token to the user's account. When a user initiates a redemption operation, Issuing burns the mapping token and generates a proof of destruction for the original token redemption.

## Protocol

<img src="/mapping_token.svg" style="width:70%; height:70%; text-align:middle; margin-left:15%; margin-right:15%">

- **Register**
  <br>Token registration is the process of registering the original token to the Backing module on the source chain and mapping it to the mapping token on the target chain. It calls Backing module interface to pass in meta information of the original token, and the message relayer transfers the information to the Issuing module on the target chain to create the corresponding mapping token.
- **Lock And Issue**
  <br>After the asset registration is completed, the user can lock the original token through Backing module, and after Message Relayer synchronizes the locking message to the target chain, Issuing module mint out the same amount of mapping token to the account specified by the user.
- **Swap And Other Applications**
  <br>On the target chain, mapping token have the same token standard as original token, allowing users to execute various types of applications such as swap and transfer.
- **Burn And Redeem**
  <br>Users holding mapping token on the target chain can burn the mapping token by calling the Issuing module interface. Message Relayer will deliver the burning message to the source chain and then the Backing module unlock the original token to the account specified by the user.

## Transaction Atomicity

- Token Protocol V1
  <br>In this version, any cross-chain transfer message will receive a reply from target chain. If the mapping Token is issued successfully at the target chain, the original token will be locked on the source chain, otherwise the source chain will return the original token to users.
  <br>So the transaction integrity of this version is strictly dependent on the transactions of the message bridge, and if the message bridge does not have a response process, the transaction atomicity of the asset bridge cannot be accomplished.
- Token Protocol V2
  <br>In this version, we have updated the transaction processing flow, if the issue of mapped assets on the target chain is successful, the transaction will end, if the issue fails, the user can get the issue failure proof to redeem the original token and complete the transaction.
  <br>So we no longer rely on the response result from the bridge messaging service and only need to get the message delivery failure proof in case of message delivery failure. This proof usually consists of two parts, a proof of message delivery and a proof of non-existence of message success.
  <br>Compared with V1 version, this version can adapt more bridge messaging services and save more cost on messaging services. However, an additional refund operation is required in the case of failure.
