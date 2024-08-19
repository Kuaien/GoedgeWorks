Tea.context(function () {
	this.success = function () {
		let that = this
		teaweb.success("保存成功", function () {
			window.location = "/finance/orders/methods/method?methodId=" + that.method.id
		})
	}
})