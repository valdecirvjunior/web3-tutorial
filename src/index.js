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
         // web3 = new Web3(window.ethereum);
          const rpcUrl = "";
          // web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
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

    if (Number(amount) <= 0) {
      alert("Valor invalido");
      return;
    }

    if (!web3.utils.isAddress(address)){
      alert("Endereço invalido");
      return;
    }

    sendToken(address, amount);


    // web3.eth.sendTransaction({
    //   from: from,
    //   to: address,
    //   value: amount
    // });

  }

  function sendToken(receiver, amount) {
    // console.log(`Start to send ${amount} tokens to ${receiver}`);
     const contract = new web3.eth.Contract(contractAbi, contractAddr);
    // console.log(contract);
    // const data = contract.methods.transfer(receiver, web3.utils.toWei( amount.toString() ) ).encodeABI();
    // console.log(data);
    console.log(contract);
    contract.methods.transfer(receiver, amount).send({from: contractOwner.addr})
    .on('transactionHash', function(hash){
      console.log(hash);
});
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


  connectButton.onclick = connect;
  form.onsubmit = transaction;
}