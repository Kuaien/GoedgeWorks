Tea.context(function () {
	this.editingRegionId = 0
	this.editingPeriodId = 0

	this.editPrice = function (regionId, periodId) {
		this.editingRegionId = regionId
		this.editingPeriodId = periodId

		let refs = this.$refs
		if (typeof refs == "object") {
			for (let k in refs) {
				if (typeof k == "string" && k == "input" + regionId + "_" + periodId) {
					let inputs = refs[k]
					if (inputs.length > 0) {
						setTimeout(function () {
							inputs[0].focus()
						}, 10)
					}
					break
				}
			}
		}
	}

	this.cancelEditing = function () {
		this.editingRegionId = 0
		this.editingPeriodId = 0
	}

	this.savePrice = function (regionId, periodId) {
		let refs = this.$refs
		let price = -1
		if (typeof refs == "object") {
			for (let k in refs) {
				if (typeof k == "string" && k == "input" + regionId + "_" + periodId) {
					let inputs = refs[k]
					if (inputs.length > 0) {
						let input = inputs[0]
						let newPrice = parseFloat(input.value)
						if (isNaN(newPrice) || newPrice < 0) {
							teaweb.warn("请输入一个正确的数字", function () {
								input.focus()
							})
							return
						}
						price = newPrice
					}
					break
				}
			}
		}

		if (price < 0) {
			teaweb.warn("请输入一个正确的数字", function () {
			})
			return
		}

		this.$post("/finance/packages/updatePrice")
			.params({
				packageId: this.package.id,
				regionId: regionId,
				periodId: periodId,
				price: price
			})
			.success(function () {
				this.editingRegionId = 0
				this.editingPeriodId = 0
				this.prices[regionId + "@" + periodId] = price
			})
	}
})