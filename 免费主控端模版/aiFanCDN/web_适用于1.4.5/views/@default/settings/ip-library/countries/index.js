Tea.context(function () {
	this.updateCountry = function (countryId) {
		teaweb.popup("/settings/ip-library/countries/updatePopup?countryId=" + countryId, {
			title: '定制国家/地区信息',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})