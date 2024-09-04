Tea.context(function () {
	this.isRequesting = false

	this.isTested = false
	this.results = []

	this.before = function () {
		this.isRequesting = true
		this.isTested = false
		this.results = []
	}

	this.success = function (resp) {
		this.isTested = true
		this.results = resp.data.results
	}

	this.done = function () {
		this.isRequesting = false
	}

	this.resetResults = function () {
		this.isTested = false
		this.results = []
	}
})