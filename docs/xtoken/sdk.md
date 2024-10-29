---
sidebar_position: 4
sidebar_label: SDK
---

# SDK

Assets not issued via XToken are considered native assets. Conversely, assets issued through XToken, backed by native assets, are referred to as mapped assets. Typically, mapped assets have a symbol starting with the letter "x," although exceptions exist, such as mapped assets defined by the issuer. Hereafter, we will refer to the chain where native assets reside as the ***source chain***, and the chain where mapped assets reside as the ***target chain***.

When a user needs to lock native assets and issue mapped assets on the ***target chain***, they must call the Backing contract interface on the ***source chain***. This process is called ***Lock-and-Issue.***

When a user needs to burn mapped assets and redeem native assets on the source chain, they must call the Issuing contract interface on the ***target chain***. This process is called ***Burn-and-Redeem***.

If the ***Lock-and-Issue*** process fails on the target chain, the user must call the Issuing contract interface on the target chain to roll back and retrieve the locked native assets.
If the ***Burn-and-Redeem*** process fails on the source chain, the user must call the Backing contract interface on the source chain to roll back and retrieve the mapped assets.

## **Lock-and-Issue (Executed on the Backing Contract)**

```solidity
function lockAndXIssue(
    uint256 _remoteChainId,
    address _originalToken,
    address _recipient,
    address _rollbackAccount,
    uint256 _amount,
    uint256 _nonce,
    bytes calldata _extData,
    bytes memory _extParams
) external payable returns(bytes32 transferId);
```

- **`_originalToken`**: Address of the native asset
- **`_recipient`**: Address of the receiving account
- **`_rollbackAccount`**: Address authorized to roll back the transaction in case of failure
- **`_amount`**: Amount to transfer
- **`_nonce`**: Transaction nonce, typically set to the current timestamp
- **`_extData`**: Additional data
    - **Explanation of _extData**
        
        XToken introduces a level of flexibility on the receiving end of the target chain through custom extensions. This allows users to invoke custom contract interfaces while receiving mapped assets, enabling them to perform subsequent operations.
        
        When **`_recipient`** is a contract address that implements the interface defined in [this file](https://github.com/helix-bridge/xtoken-monorepo/blob/main/packages/xtoken-contract/contracts/interfaces/IXTokenCallback.sol), the issuing contract will first transfer the mapped assets to **`_recipient`** and then call the **`xTokenCallback`** interface. The **`_extData`** is passed directly to **`xTokenCallback`**. For instance, [this contract](https://github.com/helix-bridge/xtoken-monorepo/blob/main/packages/xtoken-contract/contracts/templates/WTokenConvertor.sol) **`WTokenConvertor`** implements **`IXTokenCallback`**. When the user specifies **`_recipient`** as the address of this **`WTokenConvertor`** contract, they need to set **`_extData`** to the address of the final token recipient. This ensures that after **`WTokenConvertor`** unwraps the wtoken into native tokens, it transfers them to the actual recipient account.
        
- **`_extParams`**: Underlying messaging layer parameters
    
    This parameter varies depending on the underlying messaging service being used. For instance, if the underlying service is the Darwinia Msgport, the parameter needs to be obtained by calling the Msgport API available [here](https://msgport-api.darwinia.network/).
    

## **Lock-and-Issue Rollback (Executed on the Issuing Contract)**

```solidity
function xRollbackLockAndXIssue(
    uint256 _originalChainId,
    address _originalToken,
    address _originalSender,
    address _recipient,
    address _rollbackAccount,
    uint256 _amount,
    uint256 _nonce,
    bytes memory _extParams
) external payable;
```

- **`_originalChainId`**: Chain ID of the source chain
- Other parameters are consistent with those in the Lock-and-Issue process

## **Burn-and-Redeem (Executed on the Issuing Contract)**

```solidity
function burnAndXUnlock(
    address _xToken,
    address _recipient,
    address _rollbackAccount,
    uint256 _amount,
    uint256 _nonce,
    bytes calldata _extData,
    bytes memory _extParams
) external payable returns(bytes32 transferId);
```

- **`_xToken`**: Address of the mapped asset
- **`_recipient`**: Address of the receiving account
- **`_rollbackAccount`**: Address authorized to roll back the transaction in case of failure
- **`_amount`**: Amount to transfer
- **`_nonce`**: Transaction nonce, typically set to the current timestamp
- **`_extData`**: Additional data
- **`_extParams`**: Underlying messaging layer parameters

## **Burn-and-Redeem Rollback (Executed on the Backing Contract)**

```solidity
function xRollbackBurnAndXUnlock(
    uint256 _remoteChainId,
    address _originalToken,
    address _originalSender,
    address _recipient,
    address _rollbackAccount,
    uint256 _amount,
    uint256 _nonce,
    bytes memory _extParams
) external payable;
```

- **`_remoteChainId`**: Chain ID of the target chain
- Other parameters are consistent with those in the Burn-and-Redeem process
