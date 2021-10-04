pragma solidity ^0.5.0;

contract BackupHashStorage {
	uint public backupsCount = 0;

	constructor() public {
		addHashToBlochain('tempHash','tempPath');
	}

	struct HashMeta {
		uint id;
		string contentsHash;
		string absoluteFolderPath;
		uint256 timestamp;
	}

	mapping (uint => HashMeta) public hashes;

	function addHashToBlochain(string memory _contentsHash,string memory _absoluteFolderPath) public {
		backupsCount++;
		hashes[backupsCount] = HashMeta(backupsCount, _contentsHash, _absoluteFolderPath, now);
	}
}