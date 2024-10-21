Tea.context(function () {
	this.$delay(function () {
		this.sortTable()
	})

	this.createPlan = function () {
		teaweb.popup("/ns/plans/createPopup", {
			title: '创建套餐',
			width: "42em",
			height: "30em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updatePlan = function (planId) {
		teaweb.popup("/ns/plans/plan/updatePopup?planId=" + planId, {
			title: '修改套餐',
			width: "42em",
			height: "30em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deletePlan = function (planId) {
		let that = this
		teaweb.confirm("确定要删除此套餐吗？", function () {
			that.$post("/ns/plans/plan/delete")
				.params({
					planId: planId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}

	this.sortTable = function () {
		let that = this
		sortTable(function (ids) {
			that.$post("/ns/plans/sort")
				.params({
					ids: ids
				})
				.success(function () {
					teaweb.successToast("保存成功", 1000)
				})
		})
	}
})