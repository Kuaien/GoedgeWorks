Tea.context(function () {
	this.updateHTTP = function () {
		teaweb.popup("/settings/server/updateHTTPPopup", {
			title: '修改HTTP设置',
			callback: function () {
				teaweb.success("保存成功", teaweb.reload)
			}
		})
	}

	this.updateHTTPS = function () {
		teaweb.popup("/settings/server/updateHTTPSPopup", {
			title: '修改HTTPS配置',
			height: "26em",
			width:"50em",
			callback: function () {
				teaweb.success("保存成功", teaweb.reload)
			}
		})
	}
})