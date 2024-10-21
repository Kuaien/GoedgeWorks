Tea.context(function () {
	this.success = NotifyReloadSuccess("保存成功")

	this.defaultClusterId = this.config.defaultClusterId

	this.clusterIdUpdating = false
	this.changeClusterId = function (clusterId) {
		this.clusterIdUpdating = true
		this.clusterHosts = []
		this.defaultClusterId = clusterId

		this.$post(".clusterHosts")
			.params({
				clusterId: clusterId
			})
			.success(function (resp) {
				this.clusterHosts = resp.data.hosts
			})
			.done(function () {
				this.clusterIdUpdating = false
			})
	}
})