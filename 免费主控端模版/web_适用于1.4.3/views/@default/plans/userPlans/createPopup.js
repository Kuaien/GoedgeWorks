Tea.context(function () {
	this.planId = 0
	this.plan = null
	this.period = "monthly"
	this.fee = 0
	this.changePlanId = function (planId) {
		if (planId == 0) {
			this.plan = null
		} else {
			this.period = "monthly"

			this.plan = this.plans.$find(function (k, v) {
				return v.id == planId
			})

			if (this.plan != null) {
				this.fee = this.plan.monthlyPrice
			}
		}
	}

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


	/**
	 * 用户账户
	 */
	this.userAccount = null

	this.changeUserId = function (userId) {
		if (userId == 0) {
			this.userAccount = null
			return
		}
		this.$post(".userAccount")
			.params({
				userId: userId
			})
			.success(function (resp) {
				this.userAccount = resp.data.account
			})
	}
})