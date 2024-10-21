Tea.context(function () {
	this.createMethod = function () {
		teaweb.popup("/finance/orders/methods/createPopup", {
			title: '添加支付方式',
			height: "27em",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deleteMethod = function (methodId) {
		let that = this

		teaweb.confirm("确定要删除此支付方式吗？", function () {
			that.$post("/finance/orders/methods/method/delete")
				.params({
					methodId: methodId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}
})