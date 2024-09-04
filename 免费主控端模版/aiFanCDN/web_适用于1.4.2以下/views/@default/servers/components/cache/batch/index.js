Tea.context(function () {
	this.isRequesting = false
	this.isOk = false
	this.message = ""
	this.failKeys = []

	this.$delay(function () {
		this.$refs.keysBox.focus()
		this.$watch("keyType", function () {
			this.$refs.keysBox.focus()
		})
	})
	
	this.serverList = ''
	if(localStorage.getItem('servers')){
		this.serverList = JSON.parse(localStorage.getItem('servers'))
	}
	
	this.serverId = ''
	this.selectServer = ''
	this.changeServer = function(e){
		this.selectServer = this.serverList.find(itm => itm.id === this.serverId);
	}
	
	let that = this
	window.addEventListener('message',function(e){
		let https = that.selectServer.ports.findIndex(itm => itm.portRange === '443');
		let urls = []
		e.data.forEach(itm => {
			let url = https===-1?'http://'+itm+'/':'https://'+itm+'/'
			urls.push(url)
		})
		document.querySelector('textarea').value = urls.join('\n')
	})

	this.before = function () {
		this.isRequesting = true
		this.isOk = false
		this.message = ""
		this.failKeys = []
	}

	this.success = function () {
		this.isOk = true
		let that = this
		teaweb.success("任务提交成功", function () {
			window.location = window.location.pathname + "?keyType=" + that.keyType
		})
	}

	this.fail = function (resp) {
		this.message = resp.message

		if (resp.data.failKeys != null) {
			this.failKeys = resp.data.failKeys
		}
	}

	this.done = function () {
		this.isRequesting = false
	}

	/**
	 * 操作类型
	 */
	if (this.keyType == null || this.keyType.length == 0) {
		this.keyType = "key" // key | prefix
	}
})