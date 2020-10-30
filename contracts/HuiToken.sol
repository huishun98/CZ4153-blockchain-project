pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HuiToken is ERC20 {
    address private owner;

    constructor() public ERC20("HuiToken", "Hui") {
        _mint(msg.sender, 100 * (10 ** uint256(decimals())));
        owner = msg.sender;
    }

    function burnTokens(uint amount) external {
        _burn(msg.sender, amount);
    }

    function getTokenOwner() public view returns (address){ 
        return owner;
    }

}
