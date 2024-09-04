Tea.context(function () {
	this.updateProvince = function (provinceId) {
		teaweb.popup("/settings/ip-library/provinces/updatePopup?provinceId=" + provinceId, {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})