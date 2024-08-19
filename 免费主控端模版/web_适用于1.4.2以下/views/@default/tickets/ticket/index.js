Tea.context(function () {
	this.reply = function (ticketId) {
		teaweb.popup("/tickets/ticket/createLogPopup?ticketId=" + ticketId, {
			callback: function () {
				teaweb.successRefresh("保存成功")
			}
		})
	}
})