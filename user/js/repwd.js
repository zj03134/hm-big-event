// 输入的密码是提交
$('form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
        type: 'POST',
        url: '/my/user/updatepwd',
        data: data,
        success: function (res) {
            // 如果成功
            if (res.status === 0) {
                layer.msg(res.message)
            }
        }
    })
})
// 表单验证
let form = layer.form;
form.verify({
    // 键(规则名称)：值(验证方法)===>规则名称：[]   

    //规则名：['正则','验证不通过时的提示']
    user: [/^\w{2,10}$/, '用户名长度必须是2~10位~~~'],
    pwd: [/^\w{6,12}$/, '密码长度必须是6~12位~~~'],
    same: function (val) {
        // 形参val表示的是使用该规则的输入框的值
        // 案例中，确认密码框使用了这个验证规则
        let pwd = $('input[name=newPwd]').val()
        // 判断如果不等就弹出
        if (pwd !== val) {
            return '请注意，两次密码不一致'
        }
    }
})