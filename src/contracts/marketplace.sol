// SPDX-License-Identifier: MIT
pragma solidity >= 0.5.0 <0.9.0;

contract Marketplace {
    
    string public name;
    uint public product_count;
    mapping (uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }
    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );
    event ProductPurchase(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Rohit Market place product";
    }

    function createProduct(string memory _name, uint _price ) public {
        // make sure parameter is correct
        require(bytes(_name).length > 0);
        require(_price > 0);
        // increment product count 
        product_count ++;
        //creat a product 
        products[product_count] = Product(product_count,_name , _price, msg.sender , false);
        //trigger a event 
        emit ProductCreated(product_count, _name , _price, msg.sender , false);
    }

    function PurchaseProduct(uint _id) public payable {
        //fetch product
        Product memory _product = products[_id];
        //featch owner
        address  payable _seller = _product.owner;
        //make sure product is valid
        require(_product.id > 0  && _product.id <= product_count);
        // product amount have a buyer have checked 
        require(msg.value >= _product.price);
        //check the product dones not sell
        require(!_product.purchased);
        //check the buyer is not seller 
        require(_seller !=msg.sender);
        // trasfer owneship to buyer    
        _product.owner =  msg.sender;
        //make sure product is valid
        _product.purchased = true ;
        //update the product
        products[_id] = _product;
        //pay ether to seller
        address(_seller).transfer(msg.value);
        //tigger event  
        emit ProductPurchase(product_count, _product.name , _product.price, msg.sender , true);
    }
}