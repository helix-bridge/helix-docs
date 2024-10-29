---
sidebar_position: 1
---

# Overview

Helixbox LnBridge(Liquidity Node Bridge) is a fully open-source, non-custodial and decentralized cross-chain asset bridge. It's built on top of common messaging bridges that already exist between chains, and provides secure, fast, and low-cost cross-chain functionality for users.

## Features

- **Secure**

  The protocol does not custody user assets, and there is no liquidity pool. During the transaction execution process, only the funds from uncompleted orders are temporarily locked in the protocol. These locked funds, referred to as in-flight assets, are relatively small in volume and have short lock-up periods. This approach makes the protocol safer in managing assets compared to custodial protocols.
  
  Helixbox LnBridge separates the underlying generic messages and the asset bridging, which helps to reduce risk.
  
  While its security does not entirely rely on generic messages, we take great care in selecting the generic message bridges we use. By combining the security of the generic message bridges with other security measures, we minimize the risk of security incidents.   
  
- **Fast**

  Additionally, Helixbox's Asset Cross-Chain Protocol can complete the cross-chain process in as little as 10 seconds to a minute, making it a fast and efficient option for users.  
  
- **Low Cost**

  The low cost of Helixbox's cross-chain process is due to its innovative design, which avoids the need for complex messaging bridges. Instead, simple interactions between the user and the contract allow for direct asset transfers, minimizing the cost of the process.  
  
- **Trustless**

  The Helixbox LnBridge protocol is trustless, meaning that users do not need to rely on any centralized system to exchange assets. Instead, the protocol relies on a variety of roles to ensure the safety and stable operation of the cross-chain process. This trustless design makes the protocol more secure and resilient to failure, as it does not depend on any single point of failure.  

