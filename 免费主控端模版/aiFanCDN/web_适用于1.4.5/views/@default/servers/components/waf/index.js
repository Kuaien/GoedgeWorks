Tea.context(function () {
	// 创建策略
	this.createPolicy = function () {
		teaweb.popup("/servers/components/waf/createPopup", {
			title: '创建WAF策略',
			height: "27em",
			callback: function () {
				teaweb.success("保存成功", function () {
					window.location.reload()
				})
			}
		})
	}

	// 删除策略
	this.deletePolicy = function (policyId) {
		let that = this
		teaweb.confirm("确定要删除此WAF策略吗？", function () {
			that.$post("/servers/components/waf/delete")
				.params({
					firewallPolicyId: policyId
				})
				.refresh()
		})
	}
})