Tea.context(function () {
	this.createPackage = function () {
		teaweb.popup("/finance/packages/createPopup", {
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.updatePackage = function (packageId) {
		teaweb.popup("/finance/packages/updatePopup?packageId=" + packageId, {
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.deletePackage = function (packageId) {
		let that = this
		teaweb.confirm("确定要删除此流量包吗？", function () {
			that.$post("/finance/packages/delete")
				.params({packageId: packageId})
				.success(function () {
					teaweb.success("删除成功", function () {
						teaweb.reload()
					})
				})
		})
	}

	this.updatePrices = function (packageId) {
		teaweb.popup("/finance/packages/updatePricesPopup?packageId=" + packageId, {
			width: "54em",
			height: "30em",
			onClose: function () {
				teaweb.reload()
			}
		})
	}
})