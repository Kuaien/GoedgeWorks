Tea.context(function () {
	// 创建节点
	this.createNode = function () {
		teaweb.popup("/settings/userNodes/node/createPopup", {
			title: '添加用户节点',
			width: "50em",
			height: "30em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	// 删除节点
	this.deleteNode = function (nodeId) {
		let that = this
		teaweb.confirm("确定要删除此节点吗？", function () {
			that.$post("/settings/userNodes/delete")
				.params({
					nodeId: nodeId
				})
				.refresh()
		})
	}
})