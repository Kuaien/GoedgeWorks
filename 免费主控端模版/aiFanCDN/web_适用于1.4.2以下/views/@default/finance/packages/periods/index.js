Tea.context(function () {
	this.createPeriod = function () {
		teaweb.popup("/finance/packages/periods/createPopup", {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updatePeriod = function (periodId) {
		teaweb.popup("/finance/packages/periods/period/updatePopup?periodId=" + periodId, {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deletePeriod = function (periodId) {
		let that = this
		teaweb.confirm("确定要删除此有效期选项吗？", function () {
			that.$post("/finance/packages/periods/period/delete")
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