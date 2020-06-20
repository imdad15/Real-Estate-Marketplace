pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./Verifier.sol";

contract SolnSquareVerifier is CustomERC721Token {
    Verifier verifier;

    struct Solution{
        uint256 index;
        address sender;
    }

    Solution[] solutions;
    mapping(bytes32 => Solution) uniqueSolutions;
    uint256 counter = 0;

    event SolutionAdded(bytes32 key, address sender);

    constructor(string memory name, string memory symbol) CustomERC721Token(name, symbol) public {
        verifier = new Verifier();
    }
    //, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/") public {}

    /**
     * @dev function to add the solutions to the array and emit the event
     */
    function addSolution(
                            uint[2] memory a,
                            uint[2][2] memory b,
                            uint[2] memory c,
                            uint[2] memory input
                        )
    public {
        bytes32 key = keccak256(abi.encodePacked(a,b,c,input));
        require(uniqueSolutions[key].sender==address(0), "Solution is not unique");
        counter = counter + 1;
        uniqueSolutions[key] = Solution({index: counter, sender: msg.sender});

        emit SolutionAdded(key, msg.sender);
    }

    /**
     * @dev function to mint new NFT only after the solution has been verified
     */
    function verifiedMint(
                            address to,
                            uint256 tokenId,
                            uint[2] memory a,
                            uint[2][2] memory b,
                            uint[2] memory c,
                            uint[2] memory input
                        )
    public returns (bool) {
        require((verifier.verifyTx(a, b, c, input)), "Verification failed");
        addSolution(a, b, c, input);
        super.mint(to, tokenId);
    }
}























