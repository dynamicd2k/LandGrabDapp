// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistry {
    struct Land {
        address owner;
        uint256 timestamp;
    }

    mapping(string => Land) public lands;
    mapping(address => uint256) public balances;
    mapping(address => string[]) private userLandList;

    event LandClaimed(address indexed user, string w3wAddress);
    event LandReleased(address indexed user, string w3wAddress);
    event LandSwapped(address indexed user1, string w3wAddress1, address indexed user2, string w3wAddress2);
    event LandCaptured(address indexed user, string w3wAddress);
    event UserDeleted(address indexed user);

    modifier onlyOwner(string memory _w3wAddress) {
        require(lands[_w3wAddress].owner == msg.sender, "Not the owner");
        _;
    }

    function claimLand(string memory _w3wAddress) external {
        require(lands[_w3wAddress].owner == address(0), "Land already claimed");

        lands[_w3wAddress] = Land({owner: msg.sender, timestamp: block.timestamp});
        balances[msg.sender]++;
        userLandList[msg.sender].push(_w3wAddress);
        emit LandClaimed(msg.sender, _w3wAddress);
    }

    function releaseLand(string memory _w3wAddress,address _user) public onlyOwner(_w3wAddress) {
        delete lands[_w3wAddress];
        balances[_user]--;

        // Remove from userLandList
        string[] storage userLands = userLandList[_user];
        for (uint i = 0; i < userLands.length; i++) {
            if (keccak256(bytes(userLands[i])) == keccak256(bytes(_w3wAddress))) {
                userLands[i] = userLands[userLands.length - 1];
                userLands.pop();
                break;
            }
        }

        emit LandReleased(_user, _w3wAddress);
    }

    function swapLand(
        string memory _myW3WAddress,
        address _otherUser,
        string memory _theirW3WAddress
    ) external onlyOwner(_myW3WAddress) {
        require(lands[_theirW3WAddress].owner == _otherUser, "Other user does not own specified land");

        lands[_theirW3WAddress].owner = msg.sender;
        lands[_myW3WAddress].owner = _otherUser;

        _updateUserLandList(msg.sender, _myW3WAddress, _theirW3WAddress);
        _updateUserLandList(_otherUser, _theirW3WAddress, _myW3WAddress);

        emit LandSwapped(msg.sender, _myW3WAddress, _otherUser, _theirW3WAddress);
    }

    function forceCapture(string memory _w3wAddress, string[] memory _surroundingW3WAddresses) external {
        require(lands[_w3wAddress].owner != msg.sender, "Already owned");
        require(lands[_w3wAddress].owner != address(0), "Target land is unclaimed");

        for (uint i = 0; i < _surroundingW3WAddresses.length; i++) {
            require(lands[_surroundingW3WAddresses[i]].owner == msg.sender, "Do not own all surrounding lands");
        }

        address previousOwner = lands[_w3wAddress].owner;
        lands[_w3wAddress].owner = msg.sender;

        balances[previousOwner]--;
        balances[msg.sender]++;
        _removeLandFromUser(previousOwner, _w3wAddress);
        userLandList[msg.sender].push(_w3wAddress);

        emit LandCaptured(msg.sender, _w3wAddress);
    }

    function deleteUser(address _user) external {
        // require(msg.sender == _user, "Only user can delete themselves");
        string[] storage userLands = userLandList[_user];

        for (uint i = userLands.length; i > 0; i--) {
            string memory landId = userLands[i - 1];
            delete lands[landId];
            emit LandReleased(_user, landId);
        }

        delete userLandList[_user];
        delete balances[_user];
        emit UserDeleted(_user);
    }

    function _updateUserLandList(address user, string memory oldLand, string memory newLand) internal {
        string[] storage userLands = userLandList[user];
        for (uint i = 0; i < userLands.length; i++) {
            if (keccak256(bytes(userLands[i])) == keccak256(bytes(oldLand))) {
                userLands[i] = newLand;
                return;
            }
        }
        userLands.push(newLand);
    }

    function _removeLandFromUser(address user, string memory landId) internal {
        string[] storage landsList = userLandList[user];
        for (uint i = 0; i < landsList.length; i++) {
            if (keccak256(bytes(landsList[i])) == keccak256(bytes(landId))) {
                landsList[i] = landsList[landsList.length - 1];
                landsList.pop();
                return;
            }
        }
    }

    // View Functions
    function getLandOwner(string memory _w3wAddress) external view returns (address) {
        return lands[_w3wAddress].owner;
    }

    function getLandTimestamp(string memory _w3wAddress) external view returns (uint256) {
        return lands[_w3wAddress].timestamp;
    }

    function getUserBalance(address _user) external view returns (uint256) {
        return balances[_user];
    }

    function isLandClaimed(string memory _w3wAddress) external view returns (bool) {
        return lands[_w3wAddress].owner != address(0);
    }

    function getUserLands(address _user) external view returns (string[] memory) {
        return userLandList[_user];
    }
}
