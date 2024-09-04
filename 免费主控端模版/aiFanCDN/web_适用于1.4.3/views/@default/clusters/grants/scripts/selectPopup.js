Tea.context(function () {
	this.scriptId = 0
	this.keyword = ""
	let allScripts = this.scripts.$copy()

	this.selectNodeInitScript = function (script) {
		NotifyPopup({
			code: 200,
			data: {
				script: script
			}
		})
	}

	this.$delay(function () {
		let that = this
		this.$watch("keyword", function (keyword) {
			if (keyword.length > 0) {
				that.scripts = allScripts.$findAll(function (k, script) {
					return teaweb.match(script.name, keyword)
				})
			} else {
				that.scripts = allScripts
			}
		})
	})
})