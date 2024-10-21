Tea.context(function () {
	this.changeCountry = function (item) {
		let provinceOptionsBox = this.$refs.provinceOptionsRef

		if (item != null) {
			provinceOptionsBox.setDataURL("/settings/ip-library/towns/provinceOptions?countryId=" + item.value)
			provinceOptionsBox.reloadData()
		}

		provinceOptionsBox.clear()

		this.changeProvince(null)
	}

	this.changeProvince = function (item) {
		let cityOptionsBox = this.$refs.cityOptionsRef

		if (item != null) {
			cityOptionsBox.setDataURL("/settings/ip-library/towns/cityOptions?provinceId=" + item.value)
			cityOptionsBox.reloadData()
		}

		cityOptionsBox.clear()
	}

	this.updateTown = function (townId) {
		teaweb.popup("/settings/ip-library/towns/updatePopup?townId=" + townId, {
			title: '定制区/县信息',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})