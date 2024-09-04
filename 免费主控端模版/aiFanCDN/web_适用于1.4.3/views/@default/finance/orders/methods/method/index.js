Tea.context(function () {
	this.urlArgs = ""
	if (this.method.url.indexOf("?") < 0) {
		this.urlArgs += "?"
	}
	this.urlArgs += "EdgeOrderMethod=" + this.method.code + "&EdgeOrderCode=$订单号&EdgeOrderAmount=$支付金额&EdgeOrderTimestamp=$时间戳&EdgeOrderSign=$参数签名"
})