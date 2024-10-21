Tea.context(function () {
	this.deleteCluster = function (clusterId) {
		let that = this

		let message = "确定要删除此集群吗？"
		if (this.countDomains > 0) {
			message = "当前集群上部署了" + this.countDomains + "个域名，确定要删除此集群吗？"
		}

		teaweb.confirm(message, function () {
			that.$post("/ns/clusters/cluster/delete")
				.params({
					clusterId: clusterId
				})
				.success(function () {
					teaweb.success("删除成功", function () {
						window.location = "/ns/clusters"
					})
				})
		})
	}
})