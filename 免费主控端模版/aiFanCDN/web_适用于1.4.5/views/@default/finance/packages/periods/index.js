Tea.context(function () {
	this.createPeriod = function () {
		teaweb.popup("/finance/packages/periods/createPopup", {
			title: '添加有效期选项',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updatePeriod = function (periodId) {
		teaweb.popup("/finance/packages/periods/period/updatePopup?periodId=" + periodId, {
			title: '修改有效期选项',
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