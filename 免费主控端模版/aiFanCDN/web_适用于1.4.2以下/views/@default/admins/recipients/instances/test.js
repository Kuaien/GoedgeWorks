Tea.context(function () {
	this.isRunning = false
	this.isFinished = false
	this.response = ""
	this.error = ""
	this.isOk = false

	this.submitBefore = function () {
		this.isRunning = true
		this.isFinished = false
		this.response = ""
		this.error = ""
		this.isOk = false
	}

	this.submitSuccess = function (resp) {
		this.updateStatus(resp.data.result)
	}

	this.submitFail = function (resp) {
		this.isRunning = false
		this.isFinished = true
		this.response = ""
		this.error = resp.errors[0].messages[0]
		this.errorLines = []
	}

	this.submitError = function () {
		this.isRunning = false
		this.isFinished = true
		this.response = ""
		this.errorLines = []
		this.error = "请求超时"
	}

	this.updateStatus = function (result) {
		this.isRunning = false
		this.isFinished = true
		this.isOk = result.isOk
		this.response = result.response
		this.responseLines = []
		if (this.response != null) {
			this.responseLines = this.response.split("\n")
		}
		this.error = result.error
		this.errorLines = []
		if (this.error.length > 0) {
			this.errorLines = this.error.split("\n")
		}
	}
})