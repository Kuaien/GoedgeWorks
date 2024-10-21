Tea.context(function () {
	this.$delay(function () {
		let that = this
		sortTable(function (ids) {
			that.$post(".sort")
				.params({
					regionIds: ids
				})
				.success(function () {
					teaweb.successToast("排序保存成功")
				})
		})
	})

	this.createRegion = function () {
		teaweb.popup(Tea.url(".createPopup"), {
			title: '创建区域',
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.updateRegion = function (regionId) {
		teaweb.popup(Tea.url(".updatePopup?regionId=" + regionId), {
			title: '编辑区域',
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.deleteRegion = function (regionId) {
		let that = this
		teaweb.confirm("确定要删除这个区域吗？", function () {
			that.$post(".delete")
				.params({
					regionId: regionId
				})
				.refresh()
		})
	}
})