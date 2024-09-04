Tea.context(function () {
	this.plan.dailyRequestsFormat = teaweb.formatNumber(this.plan.dailyRequests)
	this.plan.monthlyRequestsFormat = teaweb.formatNumber(this.plan.monthlyRequests)
})