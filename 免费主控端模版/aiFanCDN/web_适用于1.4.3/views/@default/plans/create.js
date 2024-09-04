Tea.context(function () {
	this.success = NotifySuccess("保存成功", "/plans#bottom")

	this.dailyRequestsFormat = ""
	this.changeDailyRequests = function (v) {
		if (v <= 0) {
			this.dailyRequestsFormat = ""
		} else {
			this.dailyRequestsFormat = teaweb.formatNumber(v) + this.formatZHW(v)
		}
	}

	this.monthlyRequestsFormat = ""
	this.changeMonthlyRequests = function (v) {
		if (v <= 0) {
			this.monthlyRequestsFormat = ""
		} else {
			this.monthlyRequestsFormat = teaweb.formatNumber(v) + this.formatZHW(v)
		}
	}

	this.dailyWebsocketConnectionsFormat = ""
	this.changeDailyWebsocketConnections = function (v) {
		if (v <= 0) {
			this.dailyWebsocketConnectionsFormat = ""
		} else {
			this.dailyWebsocketConnectionsFormat = teaweb.formatNumber(v) + this.formatZHW(v)
		}
	}

	this.monthlyWebsocketConnectionsFormat = ""
	this.changeMonthlyWebsocketConnections = function (v) {
		if (v <= 0) {
			this.monthlyWebsocketConnectionsFormat = ""
		} else {
			this.monthlyWebsocketConnectionsFormat = teaweb.formatNumber(v) + this.formatZHW(v)
		}
	}

	/**
	 * format number to zh-cn|tw|hk wan(s)
	 */
	this.formatZHW = function (v) {
		let count = v / 10000
		if (v >= 1000000000000) {
			return "，相当于" + (v / 1000000000000) + "兆"
		}
		if (v >= 100000000) {
			return "，相当于" + (v / 100000000) + "亿"
		}
		if (v >= 10000) {
			return "，相当于" + (v / 10000) + "万"
		}
		return ""
	}

	/**
	 * features
	 */
	this.hasFullFeatures = true
})