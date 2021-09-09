pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;
import "./SquareVerifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token, SquareVerifier {
    // TODO define a solutions struct that can hold an index & an address
    struct solutions {
        uint256 index;
        address addr;
    }

    // TODO define an array of the above struct
    solutions[] private solutionArray;

   

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => bool)  uniqueSolution;

    // TODO Create an event to emit when a solution is added
    event solutionAdded(uint256 index, address owner);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution() external {
          uint256 len=solutionArray.length;
          solutionArray.push(solutions({index:len,addr:msg.sender}));
          emit  solutionAdded(len,msg.sender);
    }
    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNewNFT(
        uint256 index,
        Proof calldata proof,
        uint256[2] calldata input,
        address to,
        uint256 tokenId
    ) external {
        bytes32 key=keccak256(abi.encode(proof, input));
        require(solutionArray[index].addr == msg.sender,"incorrect caller");
        require(!uniqueSolution[key],"solution is used before");
        require(verifyTx(proof,input),"solution is not correct");
        uniqueSolution[key]=true;
        mint(to,tokenId);
    }
}
