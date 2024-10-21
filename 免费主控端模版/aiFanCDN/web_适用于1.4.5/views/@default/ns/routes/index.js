Tea.context(function () {
	this.$delay(function () {
		let that = this
		sortTable(function (ids) {
			that.$post(".sort")
				.params({
					routeIds: ids
				})
				.success(function () {
					teaweb.successToast("排序保存成功")
				})
		})
	})

	this.createRoute = function () {
		teaweb.popup("/ns/routes/createPopup", {
			title: '创建线路',
			width: "50em",
			height: "30em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.updateRoute = function (routeId) {
		teaweb.popup("/ns/routes/updatePopup?routeId=" + routeId, {
			title: '修改线路',
			width: "50em",
			height: "30em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.deleteRoute = function (routeId) {
		let that = this
		teaweb.confirm("确定要删除此线路吗？", function () {
			that.$post(".delete")
				.params({
					routeId: routeId
				})
				.success(function () {
					teaweb.reload()
				})
		})
	}
})