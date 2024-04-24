---
sidebar_position: 3
---

# Fee

The fee structure consists of two components: a base fee to cover the gas fees incurred by the LnProvider when executing transactions on the target chain and a liquidity fee designed to compensate the LnProvider for the loss of liquidity.

1. Base Fee

   The base fee is determined and set by the LnProvider, remaining a fixed value until the LnProvider updates it. Users are required to pay this fee to the LnProvider at the time they initiate the transfer.

2. Liquidity Fee

   Similar to the base fee, the liquidity fee is also determined by the LnProvider. However, this fee is directly related to the amount of the transfer initiated by the user. As the transfer amount increases, the corresponding fee also increases.

Assuming the user's transfer quantity is denoted as "Amount," the base fee as "BaseFee," and the liquidity rate as "LiquidityRate," then the total fee for the transfer can be calculated as follows:

```
TotalFee = BaseFee + Amount * LiquidityRate
```

It's important to note that these fees are separate from the actual transfer and need to be accounted for by users. Users should set aside a portion of the token to cover the cross-chain fees. LnProvider registration is permission-less, and their fee is freely configurable. Helix's backend system will gather information from various LnProviders and choose the most suitable one for users based on their preferences. For instance, an LnProvider with a lower fee will have a higher chance of being recommended by the system.
