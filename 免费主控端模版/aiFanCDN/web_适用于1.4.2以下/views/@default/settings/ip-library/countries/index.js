Tea.context(function () {
	this.updateCountry = function (countryId) {
		teaweb.popup("/settings/ip-library/countries/updatePopup?countryId=" + countryId, {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})