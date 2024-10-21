Tea.context(function () {
	this.tcpNetwork="";
	this.type = ""
	this.syslogPriority = ""

	/**
	 * syslog
	 */
	this.syslogProtocol = "none"

	/**
	 * Elastic Search
	 */
	this.esIsDataStream = false
})