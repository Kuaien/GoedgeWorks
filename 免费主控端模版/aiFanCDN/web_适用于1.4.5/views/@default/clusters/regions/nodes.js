Tea.context(function () {
	this.updateNodeRegion = function (node) {
		let nodeId = node.id
		let regionId = (node.region ? node.region.id : 0)

		teaweb.popup(Tea.url(".updateNodeRegionPopup", {
			title: "修改节点区域",
			nodeId: nodeId,
			regionId: regionId,
		}), {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})