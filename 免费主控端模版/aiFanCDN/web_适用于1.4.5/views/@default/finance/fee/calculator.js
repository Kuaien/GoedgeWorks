Tea.context(function () {
	this.bandwidthUnit = "";
	this.trafficUnit= "";
	this.regionId = ""

	this.formattedAmount = ""
	this.hasRegionPrice = false

	this.$delay(function () {
		this.changePriceType(this.config.priceType)

		this.$watch("config.priceType", function (priceType) {
			this.formattedAmount = ""
			this.changePriceType(priceType)
		})
	})

	this.success = function (resp) {
		this.formattedAmount = resp.data.amountFormatted
		this.hasRegionPrice = resp.data.hasRegionPrice
	}

	this.changePriceType = function (priceType) {
		switch (priceType) {
			case "traffic":
				this.$refs.trafficInput.focus()
				break
			case "bandwidth":
				this.$refs.bandwidthInput.focus()
				break
		}
	}

	this.requestId = ""
	this.change = function () {
		this.formattedAmount = ""
		this.hasRegionPrice = false

		let requestId = Math.random().toString()
		this.requestId = requestId

		this.$post("$")
			.form(this.$refs.calculatorForm)
			.success(function (resp) {
				if (requestId == this.requestId) {
					this.success(resp)
				}
			})
	}
})