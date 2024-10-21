Tea.context(function () {
	this.createRoute = function () {
		teaweb.popup("/ns/routes/createPopup", {
			title: '创建线路',
			width: "50em",
			height: "30em",
			callback: function () {
				teaweb.success("保存成功", function () {
					window.location = "/ns/routes"
				})
			}
		})
	}

	this.selectedType = "isp"

	this.selectRouteType = function (routeType) {
		this.selectedType = routeType
	}

	this.importAgentIPs = function () {
		teaweb.popup("/ns/routes/importAgentIPsPopup", {
			title: '导入IP',
			callback: function () {
				teaweb.successRefresh("导入成功")
			}
		})
	}
})