// 进入页面，马上进行数据回填操作
function renderUser() {
    // 获取用户信息
    $.ajax({
        url: '/my/user/userinfo',
        success: function (res) {
            // console.log(res);
            if (res.status === 0) {
                // 设置输入框的默认值
                // $('input[name=username]').val(res.data.username)

                // 第二种方法
                let form = layui.form;
                // 为表单赋值(数据回填)
                form.val('user', res.data)
            }
        }
    })

}
renderUser()

// 用户信息提交
// 禁用username的输入框
$('form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
        type: 'POST',
        url: '/my/user/userinfo',
        data: data,
        success: function (res) {
            // console.log(res);
            // 判断如果成功得话
            if (res.status === 0) {
                layer.msg(res.message)
                // 调用函数更新左上角的昵称和头像
                // 函数是父页面的函数，调用方式需要再函数前
                window.parent.getUserInfo()
            }
        }
    })
})

// -----------重置-------------
$('button[type=reset]').on('click', function (e) {
    // 阻止默认行为
    e.preventDefault()
    // 调用数据回填函数
    renderUser()
})