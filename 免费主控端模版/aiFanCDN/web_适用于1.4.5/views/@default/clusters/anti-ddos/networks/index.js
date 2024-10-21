Tea.context(function () {
	this.createNetwork = function () {
		teaweb.popup(".createPopup", {
			title: "创建线路",
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updateNetwork = function (networkId) {
		teaweb.popup(".network.updatePopup?networkId=" + networkId, {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deleteNetwork = function (networkId) {
		let that = this
		teaweb.confirm("确定要删除此线路吗？", function () {
			that.$post(".network.delete")
				.params({
					networkId: networkId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}
})