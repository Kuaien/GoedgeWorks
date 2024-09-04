Tea.context(function () {
	this.shouldReplace = false
	this.headerName = ""

	this.selectHeader = function (headerName) {
		this.headerName = headerName
	}
})