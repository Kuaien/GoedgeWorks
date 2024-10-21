Tea.context(function () {
	this.updateProvince = function (provinceId) {
		teaweb.popup("/settings/ip-library/provinces/updatePopup?provinceId=" + provinceId, {
			title: '定制省份/州信息',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})