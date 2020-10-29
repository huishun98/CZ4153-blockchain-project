pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HuiToken is ERC20 {
    address private owner;

    constructor() public ERC20("HuiToken", "Hui") {
        _mint(msg.sender, 100 * (10 ** uint256(decimals())));
        owner = msg.sender;
    }

    function burnAllRemaining() external {
        require(msg.sender == owner, "burner is not owner of the this token");
        _burn(msg.sender, 0);
    }

    function getTokenOwner() public view returns (address){ 
        return owner;
    }

}
