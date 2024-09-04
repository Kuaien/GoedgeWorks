Tea.context(function () {
	this.updateProvider = function (providerId) {
		teaweb.popup("/settings/ip-library/providers/updatePopup?providerId=" + providerId, {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})