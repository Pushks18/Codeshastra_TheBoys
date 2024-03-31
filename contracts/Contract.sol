// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol"; 
 
contract CertifyToken is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
 
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _courseIdCounter;

    uint public threshold = 80;

    constructor() ERC721("CertifyToken", "CT") {}
 
    struct Course {
        uint courseId;
        address payable owner;
        uint price;
        string title;
        string description;
        string imageHash;
        string pdfHash;
        string certificateHash;
    }

    mapping(uint => Course) public Courses;
    mapping(uint => mapping(address => bool)) public enrolledStudents;
    mapping(uint => mapping(address => bool)) public completed;

    function createCertificate(uint256 courseId, string memory tokenURI, address receiver)
        public
        returns (uint256)
    {
        require(completed[courseId][receiver] != true, "Certificate already acquired");
        _tokenIdCounter.increment();
        uint256 newItemId = _tokenIdCounter.current();
        _safeMint(receiver, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function createCourse(uint price, string memory title, string memory description, string memory imageHash, string memory pdfHash, string memory certificateHash) public {
        require(price != 0 , "Invalid price");
        require(bytes(title).length > 0 , "Invalid title");
        _courseIdCounter.increment();

        uint256 newCourseId = _courseIdCounter.current();
        Course memory newCourse = Course(newCourseId, payable(msg.sender), price, title, description, imageHash, pdfHash, certificateHash);
        Courses[newCourseId] = newCourse;
    }

    function getCourseInfo(uint courseId) public view returns (Course memory) {
        return Courses[courseId];
    }

    function buyCourse(uint courseId) public payable {
        require(enrolledStudents[courseId][msg.sender] != true, "Already Bought");

        Course memory currentCourse = Courses[courseId];

        require(currentCourse.owner != msg.sender, "You are the owner!");
        // require(msg.value == currentCourse.price,"Not enough ether");

        payable(currentCourse.owner).transfer(currentCourse.price);
        enrolledStudents[courseId][msg.sender] = true;
    }

    function checkEnrollment(uint courseId) public view returns (bool) {
        return enrolledStudents[courseId][msg.sender];
    }

    function checkCompleted(uint courseId) public view returns (bool) {
        return completed[courseId][msg.sender];
    }

    function completedCourse(uint courseId, uint score, string memory tokenURI) public returns (bool) {
        require(score >= threshold, "Quiz Failed");
        require(completed[courseId][msg.sender] != true, "Already completed");
        createCertificate(courseId, tokenURI, msg.sender);
        completed[courseId][msg.sender] = true;
    }
    

    function _beforeTokenTransfer(
    address from, 
    address to, 
    uint256 tokenId
    ) internal override virtual {
        require(from == address(0), "Err: token transfer is BLOCKED");   
        super._beforeTokenTransfer(from, to, tokenId);  
    }

    function getAllCourses() public view returns(Course[] memory) {
      uint256 total = _courseIdCounter.current();
      uint256 currentIndex = 0;
      Course[] memory courses = new Course[](total);
      for(uint i=0;i<total;i++) {
          courses[currentIndex] = Courses[i+1]; 
          currentIndex+=1;
      }
      return courses;
    }

    function getMyCourses() public view returns(Course[] memory) {
      uint256 total = _courseIdCounter.current();
      uint256 count = 0;
      uint256 currentIndex = 0;

      for(uint i=1; i <= total;i++) {
        // Course memory course = Courses[i];
        if(enrolledStudents[i][msg.sender] == true) {
          count+=1;
        }
      }

      Course[] memory courses = new Course[](count);
      for(uint i=1;i<= total;i++) {
        if(enrolledStudents[i][msg.sender] == true) {
          courses[currentIndex] = Courses[i]; 
          currentIndex+=1;
        }
      }
      return courses;
    }

    function getUploadedCourses() public view returns(Course[] memory) {
      uint256 total = _courseIdCounter.current();
      uint256 count = 0;
      uint256 currentIndex = 0;

      for(uint i=1;i <= total;i++) {
        Course memory course = Courses[i];
        if(course.owner == msg.sender) {
          count+=1;
        }
      }

      Course[] memory courses = new Course[](count);
      for(uint i=1;i<=total;i++) {
        Course memory course = Courses[i];
        if(course.owner == msg.sender) {
          courses[currentIndex] = Courses[i]; 
          currentIndex+=1;
        }
      }

      return courses;
    }
}
