Tea.context(function () {
	this.createUserPlan = function () {
		teaweb.popupSuccess(".createPopup", null, "26em")
	}

	this.deleteUserPlan = function (userPlanId) {
		teaweb.confirm("确定要删除此套餐吗？", function () {
			this.$post(".delete")
				.params({
					userPlanId: userPlanId
				})
				.refresh()
		})
	}

	this.renewUserPlan = function (userPlanId) {
		teaweb.popupSuccess(".renewPopup?userPlanId=" + userPlanId, null, "26em")
	}
})