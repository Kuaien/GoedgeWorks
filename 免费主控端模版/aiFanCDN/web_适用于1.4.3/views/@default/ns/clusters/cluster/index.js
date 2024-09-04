Tea.context(function () {
	// 显示的统计项
	this.windowWidth = window.innerWidth
	this.miniWidth = 760
	this.columnWidth1 = 750
	this.columnWidth2 = 850
	this.columnWidth3 = 950
	this.columnWidth4 = 1050
	this.columnWidth5 = 1100

	let that = this
	window.addEventListener("resize", function () {
		that.windowWidth = window.innerWidth
	})

	this.$delay(function () {
		this.checkPorts()
	})

	this.deleteNode = function (nodeId) {
		teaweb.confirm("确定要删除这个节点吗？", function () {
			this.$post("/ns/clusters/cluster/deleteNode")
				.params({
					nodeId: nodeId
				})
				.refresh();
		})
	}

	this.upNode = function (nodeId) {
		teaweb.confirm("确定要手动上线此节点吗？", function () {
			this.$post("/ns/clusters/cluster/node/up")
				.params({
					nodeId: nodeId
				})
				.refresh()
		})
	}

	let checkingPort = ""
	this.checkPorts = function () {
		let ipList = []
		this.nodes.forEach(function (node) {
			if (node.isOn) {
				if (node.ipAddresses != null && node.ipAddresses.length > 0) {
					node.ipAddresses.forEach(function (addr) {
						if (addr.isOn && addr.canAccess && addr.isUp && addr.ip.length > 0 && !ipList.$contains(addr.ip)) {
							ipList.push(addr.ip)
						}
					})
				}
			}
		})
		if (ipList.length > 0) {
			this.$post(".checkPorts")
				.params({
					clusterId: this.clusterId,
					ip: ipList
				})
				.success(function (resp) {
					let results = resp.data.results
					if (results.length > 0) {
						checkingPort = resp.data.port
						let errorMap = {}
						let hasErrors = false
						results.forEach(function (result) {
							if (!result.isOk) {
								errorMap[result.ip] = result
								hasErrors = true
							}
						})

						if (hasErrors) {
							this.nodes.forEach(function (node) {
								if (node.isOn) {
									if (node.ipAddresses != null && node.ipAddresses.length > 0) {
										node.ipAddresses.forEach(function (addr, index) {
											if (addr.isOn && addr.canAccess && addr.isUp && addr.ip.length > 0) {
												if (typeof errorMap[addr.ip] == "object") {
													addr.hasError = true
													addr.err = errorMap[addr.ip].err
													Vue.set(node.ipAddresses, index, addr)
												}
											}
										})
									}
								}
							})
						}
					}
				})
		}
	}

	this.showPortError = function (addr) {
		teaweb.popupTip("udp://" + addr.ip + ":" + checkingPort + " 端口连接错误（提示：" + addr.err + "），请检查：<br/>1）节点IP地址是否填写正确；<br/>2）节点程序（edge-dns）是否已正确安装；<br/>3）是否已在防火墙和安全策略中正确设置 " + checkingPort + "/udp 端口；<br/>4）如在客户端手动测试正常，可以忽略此提示。")
	}
})