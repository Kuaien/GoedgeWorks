Tea.context(function () {
	this.selectedNetworkId = 0
	this.selectedProtectionBandwidth = ""
	this.selectedServerBandwidth = ""
	this.selectedPackageId = 0
	this.selectedPeriodId = 0
	this.amount = -1
	this.max = 1
	this.count = 1
	this.selectedPrice = null

	this.$delay(function () {
		if (this.allNetworks.length > 0) {
			this.selectNetwork(this.allNetworks[0].id)
		}
	})

	this.selectNetwork = function (networkId) {
		this.selectedNetworkId = networkId
		this.selectedProtectionBandwidth = ""
		this.selectedServerBandwidth = ""
		this.selectedPeriodId = 0
		this.amount = -1

		// 选择第一个防护带宽
		let that = this
		let found = false
		this.prices.sort(function (v1, v2) {
			return that.compareBits(v1.protectionBandwidth, v2.protectionBandwidth)
		}).forEach(function (v) {
			if (!found && v.networkId == that.selectedNetworkId) {
				that.selectProtectionBandwidth(v.protectionBandwidth)
				found = true
			}
		})
	}

	this.selectProtectionBandwidth = function (protectionBandwidth) {
		this.selectedProtectionBandwidth = protectionBandwidth
		this.selectedServerBandwidth = ""
		this.selectedPeriodId = 0
		this.amount = -1

		// 选择第一个业务带宽
		let that = this
		let found = false
		this.prices.sort(function (v1, v2) {
			return that.compareBits(v1.serverBandwidth, v2.serverBandwidth)
		}).forEach(function (v) {
			if (!found && v.networkId == that.selectedNetworkId && v.protectionBandwidth == protectionBandwidth) {
				that.selectServerBandwidth(v.serverBandwidth)
				found = true
			}
		})
	}

	this.selectServerBandwidth = function (serverBandwidth) {
		this.selectedServerBandwidth = serverBandwidth
		this.selectedPeriodId = 0
		this.amount = -1

		// 选择第一个有效期
		let that = this
		let found = false

		this.prices.sort(function (v1, v2) {
			let periodId1 = v1.periodId
			let periodId2 = v2.periodId
			return (that.toPeriodMonths(that.findPeriodWithId(periodId1)) > that.toPeriodMonths(that.findPeriodWithId(periodId2))) ? 1 : -1
		}).forEach(function (v) {
			if (!found && v.networkId == that.selectedNetworkId && v.protectionBandwidth == that.selectedProtectionBandwidth && v.serverBandwidth == serverBandwidth) {
				that.selectPeriod(v.periodId)
				found = true
			}
		})
	}

	this.selectPeriod = function (periodId) {
		this.selectedPeriodId = periodId

		let price = null
		let found = false
		let that = this
		this.prices.forEach(function (v) {
			if (!found && v.networkId == that.selectedNetworkId
				&& v.protectionBandwidth == that.selectedProtectionBandwidth
				&& v.serverBandwidth == that.selectedServerBandwidth
				&& v.periodId == that.selectedPeriodId) {
				price = v
				found = true
			}
		})
		if (price == null) {
			teaweb.warn("数据错误，请刷新页面后重试，如果仍然没有恢复，请联系管理员。")
			return
		}

		this.selectedPrice = price

		this.selectedPackageId = price.packageId
		this.count = 1
		this.max = price.maxInstances
		this.changeCount(this.count)
	}

	this.hasProtectionBandwidth = function (protectionBandwidth) {
		if (this.prices == null) {
			return
		}

		let found = false
		let that = this
		this.prices.forEach(function (v) {
			if (v.networkId == that.selectedNetworkId && v.protectionBandwidth == protectionBandwidth) {
				found = true
			}
		})
		return found
	}

	this.hasServerBandwidth = function (serverBandwidth) {
		if (this.prices == null) {
			return
		}

		let found = false
		let that = this
		this.prices.forEach(function (v) {
			if (v.networkId == that.selectedNetworkId
				&& v.protectionBandwidth == that.selectedProtectionBandwidth
				&& v.serverBandwidth == serverBandwidth) {
				found = true
			}
		})
		return found
	}

	this.hasPeriod = function (periodId) {
		if (this.prices == null) {
			return
		}

		let found = false
		let that = this
		this.prices.forEach(function (v) {
			if (v.networkId == that.selectedNetworkId
				&& v.protectionBandwidth == that.selectedProtectionBandwidth
				&& v.serverBandwidth == that.selectedServerBandwidth
				&& v.periodId == periodId) {
				found = true
			}
		})
		return found
	}

	this.changeCount = function () {
		if (this.selectedPrice == null) {
			this.amount = -1
			return
		}
		this.amount = this.selectedPrice.price * this.count

		// 从服务器获取最新价格
		this.$post(".price")
			.params({
				packageId: this.selectedPackageId,
				periodId: this.selectedPeriodId,
				count: this.count
			})
			.success(function (resp) {
				this.amount = resp.data.amount
		})
	}

	this.toBits = function (b) {
		let m = b.match(/^(\d+)(\w+)$/)
		let n = parseInt(m[1])
		switch (m[2]) {
			case "bps":
				return n
			case "Kbps":
				return n * 1024
			case "Mbps":
				return n * Math.pow(1024, 2)
			case "Gbps":
				return n * Math.pow(1024, 3)
			case "Tbps":
				return n * Math.pow(1024, 4)
			case "Pbps":
				return n * Math.pow(1024, 5)
		}
		return n
	}

	this.compareBits = function (b1, b2) {
		return (this.toBits(b1) > this.toBits(b2)) ? 1 : -1
	}

	this.findPeriodWithId = function (periodId) {
		return this.allPeriods.$find(function (k, v) {
			return v.id == periodId
		})
	}

	this.toPeriodMonths = function (period) {
		switch (period.unit) {
			case "year":
				return period.count * 12
			default:
				return period.count
		}
	}
})