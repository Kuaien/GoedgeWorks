Tea.context(function () {
	this.isRequesting = true

	this.$delay(function () {
		this.reload()
	})

	this.updateCluster = function (clusterId) {
		let that = this
		teaweb.popup("/dns/updateClusterPopup?clusterId=" + clusterId, {
			title: '修改集群DNS设置',
			height: "25em",
			callback: function () {
				teaweb.success("保存成功", function () {
					that.reload()
				})
			}
		})
	}

	this.updateNode = function (clusterId, nodeId) {
		let that = this
		teaweb.popup("/dns/issues/updateNodePopup?clusterId=" + clusterId + "&nodeId=" + nodeId, {
			title: '修改节点DNS设置',
			width: "46em",
			height: "26em",
			callback: function () {
				teaweb.success("保存成功", function () {
					that.reload()
				})
			}
		})
	}

	this.reload = function () {
		this.isRequesting = true
		this.$post("$")
			.success(function (resp) {
				this.issues = resp.data.issues;
			})
			.done(function () {
				this.isRequesting = false
			})
	}
})