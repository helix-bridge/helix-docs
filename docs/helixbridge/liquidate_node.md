---
group:
  title: 🔹 Protocol
  order: 2
order: 2
---

## Overview

The protocol described here is used when tokens are issued on both the source chain and the target chain, and their exchange values are equal.

It establishes a liquidity provider role called "LnProvider" (Liquidity Node Provider). When a user performs a cross-chain transfer, they transfer tokens to the LnProvider account on the source chain, and the LnProvider transfers an equivalent amount of tokens to the user on the target chain.

During this process, the asset token undergoes the following transfer 👇

- Source Chain: User → LnProvider
- Target Chain: LnProvider → User

The user incurs a certain fee for executing the cross-chain transfer, and the LnProvider earns a fee for providing liquidity. This process bypasses the need for underlying bridge messages to complete the asset cross-chain transfer if the LnProvider executes according to the agreement.

According to the protocol, when a market-making role (LnProvider) registers, it must stake a certain amount of collateral as a guarantee to ensure the safety of user assets during the cross-chain process. When a user initiates a cross-chain transfer, the asset is transferred to the LnProvider account, and an equivalent amount of collateral is locked. Once the cross-chain is successful, the user receives the asset on the target chain, and the collateral is released. The locking of collateral occurs on the source chain, while the release happens on the target chain, and both processes produce proofs on their respective chains. Under normal circumstances, bridge messages are not necessary to relate these processes. However, bridge messages are still needed to monitor the execution process.

If, for instance, a user initiates a transfer, generating a transfer proof (or collateral lock proof), but the LnProvider fails to transfer tokens to the user on the target chain to complete the cross-chain process, there are two compensation methods:

- Bridge message channel is from the target chain to the source chain, and the collateral is on the source chain:
  <br>The user sends the proof that the LnProvider did not transfer the tokens on the target chain through the bridge message to the source chain. The source chain combines this proof with the transfer proof and extracts collateral from the LnProvider to compensate the user.

- Bridge message channel is from the source chain to the target chain (preferably):
  <br>The user sends the transfer proof through the bridge message to the target chain. On the target chain, the proof is combined with the evidence that the LnProvider did not transfer the tokens, and the LnProvider's collateral is extracted to compensate the user.

Either of the above methods is used to ensure the security of the user's assets during the process. The choice between them depends on the direction of the bridge message. For regular users, dealing with such exceptional situations may increase complexity and reduce user experience. To address this, another role called "slasher" is introduced to help users complete the above process.

The slasher role monitors the LnProvider's status and, if the LnProvider fails to work, helps the user handle the exception and eventually extracts the collateral and penalty from the LnProvider using the message channel.

This article also provides explanations for various terms and their meanings, as well as details about the message channel processes for both directions (source chain to target chain and target chain to source chain). It also describes the security assumptions and sequencing requirements for the execution of cross-chain transactions.

## Key terms

- **LnProvider (Liquidity Node Provider)**
  <br>The entity consists of an account that exists simultaneously on both the source chain and the target chain, along with a client program. On the source chain, this account is used to receive assets from users initiating cross-chain transfers. On the target chain, the same account is responsible for paying out assets to users who have completed cross-chain transfers. Additionally, the account is registered with the asset bridge and pledges a certain amount of collateral. The client program monitors user transfer events and automatically transfers tokens from the account on the target chain to the user's account, completing the cross-chain process.
- **Slasher**
  <br>The role is responsible for monitoring LnProviders and, in case an LnProvider fails to function properly, helping users complete transactions under exceptional circumstances. Eventually, the role utilizes the message channel to extract the LnProvider's pledged collateral and penalties.
- **Pledged Collateral**
  <br>The LnProvider pledges collateral to the protocol, and this collateral remains constant regardless of user transfers. The pledged collateral only changes in two situations: when the slasher handles exceptions or when the LnProvider adds or withdraws collateral.
- **Available Collateral**
  <br>The available collateral is equal to the pledged collateral minus the collateral occupied by pending transactions. This part of the collateral changes as the status of user cross-chain transactions changes. When a user initiates a transaction, a certain amount of collateral is reserved, reducing the available collateral. Once the transaction is confirmed by LnProvider, the available collateral increases.

## TransferId

- **Definition**
  :::info{title=TransferId}
  TransferId = Hash(params，lastTransferId)
  :::
  The lastTransferId of the first transaction is 0, and for the k-th transaction, the lastTransferId is the transferId of the (k-1)th transaction.
  "params" refers to the specific parameters of the cross-chain transfer, including token address, quantity, LnProvider, receiver, etc.
