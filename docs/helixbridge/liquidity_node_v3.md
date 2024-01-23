---
group:
  title: 🔹 Protocol
  order: 2
order: 2
title: Liquidity Node(V3)
---

## Overview

In the v2 version of the Liquidity Node protocol, we introduced a collateral mechanism to safeguard user assets and effectively reduce the number of cross-chain message invocations, thereby lowering cross-chain fees. In this protocol, the collateral staked by the LnProvider determines the transfer limit for a single transaction in that direction. Therefore, to achieve better trading depth, LnProviders need to stake more collateral. However, as collateral cannot be shared across different directions, this results in increased collateral costs. Hence, the v2 protocol version is suitable for frequent small-value transactions.

To address this, we introduce a new protocol version, v3, which eliminates the need for collateral staking. When registering, LnProviders only need to stake a small amount of penalty reserve, ensuring the completion of message delivery by the LnProvider and imposing penalties when expectations are not met.

## Security Assumptions

1. We assume the existence of a secure and reliable general-purpose message channel for communication from the target chain to the source chain. This assumption guarantees the reliable transmission of messages from the target chain to the source chain, maintaining the integrity and confidentiality of the messages.
2. The source chain and the target chain's blocks utilize the same world clock or time synchronization mechanism. This assumption enables consistent timestamping and handling of time-sensitive events across both chains.

## Interaction

### LnProvider Registration

LnProvider stores its configuration information in the source chain and stakes a certain amount of penalty collateral, which can be shared in different path.

- Choose the supported source chain, target chain, and transfer token; register LnProvider; set transaction fees and transfer limits.
- Deposit penalty collateral on source chain.
- Run the relayer client.

### Cross-Chain Tranfer

- Users select the direction for token cross-chain and specify LnProvider to initiate cross-chain transactions in the source chain.
- Users lock tokens, fees, and a single LnProvider penalty collateral in the source chain.
- LnProvider monitors the transfer event, completes the transaction on the target chain, transfers tokens to the user's specified account, and generates a transfer proof.
- If the third step is not completed, until a timeout, the Slasher on the target chain transfers tokens to the user and sends a reverse message to the source chain, extracting the locked assets from the second step.

:::info{title=Slasher}
Slasher does not need to register; any account, including the user themselves, is considered a Slasher as long as it completes the fourth step.
Slasher plays a crucial role throughout the entire cross-chain transaction cycle and assists in concluding transactions when LnProvider is not functioning.
:::

### Liquidity Withdraw

Upon normal transaction completion, liquidity for each transaction is locked in the source chain.
LnProvider needs to send a generic message from the target chain to the source chain to extract liquidity.
LnProvider can choose to extract liquidity from multiple transactions simultaneously to significantly reduce cross-chain message costs. However, accumulating too many transactions may result in high gas fees upon execution and excessive message accumulation, occupying liquidity costs. Therefore, LnProvider needs to appropriately choose the number of transactions to batch extract liquidity.
