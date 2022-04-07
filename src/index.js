const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

window.onload = function() {
  let web3;
  let from;
  const connectButton = document.getElementById('connect');
  const content = document.getElementById('content');
  const account = document.getElementById('account');
  const form = document.getElementById('send');
  const addressInput = document.getElementById('address');
  const amountInput = document.getElementById('amount');
  
  const contractAddr = '0xb032815341c6f3c50b49433f03167fed129c7313';
  const contractAbi = [
    // transfer
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "type": "function"
    }
  ];
  const contractOwner = {
	  addr: '0x19C021A753D29feA7659bba75544d13D2ADFD620',
	  key: '05dfa85852b22f3c0d41b9e25e2bb16992199995c3a0bdac8c046b4aa85e167e'
  };

  const connect = async function () {
      if(window.ethereum){
        try {
          await window.ethereum.request({method: 'eth_requestAccounts'});
          const rpcUrl = "";
          web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
          let accounts = await web3.eth.getAccounts();
          from = accounts[0];
          content.style.display = 'initial';
          account.innerText = from;
        } catch(err){
          alert("Conta desconectada");
        }
      } else {
        alert("Instale a metamask!");
      }
  }

  const transaction = function(event) {
    event.preventDefault();
    const amount = amountInput.value * 100;
    const address = addressInput.value;

    console.log(amount);
    console.log(address);

    // if (Number(amount) <= 0) {
    //   alert("Valor invalido");
    //   return;
    // }

    // if (!web3.utils.isAddress(address)){
    //   alert("Endereço invalido");
    //   return;
    // }

    sendToken(address, amount);


    // web3.eth.sendTransaction({
    //   from: from,
    //   to: address,
    //   value: amount
    // });

  }

  function sendToken(receiver, value) {

    const privateKey = contractOwner.key;
    const tokenAddress = contractAddr;
    const fromAddress = "0x19C021A753D29feA7659bba75544d13D2ADFD620";
    const toAddress = "0xbb8c67CBFFd83dAc6CE665053735edC9238BecF7";

 var web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

let amount = '0xC';
let tokenAmount = amount;
// Get ERC20 Token contract instance
let contract = new web3.eth.Contract(contractAbi, tokenAddress, {
    from: fromAddress
});
// How many tokens do I have before sending?
//let balance = await contract.methods.balanceOf(fromAddress).call();
//console.log(`Balance before send: ${balance}`);
// EIP 155 - List of Chain ID's:
// const chainList = {
//     mainnet: 1,
//     morden: 2,
//     ropsten: 3,
//     rinkeby: 4,
//     ubiqMainnet: 8,
//     ubiqTestnet: 9,
//     rootstockMainnet: 30,
//     rootstockTestnet: 31,
//     kovan: 42,
//     ethereumClassicMainnet: 61,
//     ethereumClassicTestnet: 62,
//     ewasmTestnet: 66,
//     gethPrivateChains: 1337
// };
// The gas price is determined by the last few blocks median gas price.
//const avgGasPrice = await web3.eth.getGasPrice();
// current transaction gas prices from https://ethgasstation.info/
//const currentGasPrices = await getCurrentGasPrices();
/**
 * With every new transaction you send using a specific wallet address,
 * you need to increase a nonce which is tied to the sender wallet.
 */
let nonce = web3.eth.getTransactionCount(fromAddress);
// Will call estimate the gas a method execution will take when executed in the EVM without.
let estimateGas = web3.eth.estimateGas({
    "value": '0x0', // Only tokens
    "data": contract.methods.transfer(toAddress, tokenAmount).encodeABI(),
    "from": fromAddress,
    "to": toAddress
});
console.log({
    estimateGas: estimateGas
});
// Build a new transaction object.
const transaction = {
    "from": fromAddress,
    "nonce": amount,
    "gasPrice": "0x04e3b29200",
    "gasLimit": "0x7458",
    "to": toAddress,
    "value": "0x0",
    "data": contract.methods.transfer(toAddress, tokenAmount).encodeABI(),
    "chainId": 0x03
};
// Creates an account object from a private key.
const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
var avgGasPrice = '5444';
/**
* This is where the transaction is authorized on your behalf.
* The private key is what unlocks your wallet.
*/
const signedTransaction = senderAccount.signTransaction(transaction);
console.log({
    transaction: transaction,
    amount: amount,
    tokenAmount: tokenAmount,
    avgGasPrice: avgGasPrice,
    signedTransaction: signedTransaction
});

// We're ready! Submit the raw transaction details to the provider configured above.
try {
    const receipt = web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    console.log({
        receipt: receipt
    });
    
} catch (error) {
    console.log({
        error: error.message
    });
}
    
    // var web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
    // var count = web3.eth.getTransactionCount(contractOwner.addr);
    // var contract = web3.eth.contract(contractAbi).at(contractAddr);
    // var rawTransaction = {
    //     "from": contractOwner.addr,
    //     "nonce": web3.toHex(count),
    //     "gasPrice": "0x04e3b29200",
    //     "gasLimit": "0x7458",
    //     "to": receiver,
    //     "value": amount,
    //     "data": contract.transfer.getData(contractAddr, 10, {from: contractOwner.addr}),
    //     "chainId": 0x03
    // };
    
    // var privKey = new Buffer(contractOwner.key, 'hex');
    // var tx = new Tx(rawTransaction);
    
    // tx.sign(privKey);
    // var serializedTx = tx.serialize();
    
    // web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    //     if (!err)
    //         console.log(hash);
    //     else
    //         console.log(err);
    // });



    // console.log(`Start to send ${amount} tokens to ${receiver}`);
    // const contract = new web3.eth.Contract(contractAbi, contractAddr);
    // console.log(contract);
    // const data = contract.methods.transfer(receiver, web3.utils.toWei( amount.toString() ) ).encodeABI();
    // console.log(data);
    // console.log(contract);
    // contract.methods.transfer(receiver, amount).send({from: contractOwner.addr})
    // .on('transactionHash', function(hash){
    //   console.log(hash);
// });
    //let data = contract.methods.transfer(receiver, amount).encodeABI();
    
    // var rawTransaction = {
    //     "from": address, 
    //     "gasPrice":web3.utils.toHex(2 * 1e9),
    //     "gasLimit":web3.utils.toHex(210000),
    //     "to": contractAddr,
    //     "value":web3.utils.toHex(amount),
    //     "data": data,
    //     "nonce": web3.utils.toHex(amount)
    //   } 
    // var transaction = new Tx(rawTransaction)
    // transaction.sign(contractOwner.key);

    // web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))

    // check the balance
  //   web3.eth.call({
  //     to: address,
  //     data: contract.methods.balanceOf(address).encodeABI()
    // }).then(balance => {console.log(balance)})
  //   var tx = {
  //       from: account,
  //       to: receiver,
  //       data: data,
  //       gas: 21000,  
  //   }
  //   await web3.eth.sendTransaction(tx).then(res => {
  //       console.log("res",res)
  //   }).catch(err => {
  //       console.log("err",err)
  //   });
   }


  //connectButton.onclick = connect;
  form.onsubmit = transaction;
}