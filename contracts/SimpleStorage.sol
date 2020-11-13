// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.8.0;

contract SimpleStorage {
  struct Person{
    string name;
    uint age;
    uint pos;
  }

  Person[] private persons;

  function set(string memory _name,uint _age) public {
    persons.push(Person(_name,_age,persons.length));
  }

  function get(uint _current_pos,string memory _name) public view returns (string memory,uint,uint){
    if(_current_pos == persons.length) return ('end_of_array', 0, persons.length);

    for(uint i=_current_pos;i<=persons.length;++i){
      if(keccak256(abi.encodePacked(persons[i].name)) == keccak256(abi.encodePacked(_name))){
        return (persons[i].name, persons[i].age, persons[i].pos);
      }else if(i == persons.length){
        return ('end_of_array', 0, persons.length);
      }
    }
  }

  function get_all(uint _pos) public view returns(string memory,uint,uint){
      return (persons[_pos].name, persons[_pos].age,persons[_pos].pos);
  }

  function getlength() public view returns (uint){
    return persons.length;
  }
}