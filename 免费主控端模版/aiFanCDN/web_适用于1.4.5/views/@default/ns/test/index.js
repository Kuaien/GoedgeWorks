Tea.context(function () {
	this.ip = ""
	this.type = ""
	this.ports = []
	this.port = ""

	this.clusterId = 0
	if (this.clusters.length > 0) {
		this.clusterId = this.clusters[0].id
		this.$delay(function () {
			this.changeCluster()
		})
	}

	this.nodeId = 0
	this.nodes = []
	this.selectedNode = null

	this.isDoing = false
	this.result = null

	this.before = function () {
		this.isDoing = true
		this.result = null
	}

	this.success = function (resp) {
		this.result = resp.data
	}

	this.done = function () {
		this.isDoing = false
	}

	this.changeCluster = function () {
		this.nodeId = 0
		this.$post(".nodeOptions")
			.params({
				clusterId: this.clusterId
			})
			.success(function (resp) {
				this.nodes = resp.data.nodes
				if (this.nodes.length > 0) {
					this.nodeId = this.nodes[0].id
					this.changeNode()
				}
				this.ports = resp.data.ports
				if (this.ports.length > 0) {
					this.port = this.ports[0].port + "/" + this.ports[0].protocol
				}
			})
	}

	this.changeNode = function () {
		let that = this
		this.selectedNode = this.nodes.$find(function (k, v) {
			return v.id == that.nodeId
		})
	}

	this.domain = ""
	this.changeDomain = function () {
		let newDomain = this.domain.replace(/\s+/, "")
		if (newDomain != this.domain) {
			this.domain = newDomain
		}
	}
})