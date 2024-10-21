Tea.context(function () {
	this.isLoading = true
	this.metricCharts = []

	this.formatBytes = teaweb.formatBytes
	this.dailyCountIPsFormat = "0"


	/**
	 * 流量统计
	 */
	this.trafficTab = "hourly"

	this.$delay(function () {
		this.load()
	})

	this.load = function () {
		this.$post("$")
			.params({
				serverId: this.server.id
			})
			.success(function (resp) {
				for (let k in resp.data) {
					this[k] = resp.data[k]
				}
				this.isLoading = false

				if (this.dailyCountIPs > 0) {
					this.dailyCountIPsFormat = teaweb.formatNumber(this.dailyCountIPs)
				}

				this.$delay(function () {
					this.reloadMinutelyBandwidthChart()
					this.reloadHourlyTrafficChart()
					this.reloadHourlyRequestsChart()
				})

				// 域名统计
				this.$post(".domainStats")
					.params({
						serverId: this.server.id
					})
					.success(function (resp) {
						for (let k in resp.data) {
							this[k] = resp.data[k]
						}
						this.reloadTopDomainsChart()
					})
			})
	}

	this.bandwidthTab = "minutely"
	this.hourlyBandwidthStats = []
	this.dailyBandwidthStats = []

	this.selectBandwidthTab = function (tab) {
		this.bandwidthTab = tab
		switch (tab) {
			case "minutely":
				this.reloadMinutelyBandwidthChart()
				break
			case "hourly":
				this.$post(".hourlyBandwidth")
					.params({
						serverId: this.serverId
					})
					.success(function (response) {
						this.hourlyBandwidthStats = response.data.stats
						this.reloadHourlyBandwidthChart(response.data.percentile, response.data.percentileBits)
					})
				break
			case "daily":
				this.$post(".dailyBandwidth")
					.params({
						serverId: this.serverId
					})
					.success(function (response) {
						this.dailyBandwidthStats = response.data.stats
						this.reloadDailyBandwidthChart(response.data.percentile, response.data.percentileBits)
					})
				break
		}
	}

	this.reloadMinutelyBandwidthChart = function () {
		let axis = teaweb.bitsAxis(this.bandwidthStats, function (stat) {
			return stat.bits
		})
		teaweb.renderLineChart({
			id: "bandwidth-chart",
			values: this.bandwidthStats,
			axis: axis,
			x: function (stat) {
				return stat.timeAt
			},
			value: function (stat) {
				return stat.bits / axis.divider
			},
			tooltip: function (args, values) {
				if (args.componentType == "markLine") {
					return args.name
				}
				let index = args.dataIndex
				let day = values[index].day
				return day.substr(0, 4) + "-" + day.substr(4, 2) + "-" + day.substr(6, 2) + " " + values[index].timeAt + "<br/>峰值带宽：" + teaweb.formatBits(values[index].bits)
			},
			markLine: {
				precision: 4,
				data: [{
					name:  this.bandwidthPercentile + "th",
					yAxis: this.bandwidthPercentileBits/axis.divider
				}],
				symbol: "none",
				lineStyle: {
					color: teaweb.chartColor("red")
				}
			},
			left: 30,
			right: 40
		})
	}

	this.reloadHourlyBandwidthChart = function (percentile, percentileBits) {
		let axis = teaweb.bitsAxis(this.hourlyBandwidthStats, function (stat) {
			return stat.bits
		})
		teaweb.renderLineChart({
			id: "bandwidth-chart",
			values: this.hourlyBandwidthStats,
			axis: axis,
			x: function (stat) {
				return stat.hour
			},
			value: function (stat) {
				return stat.bits / axis.divider
			},
			tooltip: function (args, values) {
				if (args.componentType == "markLine") {
					return args.name
				}
				let index = args.dataIndex
				let day = values[index].day
				return day.substr(0, 4) + "-" + day.substr(4, 2) + "-" + day.substr(6, 2) + " " + values[index].hour + "时<br/>峰值带宽：" + teaweb.formatBits(values[index].bits)
			},
			markLine: {
				precision: 4,
				data: [{
					name:  percentile + "th",
					yAxis: percentileBits/axis.divider
				}],
				symbol: "none",
				lineStyle: {
					color: teaweb.chartColor("red")
				}
			},
			left: 30,
			right: 40
		})
	}

	this.reloadDailyBandwidthChart = function (percentile, percentileBits) {
		let axis = teaweb.bitsAxis(this.dailyBandwidthStats, function (stat) {
			return stat.bits
		})
		teaweb.renderLineChart({
			id: "bandwidth-chart",
			values: this.dailyBandwidthStats,
			axis: axis,
			x: function (stat) {
				let day = stat.day
				return day.substr(4, 2) + "-" + day.substr(6, 2)
			},
			value: function (stat) {
				return stat.bits / axis.divider
			},
			tooltip: function (args, values) {
				if (args.componentType == "markLine") {
					return args.name
				}
				let index = args.dataIndex
				let day = values[index].day
				return day.substr(0, 4) + "-" + day.substr(4, 2) + "-" + day.substr(6, 2) + "<br/>峰值带宽：" + teaweb.formatBits(values[index].bits)
			},
			markLine: {
				precision: 4,
				data: [{
					name:  percentile + "th",
					yAxis: percentileBits/axis.divider
				}],
				symbol: "none",
				lineStyle: {
					color: teaweb.chartColor("red")
				}
			},
			left: 30,
			right: 40
		})
	}

	this.selectTrafficTab = function (tab) {
		this.trafficTab = tab
		if (tab == "hourly") {
			this.$delay(function () {
				this.reloadHourlyTrafficChart()
			})
		} else if (tab == "daily") {
			this.$delay(function () {
				this.reloadDailyTrafficChart()
			})
		}
	}

	this.reloadHourlyTrafficChart = function () {
		let stats = this.hourlyStats
		this.reloadTrafficChart("hourly-traffic-chart", "流量统计", stats, function (args) {
			let index = args.dataIndex
			let cachedRatio = 0
			let attackRatio = 0
			if (stats[index].bytes > 0) {
				cachedRatio = Math.round(stats[index].cachedBytes * 10000 / stats[index].bytes) / 100
				attackRatio = Math.round(stats[index].attackBytes * 10000 / stats[index].bytes) / 100
			}

			return stats[index].day + " " + stats[index].hour + "时<br/>总流量：" + teaweb.formatBytes(stats[index].bytes) + "<br/>缓存流量：" + teaweb.formatBytes(stats[index].cachedBytes) + "<br/>缓存命中率：" + cachedRatio + "%<br/>拦截攻击流量：" + teaweb.formatBytes(stats[index].attackBytes) + "<br/>拦截比例：" + attackRatio + "%"
		})
	}

	this.reloadDailyTrafficChart = function () {
		let stats = this.dailyStats
		this.reloadTrafficChart("daily-traffic-chart", "流量统计", stats, function (args) {
			let index = args.dataIndex
			let cachedRatio = 0
			let attackRatio = 0
			if (stats[index].bytes > 0) {
				cachedRatio = Math.round(stats[index].cachedBytes * 10000 / stats[index].bytes) / 100
				attackRatio = Math.round(stats[index].attackBytes * 10000 / stats[index].bytes) / 100
			}

			return stats[index].day + "<br/>总流量：" + teaweb.formatBytes(stats[index].bytes) + "<br/>缓存流量：" + teaweb.formatBytes(stats[index].cachedBytes) + "<br/>缓存命中率：" + cachedRatio + "%<br/>拦截攻击流量：" + teaweb.formatBytes(stats[index].attackBytes) + "<br/>拦截比例：" + attackRatio + "%"
		})
	}

	this.reloadTrafficChart = function (chartId, name, stats, tooltipFunc) {
		let chartBox = document.getElementById(chartId)
		if (chartBox == null) {
			return
		}

		let axis = teaweb.bytesAxis(stats, function (v) {
			return Math.max(v.bytes, v.cachedBytes)
		})

		let chart = teaweb.initChart(chartBox)
		let option = {
			xAxis: {
				data: stats.map(function (v) {
					if (v.hour != null) {
						return v.hour
					}
					return v.day
				})
			},
			yAxis: {
				axisLabel: {
					formatter: function (value) {
						return value + axis.unit
					}
				}
			},
			tooltip: {
				show: true,
				trigger: "item",
				backgroundColor: getCssVariable('--color-bg', '#app'),
				borderColor: getCssVariable('--color-border', '#app'),
				textStyle: {
					color: getCssVariable('--color-text-active', '#app'),
				},
				formatter: tooltipFunc,
			},
			grid: {
				left: 50,
				top: 40,
				right: 20,
				bottom: 20
			},
			series: [
				{
					name: "流量",
					type: "line",
					data: stats.map(function (v) {
						return v.bytes / axis.divider
					}),
					itemStyle: {
						// color: teaweb.DefaultChartColor
						color: getCssVariable('--color-text-active', '#'+chart.getDom().id),
					},
					areaStyle: {
						// color: teaweb.DefaultChartColor
						color: getCssVariable('--color-text-active', '#'+chart.getDom().id),
					},
					smooth: true
				},
				{
					name: "缓存流量",
					type: "line",
					data: stats.map(function (v) {
						return v.cachedBytes / axis.divider
					}),
					itemStyle: {
						color: "#61A0A8"
					},
					areaStyle: {
						color: "#61A0A8"
					},
					smooth: true
				},
				{
					name: "攻击流量",
					type: "line",
					data: stats.map(function (v) {
						return v.attackBytes / axis.divider;
					}),
					itemStyle: {
						color: "#F39494"
					},
					areaStyle: {
						color: "#F39494"
					},
					smooth: true
				}
			],
			legend: {
				data: ["流量", "缓存流量", "攻击流量"],
				textStyle: {
					color: getCssVariable('--color-text'),
				},
			},
			animation: true
		}
		chart.setOption(option)
		chart.resize()
	}

	/**
	 * 请求数统计
	 */
	this.requestsTab = "hourly"

	this.selectRequestsTab = function (tab) {
		this.requestsTab = tab
		if (tab == "hourly") {
			this.$delay(function () {
				this.reloadHourlyRequestsChart()
			})
		} else if (tab == "daily") {
			this.$delay(function () {
				this.reloadDailyRequestsChart()
			})
		}
	}

	this.reloadHourlyRequestsChart = function () {
		let stats = this.hourlyStats
		this.reloadRequestsChart("hourly-requests-chart", "请求数统计", stats, function (args) {
			let index = args.dataIndex
			let cachedRatio = 0
			let attackRatio = 0
			if (stats[index].countRequests > 0) {
				cachedRatio = Math.round(stats[index].countCachedRequests * 10000 / stats[index].countRequests) / 100
				attackRatio = Math.round(stats[index].countAttackRequests * 10000 / stats[index].countRequests) / 100
			}

			return stats[index].day + " " + stats[index].hour + "时<br/>总请求数：" + teaweb.formatNumber(stats[index].countRequests) + "<br/>缓存请求数：" + teaweb.formatNumber(stats[index].countCachedRequests) + "<br/>缓存命中率：" + cachedRatio + "%<br/>拦截攻击数：" + teaweb.formatNumber(stats[index].countAttackRequests) + "<br/>拦截比例：" + attackRatio + "%"
		})
	}

	this.reloadDailyRequestsChart = function () {
		let stats = this.dailyStats
		this.reloadRequestsChart("daily-requests-chart", "请求数统计", stats, function (args) {
			let index = args.dataIndex
			let cachedRatio = 0
			let attackRatio = 0
			if (stats[index].countRequests > 0) {
				cachedRatio = Math.round(stats[index].countCachedRequests * 10000 / stats[index].countRequests) / 100
				attackRatio = Math.round(stats[index].countAttackRequests * 10000 / stats[index].countRequests) / 100
			}

			return stats[index].day + "<br/>总请求数：" + teaweb.formatNumber(stats[index].countRequests) + "<br/>缓存请求数：" + teaweb.formatNumber(stats[index].countCachedRequests) + "<br/>缓存命中率：" + cachedRatio + "%<br/>拦截攻击数：" + teaweb.formatNumber(stats[index].countAttackRequests) + "<br/>拦截比例：" + attackRatio + "%"
		})
	}

	this.reloadRequestsChart = function (chartId, name, stats, tooltipFunc) {
		let chartBox = document.getElementById(chartId)
		if (chartBox == null) {
			return
		}

		let axis = teaweb.countAxis(stats, function (v) {
			return Math.max(v.countRequests, v.countCachedRequests)
		})

		let chart = teaweb.initChart(chartBox)
		let option = {
			xAxis: {
				data: stats.map(function (v) {
					if (v.hour != null) {
						return v.hour
					}
					if (v.day != null) {
						return v.day
					}
					return ""
				})
			},
			yAxis: {
				axisLabel: {
					formatter: function (value) {
						return value + axis.unit
					}
				}
			},
			tooltip: {
				show: true,
				trigger: "item",
				backgroundColor: getCssVariable('--color-bg', '#app'),
				borderColor: getCssVariable('--color-border', '#app'),
				textStyle: {
					color: getCssVariable('--color-text-active', '#app'),
				},
				formatter: tooltipFunc,
			},
			grid: {
				left: 50,
				top: 40,
				right: 20,
				bottom: 20
			},
			series: [
				{
					name: "请求数",
					type: "line",
					data: stats.map(function (v) {
						return v.countRequests / axis.divider
					}),
					itemStyle: {
						color: getCssVariable('--color-text-active', '#'+chartId),
					},
					lineStyle: {
						color: getCssVariable('--color-text-active', '#'+chartId),
					},
					areaStyle: {
						color: getCssVariable('--color-text-active', '#'+chartId),
					},
					smooth: true
				},
				{
					name: "缓存请求数",
					type: "line",
					data: stats.map(function (v) {
						return v.countCachedRequests / axis.divider
					}),
					itemStyle: {
						color: "#61A0A8"
					},
					areaStyle: {
						color: "#61A0A8"
					},
					smooth: true
				},
				{
					name: "攻击请求数",
					type: "line",
					data: stats.map(function (v) {
						return v.countAttackRequests / axis.divider;
					}),
					itemStyle: {
						color: "#F39494"
					},
					areaStyle: {
						color: "#F39494"
					},
					smooth: true
				}
			],
			legend: {
				data: ["请求数", "缓存请求数", "攻击请求数"],
				textStyle: {
					color: getCssVariable('--color-text'),
				},
			},
			animation: true
		}
		chart.setOption(option)
		chart.resize()
	}

	// 域名排行
	this.reloadTopDomainsChart = function () {
		let axis = teaweb.countAxis(this.topDomainStats, function (v) {
			return v.countRequests
		})
		teaweb.renderBarChart({
			id: "top-domains-chart",
			name: "域名",
			values: this.topDomainStats,
			x: function (v) {
				return v.domain
			},
			tooltip: function (args, stats) {
				return stats[args.dataIndex].domain + "<br/>请求数：" + " " + teaweb.formatNumber(stats[args.dataIndex].countRequests) + "<br/>流量：" + teaweb.formatBytes(stats[args.dataIndex].bytes)
			},
			value: function (v) {
				return v.countRequests / axis.divider;
			},
			axis: axis
		})
	}
})