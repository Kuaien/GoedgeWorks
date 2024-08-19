Tea.context(function () {
	this.isLoading = true
	this.trafficTab = "thourly"
	this.realtimeTab = "width"
	this.metricCharts = []
	this.plusExpireDay = ""
	this.topCountryStats = []
	this.yesterdayPercentFormat = ""
	this.localLowerVersionAPINode = null
	this.countWeakAdmins = 0
	this.todayCountIPsFormat = "0"

	this.nodeValuesStat = null

	this.$delay(function () {
		// 整体图表
		this.$post("$")
			.success(function (resp) {
				var order = [6, 3, 2, 1, 5, 4];
				resp.data.metricCharts.sort((a, b) => {
					return order.indexOf(a.chart.id) - order.indexOf(b.chart.id);
				});
				for (let k in resp.data) {
					this[k] = resp.data[k]
				}

				this.todayCountIPsFormat = teaweb.formatNumber(this.todayCountIPs)

				this.isLoading = false

				this.$delay(function () {
					this.reloadHourlyTrafficChart()
					this.reloadHourlyRequestsChart()
					this.reloadTopDomainsChart()
					this.reloadTopNodesChart()
				})

				// 节点数据
				this.$delay(function () {
					this.reloadNodeValues()
				}, 200)
			})
	})

	this.selectTrafficTab = function (tab) {
		this.trafficTab = tab
		if (tab == "thourly") {
			this.$delay(function () {
				this.reloadHourlyTrafficChart()
			})
		} else if (tab == "tdaily") {
			this.$delay(function () {
				this.reloadDailyTrafficChart()
			})
		}else if (tab == "rhourly") {
			this.$delay(function () {
				this.reloadHourlyRequestsChart()
			})
		} else if (tab == "rdaily") {
			this.$delay(function () {
				this.reloadDailyRequestsChart()
			})
		}
	}
	
	this.selectRealtimeTab = function (tab) {
		this.realtimeTab = tab
		if (tab == "width") {
			this.$delay(function () {
				this.renderBandwidthGauge()
			})
		} else if (tab == "cpu") {
			this.$delay(function () {
				this.renderCPUGauge()
			})
		} else if (tab == "ram") {
			this.$delay(function () {
				this.renderMemoryGauge()
			})
		} else if (tab == "load") {
			this.$delay(function () {
				this.renderLoadGauge()
			})
		}
	}

	this.reloadHourlyTrafficChart = function () {
		let stats = this.hourlyTrafficStats
		this.reloadTrafficChart("hourly-traffic-chart-box", stats, function (args) {
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
		let stats = this.dailyTrafficStats
		this.reloadTrafficChart("daily-traffic-chart-box", stats, function (args) {
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

	this.reloadTrafficChart = function (chartId, stats, tooltipFunc) {
		let axis = teaweb.bytesAxis(stats, function (v) {
			return v.bytes
		})
		let chartBox = document.getElementById(chartId)
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
					formatter: function (v) {
						return v + axis.unit
					}
				}
			},
			tooltip: {
				show: true,
				trigger: "item",
				formatter: tooltipFunc
			},
			grid: {
				left: 50,
				top: 40,
				right: 20,
				bottom: 20
			},
			series: [
				{
					name: "总流量",
					type: "line",
					data: stats.map(function (v) {
						return v.bytes / axis.divider;
					}),
					itemStyle: {
						color: teaweb.DefaultChartColor
					},
					lineStyle: {
						color: teaweb.DefaultChartColor
					},
					areaStyle: {
						color: teaweb.DefaultChartColor
					},
					smooth: true
				},
				{
					name: "缓存流量",
					type: "line",
					data: stats.map(function (v) {
						return v.cachedBytes / axis.divider;
					}),
					itemStyle: {
						color: "#91cc74"
					},
					lineStyle: {
						color: "#91cc74"
					},
					areaStyle: {},
					smooth: true
				},
				{
					name: "攻击流量",
					type: "line",
					data: stats.map(function (v) {
						return v.attackBytes / axis.divider;
					}),
					itemStyle: {
						color: "#ee6666"
					},
					areaStyle: {
						color: "#ee6666"
					},
					smooth: true
				}
			],
			legend: {
				data: ["总流量", "缓存流量", "攻击流量"]
			},
			animation: false
		}
		chart.setOption(option)
		chart.resize()
	}

	/**
	 * 请求数统计
	 */

	this.reloadHourlyRequestsChart = function () {
		let stats = this.hourlyTrafficStats
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
		let stats = this.dailyTrafficStats
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
				formatter: tooltipFunc
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
						color: teaweb.DefaultChartColor
					},
					areaStyle: {
						color: teaweb.DefaultChartColor
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
						color: "#91cc74"
					},
					areaStyle: {
						color: "#91cc74"
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
						color: "#ee6666"
					},
					areaStyle: {
						color: "#ee6666"
					},
					smooth: true
				}
			],
			legend: {
				data: ["请求数", "缓存请求数", "攻击请求数"]
			},
			animation: true
		}
		chart.setOption(option)
		chart.resize()
	}

	// 节点排行
	this.reloadTopNodesChart = function () {
		let that = this
		let axis = teaweb.countAxis(this.topNodeStats, function (v) {
			return v.countRequests
		})
		teaweb.renderBarChart({
			id: "top-nodes-chart",
			name: "节点",
			color: teaweb.DefaultChartColor,
			values: this.topNodeStats,
			x: function (v) {
				return v.nodeName
			},
			tooltip: function (args, stats) {
				return stats[args.dataIndex].nodeName + "<br/>请求数：" + " " + teaweb.formatNumber(stats[args.dataIndex].countRequests) + "<br/>流量：" + teaweb.formatBytes(stats[args.dataIndex].bytes)
			},
			value: function (v) {
				return v.countRequests / axis.divider;
			},
			axis: axis,
			click: function (args, stats) {
				window.location = "/clusters/cluster/node?nodeId=" + stats[args.dataIndex].nodeId + "&clusterId=" + that.clusterId
			}
		})
	}

	// 域名排行
	this.reloadTopDomainsChart = function () {
		let axis = teaweb.countAxis(this.topDomainStats, function (v) {
			return v.countRequests
		})
		teaweb.renderBarChart({
			id: "top-domains-chart",
			name: "域名",
			color: teaweb.DefaultChartColor,
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
			axis: axis,
			click: function (args, stats) {
				let index = args.dataIndex
				window.location = "/servers/server?serverId=" + stats[index].serverId
			}
		})
	}

	// 绘制节点总体信息
	this.reloadNodeValues = function () {
		let reloadInterval = 20000
		this.$post(".values")
			.success(function (resp) {
				this.nodeValuesStat = resp.data.stat
				this.renderBandwidthGauge()
				this.renderCPUGauge()
				this.renderMemoryGauge()
				this.renderLoadGauge()

				if (resp.data.stat.todayTrafficFormat.length > 0) {
					let pieces = teaweb.splitFormat(resp.data.stat.todayTrafficFormat)
					this.todayTraffic = pieces[0]
					this.todayTrafficUnit = pieces[1]
				}

				this.yesterdayPercentFormat = resp.data.stat.yesterdayPercentFormat
			})
			.done(function () {
				this.$delay(function () {
					this.reloadNodeValues()
				}, reloadInterval)
			})
	}

	// 绘制gauge
	let lastBandwidthBytes = 0
	this.renderBandwidthGauge = function () {
		let bandwidthFormat = this.nodeValuesStat.totalTrafficPerSecondFormat
		let matchResult = bandwidthFormat.match(/^([0-9.]+)([a-zA-Z]+)$/)
		let size = parseFloat(matchResult[1])
		let unit = matchResult[2]
		this.nodeValuesStat.totalTrafficPerSecondSizeFormat = matchResult[1]
		this.nodeValuesStat.totalTrafficPerSecondUnitFormat = unit

		let max = size
		if (size < 10) {
			max = 10
		} else if (size < 100) {
			max = 100
		} else if (size < 1000) {
			max = 1000
		} else if (size < 1200) {
			max = 1200
		}

		let color = teaweb.DefaultChartColor
		if (lastBandwidthBytes == 0) {
			lastBandwidthBytes = this.nodeValuesStat.totalTrafficBytesPerSecond
		}
		if (lastBandwidthBytes > 0 && lastBandwidthBytes != this.nodeValuesStat.totalTrafficBytesPerSecond) {
			let delta = Math.abs(lastBandwidthBytes - this.nodeValuesStat.totalTrafficBytesPerSecond) * 100 / lastBandwidthBytes
			if (delta > 20) {
				color = "red"
			} else if (delta > 10) {
				color = "yellow"
			}
			lastBandwidthBytes = this.nodeValuesStat.totalTrafficBytesPerSecond
		}

		teaweb.renderGaugeChart({
			id: "total-bandwidth-chart-box",
			name: "",
			min: 0,
			max: max,
			value: size,
			startAngle: 240,
			endAngle: -60,
			color: color,
			unit: "",
			detail: ""
		})
		
		let chartBox = document.getElementById("total-bandwidth-chart-box")
		let chart = teaweb.initChart(chartBox)
		chart.resize()
	}

	this.renderCPUGauge = function () {
		let avgCPUUsage = Math.round(this.nodeValuesStat.avgCPUUsage * 100) / 100
		let color = teaweb.DefaultChartColor
		if (avgCPUUsage > 50) {
			color = "red"
		} else if (avgCPUUsage > 20) {
			color = "yellow"
		} else if (avgCPUUsage < 10) {
			color = "green"
		}

		let maxCPUUsage = Math.round(this.nodeValuesStat.maxCPUUsage * 100) / 100
		let maxColor = ""
		if (maxCPUUsage > 50) {
			maxColor = "red"
		} else if (maxCPUUsage > 20) {
			maxColor = "yellow"
		} else if (maxCPUUsage < 10) {
			maxColor = "green"
		}

		teaweb.renderPercentChart({
			id: "all-cpu-chart-box",
			name: "平均CPU用量",
			unit: "%",
			total: 100,
			value: avgCPUUsage,
			color: color,
			max: maxCPUUsage,
			maxColor: maxColor,
			maxName: "最大CPU用量"
		})
		
		let chartBox = document.getElementById("all-cpu-chart-box")
		let chart = teaweb.initChart(chartBox)
		chart.resize()
	}

	this.renderMemoryGauge = function () {
		let avgMemoryUsage = Math.round(this.nodeValuesStat.avgMemoryUsage * 100) / 100
		let color = teaweb.DefaultChartColor
		if (avgMemoryUsage > 80) {
			color = "red"
		} else if (avgMemoryUsage > 60) {
			color = "yellow"
		} else if (avgMemoryUsage < 20) {
			color = "green"
		}

		let maxMemoryUsage = Math.round(this.nodeValuesStat.maxMemoryUsage * 100) / 100
		let maxColor = ""
		if (maxMemoryUsage > 80) {
			maxColor = "red"
		} else if (maxMemoryUsage > 60) {
			maxColor = "yellow"
		} else if (maxMemoryUsage < 20) {
			maxColor = "green"
		}

		teaweb.renderPercentChart({
			id: "all-memory-chart-box",
			name: "平均内存用量",
			total: 100,
			unit: "%",
			value: avgMemoryUsage,
			color: color,
			max: maxMemoryUsage,
			maxColor: maxColor,
			maxName: "最大内存用量"
		})
		
		let chartBox = document.getElementById("all-memory-chart-box")
		let chart = teaweb.initChart(chartBox)
		chart.resize()
	}

	this.renderLoadGauge = function () {
		let avgLoad1min = Math.round(this.nodeValuesStat.avgLoad1min * 100) / 100
		let color = teaweb.DefaultChartColor
		if (avgLoad1min > 20) {
			color = "red"
		} else if (avgLoad1min > 5) {
			color = "yellow"
		} else {
			color = "green"
		}
		if (avgLoad1min > 10) {
			avgLoad1min = 10
		}

		let maxLoad1min = Math.round(this.nodeValuesStat.maxLoad1min * 100) / 100
		let maxColor = ""
		if (maxLoad1min > 20) {
			maxColor = "red"
		} else if (maxLoad1min > 5) {
			maxColor = "yellow"
		} else {
			maxColor = "green"
		}
		if (maxLoad1min > 20) {
			maxLoad1min = 20
		}

		teaweb.renderPercentChart({
			id: "all-load-chart-box",
			name: "平均负载",
			unit: "",
			value: avgLoad1min,
			total: 20,
			color: color,
			max: maxLoad1min,
			maxColor: maxColor,
			maxName: "最大负载"
		})
		
		let chartBox = document.getElementById("all-load-chart-box")
		let chart = teaweb.initChart(chartBox)
		chart.resize()
	}

	/**
	 * 升级提醒
	 */
	this.closeMessage = function (e) {
		let target = e.target
		while (true) {
			target = target.parentNode
			if (target.tagName.toUpperCase() == "DIV") {
				target.style.cssText = "display: none"
				break
			}
		}
	}

	// 重启本地API节点
	this.isRestartingLocalAPINode = false
	this.restartAPINode = function () {
		if (this.isRestartingLocalAPINode) {
			return
		}
		if (this.localLowerVersionAPINode == null) {
			return
		}
		this.isRestartingLocalAPINode = true
		this.localLowerVersionAPINode.isRestarting = true
		this.$post("/dashboard/restartLocalAPINode")
			.params({
				"exePath": this.localLowerVersionAPINode.exePath
			})
			.timeout(300)
			.success(function () {
				teaweb.reload()
			})
			.done(function () {
				this.isRestartingLocalAPINode = false
				this.localLowerVersionAPINode.isRestarting = false
			})
	}

	// 关闭XFF提示
	this.dismissXFFPrompt = function () {
		this.$post("/settings/security/dismissXFFPrompt")
			.success(function () {
				teaweb.reload()
			})
	}
})
