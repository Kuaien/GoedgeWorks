Tea.context(function () {
	this.updateDomainStatus = function (domainId) {
		teaweb.popup("/ns/domains/domain/updateStatusPopup?domainId=" + domainId, {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})