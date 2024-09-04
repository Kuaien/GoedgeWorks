Tea.context(function () {
	this.minMB = ""
	this.minSize = ""

	this.maxMB = ""
	this.maxSize = ""

	this.$delay(function () {
		let that = this
		this.$watch("minMB", function (v) {
			v = parseInt(v)
			if (isNaN(v) || v <= 0) {
				that.minSize = ""
			} else {
				that.minSize = teaweb.formatBits(v * Math.pow(1024, 2))
			}
		})
		this.$watch("maxMB", function (v) {
			v = parseInt(v)
			if (isNaN(v) || v < 0) {
				that.maxSize = ""
			} else if (v == 0) {
				that.maxSize = "∞"
			} else {
				that.maxSize = teaweb.formatBits(v * Math.pow(1024, 2))
			}
		})
	})
})