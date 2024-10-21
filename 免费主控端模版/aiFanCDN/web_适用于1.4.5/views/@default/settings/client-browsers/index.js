Tea.context(function () {
	this.createBrowser = function () {
		teaweb.popup(".createPopup", {
			title: "创建浏览器",
			height: "24em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updateBrowser = function (dataId) {
		teaweb.popup(".browser.updatePopup?dataId=" + dataId, {
			height: "24em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})