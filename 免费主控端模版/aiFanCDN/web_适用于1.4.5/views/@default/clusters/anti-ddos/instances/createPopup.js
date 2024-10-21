Tea.context(function () {
	this.packageId = "0";

	this.ipValidator = function (ip) {
		if (teaweb.validateIP(ip)) {
			return {
				isOk: true
			}
		}
		return {
			isOk: false,
			message: "请输入正确的IP"
		}
	}
})