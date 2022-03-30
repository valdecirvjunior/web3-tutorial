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
  
  const contractAddr = '0xb083f2fc816f94ce4aeb29857c919a997b083b81';
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
	  addr: '0xC482801e49bc0CDD7FE8E35A000ca12cC313D71A',
	  key: '5658e8456784817f3bf0a662f1cb5cfb560671c373269452c046a4bc18192c36'
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
    const amount = amountInput.value;
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

  async function sendToken(receiver, amount) {
    console.log(`Start to send ${amount} tokens to ${receiver}`);
    const contract = new web3.eth.Contract(contractAbi, contractAddr);
    console.log(contract);
    const data = contract.methods.transfer(receiver, web3.utils.toWei( amount.toString() ) ).encodeABI();
    console.log(data);
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
    var tx = {
        from: account,
        to: receiver,
        data: data,
        gas: 21000,  
    }
    await web3.eth.sendTransaction(tx).then(res => {
        console.log("res",res)
    }).catch(err => {
        console.log("err",err)
    });
  }


  connectButton.onclick = connect;
  form.onsubmit = transaction;
}