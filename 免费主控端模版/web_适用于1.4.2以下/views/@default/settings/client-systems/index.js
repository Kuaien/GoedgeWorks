Tea.context(function () {
	this.createSystem = function () {
		teaweb.popup(".createPopup", {
			height: "24em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updateSystem = function (dataId) {
		teaweb.popup(".system.updatePopup?dataId=" + dataId, {
			height: "24em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})