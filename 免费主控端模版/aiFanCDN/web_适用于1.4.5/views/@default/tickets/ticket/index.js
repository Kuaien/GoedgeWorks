Tea.context(function () {
	this.reply = function (ticketId) {
		teaweb.popup("/tickets/ticket/createLogPopup?ticketId=" + ticketId, {
			title: '工单回复',
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})