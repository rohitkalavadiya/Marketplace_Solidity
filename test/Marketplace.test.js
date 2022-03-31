const Marketplace = artifacts.require('./marketplace.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract ('Marketplace',( [deployer , seller , buyer])=>{
let marketplace

    before (async() =>{

     marketplace = await Marketplace.deployed()
    })
    describe('deployment', async()=>{
         it('deploys succesfully', async()=>{
            const address = await  marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async()=>{
            const name = await marketplace.name();
            assert.notEqual(name, 'Rohit Market place worked')
        })
    })

    describe('products', async()=>{
        let result , product_count
        before(async ()=>{
            result = await marketplace.createProduct('samsung m30s', web3.utils.toWei('1','Ether'),{from:seller })
            product_count = await marketplace.product_count()
           }) 
      it('creates products', async ()=>{
        //assert.equal(productCount, 1)
        assert.equal(product_count,1)
         // check the log
       const event = result.logs[0].args
       assert.equal(event.id.toNumber(), product_count.toNumber(), ' id is correct')
       assert.equal(event.name, 'samsung m30s ', ' name is correct')
       assert.equal(event.price, '1000000000000000000' ,' Price is correct')
       assert.equal(event.owner, seller , ' Owner is correct')
       assert.equal(event.purchased, false ,  ' purchased is correct')

      //  const event = result.logs[0].args
      //  assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      //  assert.equal(event.name, 'iPhone X', 'name is correct')
      //  assert.equal(event.price, '1000000000000000000', 'price is correct')
      //  assert.equal(event.owner, seller, 'owner is correct')
      //  assert.equal(event.purchased, false, 'purchased is correct')

      // // FAILURE: Product must have a name
      // await await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
      // // FAILURE: Product must have a price
      // await await marketplace.createProduct('iPhone X', 0, { from: seller }).should.be.rejected;

      await await marketplace.createProduct('', web3.utils.toWei('1','Ether'),{ from: seller }).shoud.be.rejected;
      await await marketplace.createProduct('samsung m30s', 0 , { from : seller }).shoud.be.rejected;

       })

      it('List products ', async ()=>{
       const product = await marketplace.products(product_count)
        assert.equal(product.id.toNumber(), product_count.toNumber(), 'id is correct')
        assert.equal(product.name, 'samsung m30s ', 'name is correct')
        assert.equal(product.price, '1000000000000000000' ,'Price is correct')
        assert.equal(product.owner, seller , ' Owner is correct')
        assert.equal(product.purchased, false ,  'purchased is correct')
      })

      it('selles products ', async ()=>{
        //treack seller balance before the purchase
        let oldSellerBalance 
        oldSellerBalance = await web3.eth.getBalance();
        oldSellerBalance = new web3.utils.BN(oldSellerBalance)

        result = await marketplace.purchaseProduct(product_count,{from: buyer , value: web3.utils.toWei('1','Ether')})
        // check the log
        const event = result.log[0].args
       assert.equal(event.id.toNumber(), product_count.toNumber(), 'id is correct')
       assert.equal(event.name, 'samsung m30s ', 'name is correct')
       assert.equal(event.price, '1000000000000000000' ,'Price is correct')
       assert.equal(event.owner, buyer , 'Owner is correct')
       assert.equal(event.purchased, true ,  'purchased is correct')

       //check the fund
       let newSellerBalance 
       newSellerBalance = await web3.eth.getBalance();
       newSellerBalance = new web3.utils.BN(newSellerBalance)

       let price
       price = web3.utils.toWei('1','Ether')
       price = new web3.utils.BN(price)

       const exepectedBalance = oldSellerBalance.add(price)

       assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

        //faliure 
        await marketplace.purchaseProduct(99, {from: buyer , value: web3.utils.toWei('1','Ether')}).shoud.be.rejected
        await marketplace.purchaseProduct(product_count, {from: buyer , value: web3.utils.toWei('0.5','Ether')}).shoud.be.rejected
        await marketplace.purchaseProduct(product_count, {from: deployer , value: web3.utils.toWei('1','Ether')}).shoud.be.rejected
        await marketplace.purchaseProduct(product_count,  {from: buyer , value: web3.utils.toWei('1','Ether')}).shoud.be.rejected
       })
   })
})