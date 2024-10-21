Tea.context(function () {
	this.createCategory = function () {
		teaweb.popup("/tickets/categories/createPopup", {
			title: '添加分类',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updateCategory = function (categoryId) {
		teaweb.popup("/tickets/categories/category/updatePopup?categoryId=" + categoryId, {
			title: '修改分类',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deleteCategory = function (categoryId) {
		let that = this
		teaweb.confirm("确定要删除此分类吗？", function () {
			that.$post("/tickets/categories/category/delete")
				.params({
					categoryId: categoryId
				})
				.success(function () {
					teaweb.reload()
				})
		})
	}
})