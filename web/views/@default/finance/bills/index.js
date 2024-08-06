Tea.context(function () {
	this.payBill = function (billId) {
		teaweb.confirm("确定要使用用户账户支付此账单吗？ ", function () {
			this.$post(".pay")
				.params({
					billId: billId
				})
				.success(function () {
					teaweb.success("支付成功", function () {
						teaweb.reload()
					})
				})
		})
	}
})