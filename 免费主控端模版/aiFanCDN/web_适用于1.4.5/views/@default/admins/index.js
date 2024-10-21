Tea.context(function () {
	this.createAdmin = function () {
		teaweb.popup("/admins/createPopup", {
			title: '创建系统用户',
			height: "30em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.deleteAdmin = function (adminId) {
		let that = this
		teaweb.confirm("确定要删除此系统用户吗？", function () {
			that.$post(".delete")
				.params({
					adminId: adminId
				})
				.post()
				.refresh()
		})
	}
})