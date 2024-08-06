Tea.context(function () {
	this.isRequesting = false

	this.success = function () {
		teaweb.successRefresh("发送成功")
	}

	this.before = function () {
		this.isRequesting = true
	}

	this.done = function () {
		this.isRequesting = false
	}
})