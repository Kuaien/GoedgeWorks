Tea.context(function () {
	this.config = window.parent.TESTING_EMAIL_CONFIG

	this.isSending = false

	this.before = function () {
		this.isSending = true
	}

	this.done = function () {
		this.isSending = false
	}

	this.successSend = function () {
		teaweb.success("发送成功")
	}
})