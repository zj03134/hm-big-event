// 切换两个盒子
$('.login a').on('click', function () {
    $('.register').show()
})
$('.register a').on('click', function () {
    $('.register').hide()
})

// 表单提交 -> 阻止默认行为 -> 收集表单数据（查询字符串） -> ajax提交
$('.register form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault();
    // 收取表单数据 序列化表单项 serialize()
    var data = $(this).serializeArray();
    // console.log(data)
    // ajax提交
    $.ajax({
        type: "POST",
        url: "/api/reguser",
        data: data,
        success: function (res) {
            console.log(res);
            // 判断如果status等于0的话就注册成功
            if (res.status === 0) {
                // 提示
                layer.msg(res.message)
                // 清空输入框
                $('.layui-input').val('')
                // $('.register form')[0].reset()
                // 切换到登录的盒子
                $('.login').show().next().hide()
            } else {
                // 提示
                layer.msg(res.message)
            }
        }
    });
})

//-------------------表单验证--------------------------
// 用户名长度2-10位
// 密码长度6-12位
// 两次密码必须一致

// 使用layui的面容之前1，必须先加载模块
// 加载语法 let xx= layui.模块名(form)

// 加载表单模块
let form = layui.form;
// 表单验证
form.verify({
    // 键(规则名称)：值(验证方法)===>规则名称：[]   

    //规则名：['正则','验证不通过时的提示']
    user: [/^\w{2,10}$/, '用户名长度必须是2~10位~~~'],
    pwd: [/^\w{6,12}$/, '密码长度必须是6~12位~~~'],
    same: function (val) {
        // 形参val表示的是使用该规则的输入框的值
        // 案例中，确认密码框使用了这个验证规则
        let pwd = $('.pwd').val()
        // 判断如果不等就弹出
        if (pwd !== val) {
            return '请注意，两次密码不一致'
        }
    }
})


// -----------登录功能----------------
$('.login form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    let data = $(this).serialize()
    $.ajax({
        type: 'POST',
        url: '/api/login',
        data: data,
        success: function (res) {
            console.log(res);
            // 判断如果登录成功就跳转
            if (res.status === 0) {
                // 设置保存到localStorage
                localStorage.setItem('token', res.token)
                // alert(res.message)
                layer.msg(res.message, {
                    time: 5000,
                    function () {}

                })
                location.href = 'http://127.0.0.1:5500/index.html'
            }
        }
    })
})