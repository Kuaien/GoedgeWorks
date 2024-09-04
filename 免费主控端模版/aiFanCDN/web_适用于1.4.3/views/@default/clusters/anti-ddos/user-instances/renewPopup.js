Tea.context(function () {
	this.selectedPeriodId = 0
	this.amount = -1

	this.$delay(function () {
		if (this.userInstance.periodId > 0) {
			let that = this
			if (this.allPeriods.$find(function (k, v) {
				return that.userInstance.periodId == v.id
			}) != null) {
				this.selectPeriod(this.userInstance.periodId)
			}
		}
	})

	this.selectPeriod = function (periodId) {
		this.selectedPeriodId = periodId

		this.amount = this.prices.$find(function (k, v) {
			return v.periodId == periodId
		}).price
	}
})