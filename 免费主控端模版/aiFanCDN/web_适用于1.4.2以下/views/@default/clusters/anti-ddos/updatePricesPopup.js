Tea.context(function () {
	this.editingPeriodId = 0

	this.editPrice = function (periodId) {
		this.editingPeriodId = periodId

		let refs = this.$refs
		if (typeof refs == "object") {
			for (let k in refs) {
				if (typeof k == "string" && k == "input" + periodId) {
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
		this.editingPeriodId = 0
	}

	this.savePrice = function (periodId) {
		let refs = this.$refs
		let price = -1
		if (typeof refs == "object") {
			for (let k in refs) {
				if (typeof k == "string" && k == "input" + periodId) {
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

		this.$post("/clusters/anti-ddos/updatePrice")
			.params({
				packageId: this.package.id,
				periodId: periodId,
				price: price
			})
			.success(function () {
				this.editingPeriodId = 0
				this.prices[periodId] = price
			})
	}
})

String.prototype.toBitUpper = function () {
	let unit = this
	return unit.replace(/bps$/, "").replace(/b$/, "").toUpperCase() + "bps"
}