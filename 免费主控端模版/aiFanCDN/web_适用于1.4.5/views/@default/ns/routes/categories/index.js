Tea.context(function () {
	this.$delay(function () {
		let that = this
		sortTable(function (ids) {
			that.$post(".sort")
				.params({
					categoryIds: ids
				})
				.success(function () {
					teaweb.successToast("排序保存成功")
				})
		})
	})

	this.createCategory = function () {
		teaweb.popup(".createPopup", {
			title: '创建分类',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updateCategory = function (categoryId) {
		teaweb.popup(".category.updatePopup?categoryId=" + categoryId, {
			title: '修改分类',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deleteCategory = function (categoryId) {
		let that = this
		teaweb.confirm("确定要删除此分类吗？", function () {
			this.$post(".category.delete")
				.params({
					categoryId: categoryId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})

		})
	}
})