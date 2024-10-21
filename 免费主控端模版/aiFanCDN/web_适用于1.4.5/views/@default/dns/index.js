Tea.context(function () {
	this.updateCluster = function (clusterId) {
		teaweb.popup("/dns/updateClusterPopup?clusterId=" + clusterId, {
			title: '修改集群DNS设置',
			height: "25em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}
})