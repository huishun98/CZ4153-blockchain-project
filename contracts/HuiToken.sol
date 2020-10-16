pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HuiToken is ERC20 {
    address private _owner;

    constructor() public ERC20("HuiToken", "Hui") {
        _mint(msg.sender, 1000 * (10 ** uint256(decimals())));

    }

    function burnAllRemaining() external {
        require(msg.sender == _owner, "burner is not owner of the this token");
        _burn(msg.sender, 0);
    }

}
