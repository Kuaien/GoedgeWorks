Tea.context(function () {
	this.updateProvider = function (providerId) {
		teaweb.popup("/settings/ip-library/providers/updatePopup?providerId=" + providerId, {
			title: '定制ISP运营商信息',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})