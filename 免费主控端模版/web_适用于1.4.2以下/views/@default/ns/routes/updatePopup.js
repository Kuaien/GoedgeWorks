Tea.context(function () {
	this.rangeTypeCode = "ipRange"
	this.rangeType = null
	this.ranges = []

	this.$delay(function () {
		this.changeRangeType()
	})

	this.changeRangeType = function () {
		let that = this
		this.rangeType = this.rangeTypes.$find(function (k, v) {
			return v.code == that.rangeTypeCode
		})

		if (this.$refs != null) {
			let rangesBox = this.$refs.routeRangesBox
			if (rangesBox != null) {
				rangesBox.updateRangeType(this.rangeTypeCode)
			}
		}
	}
})