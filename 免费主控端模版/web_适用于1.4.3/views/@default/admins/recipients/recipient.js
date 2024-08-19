Tea.context(function () {
	this.deleteReceiver = function (receiverId) {
		let that = this
		teaweb.confirm("确定要取消当前接收人和集群的关联吗？", function () {
			that.$post("/admins/recipients/receivers/delete")
				.params({
					receiverId: receiverId
				})
				.success(function () {
					teaweb.reload()
				})
		})
	}
})