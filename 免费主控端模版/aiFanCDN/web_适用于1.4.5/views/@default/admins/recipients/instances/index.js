Tea.context(function () {
    this.createInstance = function () {
        teaweb.popup(Tea.url(".createPopup"), {
            title: "创建接收媒介",
            height: "30em",
            callback: function () {
                teaweb.success("保存成功", function () {
                    teaweb.reload()
                })
            }
        })
    }

    this.deleteInstance = function (instanceId) {
        teaweb.confirm("确定要删除此接收媒介吗？", function () {
            this.$post(".delete")
                .params({instanceId: instanceId})
                .success(function () {
                    teaweb.success("删除成功", function () {
                        teaweb.reload()
                    })
                })
        })
    }
})