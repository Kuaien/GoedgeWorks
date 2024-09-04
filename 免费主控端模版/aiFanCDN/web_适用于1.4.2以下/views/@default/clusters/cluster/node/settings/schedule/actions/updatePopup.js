Tea.context(function () {
	this.param = null

	if (this.action.conds.conds != null) {
		let that = this
		this.action.conds.conds.forEach(function (cond) {
			that.param = that.params.$find(function (k, v) {
				return v.code == cond.param
			})
		})
	}

	this.changeParam = function (param) {
		if (param != null) {
			this.param = param
		}
	}
})