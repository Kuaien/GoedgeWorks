Tea.context(function () {
	this.period = "monthly"
	this.fee = this.plan.monthlyPrice

	this.countMonths = 1
	this.countSeasons = 1
	this.countYears = 1

	this.$delay(function () {
		this.$watch("period", function (period) {
			this.countMonths = 1
			this.countSeasons = 1
			this.countYears = 1

			switch(period) {
				case "monthly":
					this.fee = this.countMonths * this.plan.monthlyPrice
					break
				case "seasonally":
					this.fee = this.countSeasons * this.plan.seasonallyPrice
					break
				case "yearly":
					this.fee = this.countYears * this.plan.yearlyPrice
					break
			}
		})

		this.$watch("countMonths", function (months) {
			let count = parseInt(months)
			if (isNaN(count) || count < 1) {
				count = 1
			}
			this.fee = this.plan.monthlyPrice * count
		})
		this.$watch("countSeasons", function (seasons) {
			let count = parseInt(seasons)
			if (isNaN(count) || count < 1) {
				count = 1
			}
			this.fee = this.plan.seasonallyPrice * count
		})
		this.$watch("countYears", function (years) {
			let count = parseInt(years)
			if (isNaN(count) || count < 1) {
				count = 1
			}
			this.fee = this.plan.yearlyPrice * count
		})
	})
})