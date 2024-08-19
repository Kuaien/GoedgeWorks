Tea.context(function () {
	this.createPeriod = function () {
		teaweb.popup("/clusters/anti-ddos/periods/createPopup", {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updatePeriod = function (periodId) {
		teaweb.popup("/clusters/anti-ddos/periods/period/updatePopup?periodId=" + periodId, {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deletePeriod = function (periodId) {
		let that = this
		teaweb.confirm("确定要删除此有效期选项吗？", function () {
			that.$post("/clusters/anti-ddos/periods/period/delete")
				.params({
					periodId: periodId
				})
				.success(function () {
					teaweb.success("删除成功", function () {
						teaweb.reload()
					})
				})
		})
	}
})