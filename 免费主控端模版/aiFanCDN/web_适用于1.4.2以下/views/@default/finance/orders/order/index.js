Tea.context(function () {
	this.finishOrder = function () {
		let that = this
		teaweb.confirm("html:确定要将此订单设置为完成状态吗？<br/>订单完成后对应的账户余额和服务状态将会发生变化。", function () {
			that.$post("/finance/orders/order/finish")
				.params({
					orderCode: that.order.code
				})
				.success(function () {
					teaweb.success("操作成功", function () {
						teaweb.reload()
					})
				})
		})
	}
})