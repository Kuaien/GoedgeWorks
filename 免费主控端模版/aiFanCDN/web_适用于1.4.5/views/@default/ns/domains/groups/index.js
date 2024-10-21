Tea.context(function () {
	this.createGroup = function () {
		teaweb.popup("/ns/domains/groups/createPopup", {
			title: '创建分组',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.updateGroup = function (groupId) {
		teaweb.popup("/ns/domains/groups/group/updatePopup?groupId=" + groupId, {
			title: '修改分组',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}

	this.deleteGroup = function (groupId) {
		let that = this
		teaweb.confirm("确定要删除此分组吗？", function () {
			that.$post("/ns/domains/groups/group/delete")
				.params({
					groupId: groupId
				})
				.success(function () {
					teaweb.successRefresh("删除成功")
				})
		})
	}
})