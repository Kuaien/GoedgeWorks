Tea.context(function () {
	this.packageId = 0
	this.regionId = 0
	this.periodId = 0
	this.amount = -1
	this.count = 1

	this.selectPackage = function (packageId) {
		this.packageId = packageId
		this.regionId = 0
		this.periodId = 0
		this.reloadPrice()
	}

	this.selectRegion = function (regionId) {
		this.regionId = regionId
		this.periodId = 0
		this.reloadPrice()
	}

	this.selectPeriod = function (periodId) {
		this.periodId = periodId
		this.reloadPrice()
	}

	this.changeCount = function () {
		this.reloadPrice()
	}

	var requestId = 0
	this.reloadPrice = function () {
		var newRequestId = (++requestId)
		this.$post(".price")
			.params({
				packageId: this.packageId,
				regionId: this.regionId,
				periodId: this.periodId,
				count: this.count
			})
			.success(function (resp) {
				if (newRequestId == requestId) {
					this.amount = resp.data.amount
				}
			})
	}

	this.hasRegionPrice = function (regionId) {
		if (this.packageId <= 0) {
			return false
		}
		for (let k in this.prices) {
			if (k.startsWith(this.packageId + "@" + regionId + "@")) {
				return true
			}
		}
		return false
	}

	this.hasPeriodPrice = function (periodId) {
		if (this.packageId <= 0 || this.regionId <= 0) {
			return false
		}
		for (let k in this.prices) {
			if (k == this.packageId + "@" + this.regionId + "@" + periodId) {
				return true
			}
		}
		return false
	}
})