Tea.context(function () {
	this.$delay(function () {
		this.reloadChart()
	})

	this.reloadChart = function () {
		let axis = teaweb.countAxis(this.stats, function (stat){
			return stat.countRequests
		})

		teaweb.renderLineChart({
			id: "stat-chart",
			name: "解析量统计",
			values: this.stats,
			x: function (stat) {
				return stat.hour.substring(8)
			},
			tooltip: function (args, stats) {
				let index = args.dataIndex
				let year = stats[index].hour.substring(0, 4)
				let month = stats[index].hour.substring(4, 6)
				let day = stats[index].hour.substring(6, 8)
				let hour = stats[index].hour.substring(8, 10)
				return  year + "-" + month + "-" + day + " " + hour + "时<br/>解析次数：" + teaweb.formatNumber(stats[index].countRequests)
			},
			value: function (stat) {
				return stat.countRequests/axis.divider
			},
			axis: axis
		})
	}
})