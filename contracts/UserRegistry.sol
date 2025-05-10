// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LandRegistry.sol";

contract UserManager {
    LandRegistry public immutable landRegistry;

    mapping(address => bool) private registeredUsers;

    event UserRegistered(address indexed user);
    event UserDeleted(address indexed user);

    constructor(address _landRegistry) {
        require(_landRegistry != address(0), "Invalid LandRegistry address");
        landRegistry = LandRegistry(_landRegistry);
    }

    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    function registerUser() external {
        require(!registeredUsers[msg.sender], "Already registered");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    function deleteUser(address _user) external onlyRegistered {
        // Ensure the user exists before attempting to delete
        require(registeredUsers[_user], "User not registered");
        registeredUsers[_user] = false;
        
        // Get all the lands the user owns
        landRegistry.deleteUser(_user);

        //string[] memory userLands = landRegistry.getUserLands(_user);
        // uint256 landCount = userLands.length;
        // Release all lands
        // for (uint256 i = 0; i < landCount; ) {
        //     string memory w3wName = userLands[i];
        //     landRegistry.releaseLand(w3wName);
        //     unchecked {
        //         ++i;
        //     } // Gas optimization
        // }

        emit UserDeleted(msg.sender);
    }

    /// @notice Check if an address is a registered user
    function isRegistered(address _user) external view returns (bool) {
        return registeredUsers[_user];
    }

    /// @notice Returns the caller's registration status
    function amIRegistered() external view returns (bool) {
        return registeredUsers[msg.sender];
    }
    function viewUserLands(
        address _user
    ) external view returns (string[] memory) {
        return landRegistry.getUserLands(_user);
    }
}
