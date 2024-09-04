Tea.context(function () {
	this.servers = []
	this.result = null
	this.isLoading = false
	this.regionId = 0
	this.serverId = 0

	this.changeDayFrom = function (v) {
		if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
			this.search()
		}
	}

	this.changeDayTo = function (v) {
		if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
			this.search()
		}
	}

	this.changeUser = function (userId) {
		this.userId = userId
		this.servers = []
		this.serverId = 0
		this.regionId = 0
		this.searchUser(userId)
	}

	this.changeServer = function (result) {
		if (result != null) {
			this.serverId = result.value
			this.search()
		}
	}

	this.changeRegion = function () {
		this.search()
	}

	if (this.userId > 0) {
		this.$delay(function () {
			this.searchUser(this.userId)
		})
	}

	this.searchUser = function (userId) {
		if (userId > 0) {
			this.$post(".serverOptions")
				.params({
					userId: userId
				})
				.success(function (resp) {
					this.servers = resp.data.servers
				})
		}

		this.search()
	}

	this.startSearch = function () {
		if (this.userId == 0) {
			teaweb.warn("请选择要查询的用户")
			return
		}
		this.search()
	}

	this.search = function () {
		this.isLoading = true

		this.result = null

		if (this.userId == 0) {
			this.isLoading = false
			return
		}

		this.$post("$")
			.params({
				userId: this.userId,
				serverId: this.serverId,
				regionId: this.regionId,
				dayFrom: this.dayFrom,
				dayTo: this.dayTo
			})
			.success(function (resp) {
				let totalTrafficBytesFormat = teaweb.splitFormat(teaweb.formatBytes(resp.data.totalTrafficBytes))
				let maxBandwidthBitsFormat = teaweb.splitFormat(teaweb.formatBits(resp.data.maxBandwidthBits))
				let bandwidth95thBitsFormat = teaweb.splitFormat(teaweb.formatBits(resp.data.bandwidth95thBits))

				this.result = {
					bandwidthStats: resp.data.bandwidthStats,
					reversedBandwidthStats: resp.data.bandwidthStats.$copy().reverse(),
					maxBandwidthBitsFormat: maxBandwidthBitsFormat,
					maxBandwidthTime: resp.data.maxBandwidthTime,
					bandwidth95thBitsFormat: bandwidth95thBitsFormat,
					totalTrafficBytesFormat: totalTrafficBytesFormat,
					totalTrafficRequests: teaweb.formatCount(resp.data.totalTrafficRequests)
				}

				this.reloadChart(resp.data.bandwidthStats, resp.data.bandwidth95thBits)
			})
			.done(function () {
				this.isLoading = false
			})
	}

	/**
	 * tab set
	 */
	this.tab = "chart"
	this.selectTab = function (tab) {
		this.tab = tab
	}

	this.reloadChart = function (stats, nthBits) {
		let box = document.getElementById("bandwidth-chart")
		if (box == null || box.offsetHeight <= 0) {
			this.$delay(function () {
				this.reloadChart(stats, nthBits)
			}, 100)
			return
		}

		let axis = teaweb.bitsAxis(stats, function (stat) {
			return stat.bits
		})

		teaweb.renderLineChart({
			id: "bandwidth-chart",
			values: stats,
			axis: axis,
			x: function (stat) {
				return stat.day.substring(0, 4) + "-" + stat.day.substring(4, 6) + "-" + stat.day.substring(6) + " " + stat.time.substring(0, 2) + ":" + stat.time.substring(2)
			},
			xColor: function (text) {
				let currentTime = new Date().format("Y-m-d H:i")
				if (currentTime < text) {
					return "#cccccc"
				}
				return "default"
			},
			value: function (stat) {
				if (typeof(stat.isNull) == "boolean" && stat.isNull) {
					return null
				}
				return stat.bits / axis.divider
			},
			tooltip: function (args, values) {
				if (args.componentType == "markLine") {
					return args.name
				}

				let index = args.dataIndex
				let stat = values[index]

				return stat.day.substring(0, 4) + "-" + stat.day.substring(4, 6) + "-" + stat.day.substring(6) + " " + stat.time.substring(0, 2) + ":" + stat.time.substring(2) + "<br/>带宽：" + teaweb.formatBits(values[index].bits)
			},
			left: 30,
			right: 40,
			cache: false,
			markLine: {
				precision: 4,
				data: [{
					name:  this.percentile + "th",
					yAxis: nthBits/axis.divider
				}],
				symbol: "none",
				lineStyle: {
					color: teaweb.chartColor("red")
				}
			}
		})
	}

	/**
	 * select day
	 */
	this.selectDay = function (dayFrom, dayTo) {
		this.dayFrom = dayFrom
		this.dayTo = dayTo
		this.search()
	}
})