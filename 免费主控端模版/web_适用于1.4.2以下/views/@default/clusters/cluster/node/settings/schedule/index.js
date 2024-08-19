Tea.context(function () {
	this.success = NotifyReloadSuccess("保存成功")

	this.scheduleIsEditing = false

	this.editSchedule = function () {
		this.scheduleIsEditing = !this.scheduleIsEditing
	}

	this.createAction = function () {
		teaweb.popup(".actions.createPopup?nodeId=" + this.schedule.id, {
			height: "26em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.deleteAction = function (actionId) {
		teaweb.confirm("确定要删除此调度动作吗？", function () {
			this.$post(".actions.delete")
				.params({
					actionId: actionId
				})
				.success(function () {
					teaweb.reload()
				})
		})
	}

	this.updateAction = function (actionId) {
		teaweb.popup(".actions.updatePopup?actionId=" + actionId, {
			height: "26em",
			callback: function () {
				teaweb.success("保存成功", function () {
					teaweb.reload()
				})
			}
		})
	}

	this.resetActionStatus = function () {
		teaweb.confirm("确定要重置当前节点的状态吗？", function () {
			this.$post(".resetActionStatus")
				.params({
					nodeId: this.schedule.id
				})
				.success(function () {
					teaweb.successRefresh("重置成功")
				})
		})
	}

	this.showActionsCopyOps = false

	this.copyActionsToGroup = function () {
		teaweb.confirm("确定要复制当前节点的调度动作到所在分组吗？", function () {
			this.$post(".actions.copyToGroup")
				.params({
					nodeId: this.schedule.id
				})
				.success(function () {
					teaweb.successRefresh("同步成功")
				})
		})
	}

	this.copyActionsToCluster = function () {
		teaweb.confirm("确定要复制当前节点的调度动作到所在分组吗？", function () {
			this.$post(".actions.copyToCluster")
				.params({
					nodeId: this.schedule.id
				})
				.success(function () {
					teaweb.successRefresh("同步成功")
				})
		})
	}

	// 排序
	this.$delay(function () {
		let that = this
		sortTable(function (actionIds) {
			that.$post(".actions.updateOrders")
				.params({
					nodeId: that.schedule.id,
					actionIds: actionIds
				})
				.success(function () {
					teaweb.success("保存成功")
				})
		})
	})
})