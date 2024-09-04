Tea.context(function () {
	this.createPackage = function () {
		teaweb.popup("/clusters/anti-ddos/createPopup", {
			height: "26em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updatePackage = function (packageId) {
		teaweb.popup("/clusters/anti-ddos/updatePopup?packageId=" + packageId, {
			height: "26em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deletePackage = function (packageId) {
		let that = this
		teaweb.confirm("确定要删除此高防产品吗？", function () {
			that.$post(".delete")
				.params({
					packageId: packageId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}

	this.updatePrices = function (packageId) {
		teaweb.popup("/clusters/anti-ddos/updatePricesPopup?packageId=" + packageId, {
			height: "30em",
			onClose: function () {
				teaweb.reload()
			}
		})
	}
})

String.prototype.toBitUpper = function () {
	let unit = this
	return unit.replace(/bps$/, "").replace(/b$/, "").toUpperCase() + "bps"
}