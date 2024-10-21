Tea.context(function () {
	this.changeCountry = function (item) {
		let provinceOptionsBox = this.$refs.provinceOptionsRef

		if (item != null) {
			provinceOptionsBox.setDataURL("/settings/ip-library/cities/provinceOptions?countryId=" + item.value)
			provinceOptionsBox.reloadData()
		}

		provinceOptionsBox.clear()
	}

	this.updateCity = function (cityId) {
		teaweb.popup("/settings/ip-library/cities/updatePopup?cityId=" + cityId, {
			title: '定制城市/市信息',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})