- **Uniqueness**
  <br>The storage will keep the latest TransferId and mark it as lastTransferId. After each transaction is completed, the lastTransferId cursor is updated to the most recent TransferId. This Id will be used as a hash parameter for calculating the TransferId of the next transaction, ensuring that each transaction's TransferId is unique and different from others.
- **Ordering**
  <br>In each transaction, the Hash parameter includes the TransferId of the previous transaction, ensuring the sequencing of transactions.

## Type1 (Opposite)

The generical message is also from target chain to source chain. For this scenario we implement the following asset bridge cross-chain protocol.

### Safety Assumptions

1. There exists a secure and reliable general-purpose message channel for communication from the target chain to the source chain. This assumption ensures that messages can be reliably transmitted from the target chain to the source chain, and the integrity and confidentiality of the messages are maintained.

2. The source chain and the target chain's blocks use the same world clock or time synchronization mechanism. This assumption allows for consistent timestamping and handling of time-sensitive events across both chains.

### Interaction Process

- **LnProvider Registration**
  <br>LnProvider registration refers to the process in which a Liquidity Node Provider (LnProvider) registers in the cross-chain asset transfer protocol. During this process, the LnProvider becomes a part of the protocol and assumes a role in facilitating cross-chain transfers. The main steps of LnProvider registration are as follows:

1. Selection of Supported Tokens: The LnProvider needs to choose the tokens supported by the protocol for cross-chain transfers. These tokens should exist in the accounts on both the source and target chains.
2. Pledge of Collateral: The LnProvider needs to register with the asset bridge and pledge a certain amount of tokens in the accounts on the source and target chains as collateral. The collateral serves to ensure the security of user assets during cross-chain transfers and serves as evidence of the LnProvider's commitment to participating in cross-chain transfers.
3. Setting Transaction Fees: The LnProvider needs to set the transaction fees charged during cross-chain transfers. These fees can be used to compensate for the gas fees paid by the LnProvider on the target chain and cover the cost of providing the service.
4. Registration as LnProvider: The LnProvider completes the registration process by calling the interface on the source chain, submitting the pledged collateral, and setting the transaction fees. After successful registration, the LnProvider becomes a part of the protocol and can offer cross-chain asset transfer services.
5. Running Client Program: After registration, the LnProvider runs a client program, which is used to monitor user's cross-chain transfer requests and automatically execute the transfer transactions.

Through the steps mentioned above, the LnProvider completes the registration process in the cross-chain asset transfer protocol, becoming a liquidity provider eligible to participate in asset transfers, and offering cross-chain transfer services to users. Additionally, the collateral pledged by the LnProvider ensures the security of user assets.

- **Transfer**

1. Users select the token they want to transfer cross-chain, specify the quantity, and designate the LnProvider (the LnProvider can be chosen by a third party on behalf of the user).

2. They fetch the current latest state from the blockchain, based on which they take a snapshot of the state (snapshot). They then check the available collateral amount of the LnProvider. If the collateral is insufficient, the cross-chain transfer operation will not be executed.

3. If there is sufficient collateral, they proceed to call the on-chain interface for executing the transfer, while carrying the snapshot parameters.

4. The blockchain verifies the snapshot. If the on-chain state has expired, the transfer fails. Otherwise, the user's assets will be transferred to the LnProvider, and a transfer proof will be generated.

5. The LnProvider monitors the event, and on the target chain, transfers the tokens to the user's account, generates a transfer proof, and completes the transaction.

:::warning{title="Exception Monitoring"}
In step 5 of the cross-chain asset transfer process, a timeout period is set, and the LnProvider is required to complete the transfer within this time limit. If the LnProvider fails to do so, the slasher can take the following actions:

1. On the target chain, the `Slasher` will transfer tokens from its own account to the user's account to cover the transaction (this is known as "slash and cover"), and generate a transfer proof.

2. The `Slasher` will then send this transfer proof to the source chain through the underlying bridge messaging system. Upon receiving the message, the source chain will verify the transaction. If the verification is successful, the source chain will extract the `LnProvider's` collateral to compensate the slasher for covering the assets and to impose a penalty on the `LnProvider`.

3. The determination of whether the transfer is within the timeout period is based on comparing the time when the user sends the transaction (the timestamp of the block on the source chain where the transaction is included) with the current time on the target chain. The synchronization of clocks between the two chains is ensured by the safety assumptions, allowing the timeout time to be effective within a certain error range.

4. This mechanism ensures that the `LnProvider` fulfills its responsibility to complete the transfer within the specified time, and in the event of a failure, the slasher steps in to cover the assets and initiate penalties, thus maintaining the security and reliability of the cross-chain asset transfer protocol.
   :::

