Tea.context(function () {
	this.isSending = false

	this.before = function () {
		this.isSending = true
	}

	this.done = function () {
		this.isSending = false
	}
})