Tea.context(function () {
	let allServerNames = this.serverNames.$copy();

	this.keyword = ""
	
	window.parent.postMessage(window.TEA.ACTION.data.serverNames, "*");

	this.$delay(function () {
		let that = this
		this.$watch("keyword", function (keyword) {
			that.serverNames = allServerNames.$findAll(function (k, serverName) {
				return teaweb.match(serverName, keyword)
			})
		})
	})
})