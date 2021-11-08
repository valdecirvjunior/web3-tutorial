const Web3 = require('web3');

window.onload = function() {
  let web3;
  let from;
  const connectButton = document.getElementById('connect');
  const content = document.getElementById('content');
  const account = document.getElementById('account');
  const form = document.getElementById('send');
  const addressInput = document.getElementById('address');
  const amountInput = document.getElementById('amount');

  const connect = async function () {
      if(window.ethereum){
        try {
          await window.ethereum.request({method: 'eth_requestAccounts'});
          web3 = new Web3(window.ethereum);
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

    web3.eth.sendTransaction({
      from: from,
      to: address,
      value: amount
    });

  }

  connectButton.onclick = connect;
  form.onsubmit = transaction;
}