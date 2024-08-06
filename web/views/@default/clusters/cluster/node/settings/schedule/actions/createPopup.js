Tea.context(function () {
	this.param = null

	this.changeParam = function (param) {
		if (param != null) {
			this.param = param
		}
	}
})