### Ordering

- Any cross-chain transaction on the target chain must either be successfully executed or be subject to a "slash" operation.

- Before the timeout period expires, the "slash" operation cannot be executed.

- For any cross-chain transaction executed on the target chain, it must be completed after the execution of the preceding transaction.

- When validating a "slash" transaction on the source chain, it must be ensured that all preceding transactions have not been subjected to a "slash" operation, or if any "slash" operations were applied, they have all been executed and completed.

The above content describes how to ensure the execution order in the cross-chain asset transfer protocol, ensuring that before any transaction is completed, all preceding transaction transactions have been completed. This sequencing mechanism effectively prevents malicious withdrawal of the collateral occupied by previous transactions, ensuring that when users send cross-chain transfer transactions, they only need to be concerned about whether LnProvider has sufficient available collateral before the transaction is completed.

The specific implementation of maintaining the sequence is as follows:

1. Set SId(1) to a certain initial value, indicating that there were no slash transactions before the first transaction.

2. For each transaction (the k-th transaction) on the target chain, check if the previous transaction (the (k-1)-th transaction) has been sent and further determine whether it has been slashed. Based on the status of the previous transaction, determine the closest slash transaction Id (SId(k)) before the k-th transaction.

3. If the previous transaction is a slash transaction, meaning that the (k-1)-th transaction has been subject to a slash operation, then SId(k) = Id(k-1), which means that SId(k) for the k-th transaction is set to the Id(k-1) of the (k-1)-th transaction.

4. If the previous transaction is not a slash transaction, meaning that the (k-1)-th transaction was normally executed by LnProvider, then SId(k) = SId(k-1), which means that SId(k) for the k-th transaction is set to the SId(k-1) of the (k-1)-th transaction.

By following this approach, when sending the slash transaction Id(k) from the target chain to the source chain, the information of SId(k) is included. The source chain, when validating the slash transaction, verifies whether SId(k) has been completed, ensuring that the execution process of the k-th transaction is correctly ordered. This sequencing mechanism effectively prevents transactions from being maliciously tampered with or prematurely executed, ensuring the security and reliability of the transactions.

## Type2 (Default)

The generical message is also from source chain to target chain. For this scenario we implement the following asset bridge cross-chain protocol.

### Safety Assumptions

1. There exists a secure and reliable general-purpose message channel for communication from the source chain to the target chain. This assumption ensures that messages can be reliably transmitted from source chain to target chain, and the integrity and confidentiality of the messages are maintained.

2. The source chain and the target chain's blocks use the same world clock or time synchronization mechanism. This assumption allows for consistent timestamping and handling of time-sensitive events across both chains.

### Interaction Process

The basic interaction process is similar to the message channel from the target chain to the source chain, with the following differences:

- LnProvider's collateral is pledged on the target chain.
- When the slasher executes a slash operation, it initiates a transaction from the source chain to the target chain and does not need to advance tokens to the user.
- If the provider delivers after the timeout, a portion of its collateral will be deducted as a penalty, which will be used to compensate the slasher for the cross-chain fees incurred during the slash operation.
- When the slash message arrives at the target chain, it checks whether the transaction needs to be slashed in the following scenarios:

:::info{title="Slash Scenarios"}

1. If the cross-chain transaction is not timed out, the slash operation is invalid and not executed.
2. If the cross-chain transaction is timed out and has already been slashed, the slash operation is invalid and not executed.
3. If the cross-chain transaction is timed out and has not been delivered, the slash operation is valid. The slasher receives fees and penalty assets, while the user receives transferred assets.
4. If the cross-chain transaction is timed out and LnProvider delivered before the timeout, the slash operation is invalid and not executed.
5. If the cross-chain transaction is timed out and LnProvider delivered after the timeout, the slash operation is partially valid. The slasher can receive a portion of the penalty assets to compensate for gas and bridge fees incurred by the user.
   :::

### Ordering

The requirement is that any transaction on the target chain must have its preceding transaction completed before the transaction itself is finalized. Transaction completion can be achieved through LnProvider's normal delivery or the slasher's slash operation.

This requirement ensures that before a transaction undergoes a slash operation, its observed snapshot of collateral cannot be maliciously extracted by subsequent transactions.

Additionally, we demand that LnProvider includes the state of the extraction into the snapshot when withdrawing collateral. At the time of extraction, all transactions prior to that state must have been executed, ensuring that the available collateral does not decrease during the period from the initiation of the cross-chain transaction to its execution on the target chain.
