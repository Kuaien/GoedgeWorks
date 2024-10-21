Tea.context(function () {
	this.createUserPackage = function () {
		teaweb.popup("/finance/packages/user-packages/createPopup", {
			title: '添加用户流量包',
			width: "44em",
			height: "28em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deleteUserPackage = function (userPackageId) {
		let that = this
		teaweb.confirm("确定要删除此用户流量包吗？", function () {
			that.$post(".delete")
				.params({
					userPackageId: userPackageId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}
})