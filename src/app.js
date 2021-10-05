 // var Web3 = require("web3")
// Web3 = require(['web3'])
App = {
	contracts: {},
	loading:false,
	load: async () => {
		// abc = new Web3()
		console.log("app loading")
		await App.loadWeb3()
		web3.eth.defaultAccount = web3.eth.accounts[0]
		await App.loadAccount()
		await App.loadContract()
		await App.render()
		await App.buttonClick()
	},

  buttonClick: async()  => {
  	$(".verify").click(function() {
		var currentRow = $(this).closest("tr");
		var seq = currentRow.find(".seq").text();
		var hash = currentRow.find(".hash").text();
		var path = currentRow.find(".path").text();
		var timestamp = currentRow.find(".time").text();

		$.ajax({
                url:'http://localhost:5000/verify?hash='+hash + '&path='+path,
                dataType:'json',
                type: 'post',
                success:function(response){
                    console.log("response " + response)
                   alert(response.message)
                }
            });
	})
  },

	// https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      // console.log(web3.currentProvider)
      web3 = new Web3(web3.currentProvider)
    } else {
    	// set the provider you want from 
    	// Web3.providers web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
  		window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
  	// console.log('haule')
  	// console.log(web3.eth.accounts[0])
  	App.account = web3.eth.accounts[0]
  	// console.log(App.account)
  },

  loadContract: async () => {
  	const backupHashStorage = await $.getJSON('BackupHashStorage.json')
  	App.contracts.BackupHashStorage = TruffleContract(backupHashStorage)
  	App.contracts.BackupHashStorage.setProvider(App.web3Provider)
  	App.backupHashStorage = await App.contracts.BackupHashStorage.deployed()
  	// console.log(todoList)
  },

  render: async () => {
  	if (App.loading) {
  		return
  	}
  	App.setLoading(true)
  	$('#account').html(App.account)
  	await App.renderBackups()
  	App.setLoading(false)
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

  renderBackups: async () => {
    // Load the total task count from the blockchain
    const backupsCount = await App.backupHashStorage.backupsCount()
    const $taskTemplate = $('.taskTemplate')

    for (var i = 1; i <= backupsCount; i++) {
      // Fetch the backups data from the blockchain
      const hashMeta = await App.backupHashStorage.hashes(i)
      const seq = hashMeta[0].toNumber()
      const contentsHash = hashMeta[1] 
      const absoluteFolderPath = hashMeta[2].split('/').slice(4,6).join('/')
      const timestamp = hashMeta[3]
      var theDate = new Date(timestamp * 1000);
      dateString = theDate.toGMTString();

      const seqCol = '<td class="seq">'+seq+'</td>'
      const hashCol = '<td class="hash">'+contentsHash+'</td>'
      const absoluteFolderPathCol = '<td class="path">'+absoluteFolderPath+'</td>'
      const timestampCol = '<td class="time">'+dateString+'</td>'
      const buttonCol = '<td><button class="verify">verify</button></td>'

    $('#backupsHashList').append('<tr>'+seqCol+hashCol
      +absoluteFolderPathCol+timestampCol+buttonCol+'</tr>')

    }
  }

}

$(() => {
	$(window).load(() => {
		App.load()
	})
})