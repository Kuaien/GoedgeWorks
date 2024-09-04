Tea.context(function () {
	this.targetType = ""
	this.countServers = -1

	this.targets = []

	this.reloadCountServers = function () {
		this.countServers = -1
		this.$post(".countServers")
			.params({
				"targets": this.targets
			})
			.success(function (resp) {
				this.countServers = resp.data.countServers
			})
	}

	this.changeTargetType = function () {
		this.targets = []
		this.countServers = -1
		if (this.targetType.match(/^(user|cluster):/)) {
			this.targets = [this.targetType]
			this.reloadCountServers()
		}
	}

	this.changeUser = function (userId) {
		if (typeof userId == "number" && userId > 0) {
			this.targets = ["user:" + userId]
			this.reloadCountServers()
		} else {
			this.targets = []
			this.countServers = -1
		}
	}

	this.changeCluster = function (clusterId) {
		if (typeof clusterId == "number" && clusterId > 0) {
			this.targets = ["cluster:" + clusterId]
			this.reloadCountServers()
		} else {
			this.targets = []
			this.countServers = -1
		}
	}

	let groupIds = []
	this.changeGroupId = function (groupId) {
		if (groupIds.$contains(groupId)) {
			groupIds.$removeValue(groupId)
		} else {
			groupIds.push(groupId)
		}
		if (groupIds.length > 0) {
			this.targets = ["groups:" + groupIds.join(",")]
			this.reloadCountServers()
		} else {
			this.targets = []
			this.countServers = -1
		}
	}

	this.isRequesting = false
	this.before = function () {
		this.isRequesting = true
	}

	this.done = function () {
		this.isRequesting = false
	}
})