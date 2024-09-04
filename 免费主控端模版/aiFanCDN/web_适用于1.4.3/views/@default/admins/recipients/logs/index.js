Tea.context(function () {
	this.resendTask = function (taskId) {
		let that = this
		teaweb.confirm("确定要重新发送此消息吗？", function () {
			that.$post(".updateTaskStatus")
				.params({
					taskId: taskId,
					status: 0
				})
				.success(function () {
					teaweb.success("已成功重新放入发送队列", function () {
						teaweb.reload()
					})
				})
		})
	}
})