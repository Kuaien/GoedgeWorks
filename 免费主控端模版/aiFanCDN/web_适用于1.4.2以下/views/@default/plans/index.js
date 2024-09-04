Tea.context(function () {
	this.$delay(function () {
		this.sortTable()
	})

	this.deletePlan = function (planId) {
		teaweb.confirm("确定要删除此套餐吗？", function () {
			this.$post(".plan.delete")
				.params({
					planId: planId
				})
				.refresh()
		})
	}

	this.sortTable = function () {
		let that = this
		sortTable(function (ids) {
			that.$post(".sort")
				.params({
					ids: ids
				})
				.success(function () {
					teaweb.successToast("保存成功", 1000)
				})
		})
	}
})