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
      // Fetch the task data from the blockchain
      const hashMeta = await App.backupHashStorage.hashes(i)
      const hashId = hashMeta[0].toNumber()
      const contentsHash = hashMeta[1] 
      const absoluteFolderPath = hashMeta[2]
      const timestamp = hashMeta[3]
      console.log(hashMeta)

      // Create the html for the task
      // const $newTaskTemplate = $taskTemplate.clone()
      // $newTaskTemplate.find('.hash').html(contentsHash)
      // $newTaskTemplate.find('input')
      //                 .prop('name', absoluteFolderPath)
                      // .on('click', App.toggleCompleted)

      // Put the task in the correct list
    $('#backupsHashList').append('<tr><td>'+hashId+'</td><td>'+contentsHash+'</td><td>'+absoluteFolderPath+'</td><td>'+timestamp+'</td><td><button class="verifyButton">verify</button></td></tr>')

      // Show the task
      // $newTaskTemplate.show()
    }
    // $('#backupsHashList').append('<tr><td>'+v+' my data</td><td>more data</td></tr>')
  }

}

$(() => {
	$(window).load(() => {
		App.load()
	})
})