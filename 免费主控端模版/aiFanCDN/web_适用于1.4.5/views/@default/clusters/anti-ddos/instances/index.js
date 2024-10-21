Tea.context(function () {
	this.createInstance = function () {
		let packageId = 0
		if (this.selectedPackage != null) {
			packageId = this.selectedPackage.id
		} else if (this.packageId > 0) {
			packageId = this.packageId
		}

		teaweb.popup(".createPopup?networkId=" + this.networkId + "&packageId=" + packageId, {
			title: '添加高防实例',
			height: "24em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updateInstance = function (instanceId) {
		teaweb.popup(".instance.updatePopup?instanceId=" + instanceId, {
			height: "24em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deleteInstance = function (instanceId) {
		let that = this
		teaweb.confirm("确定要删除当前实例吗？", function () {
			that.$post(".instance.delete")
				.params({
					instanceId: instanceId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}

	String.prototype.toBitUpper = function () {
		let unit = this
		return unit.replace(/bps$/, "").replace(/b$/, "").toUpperCase() + "bps"
	}
})