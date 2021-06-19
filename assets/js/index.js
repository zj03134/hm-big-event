function getUserInfo() {
    $.ajax({
        url: '/my/user/userinfo',
        success: function (res) {
            // console.log(res);
            if (res.status === 0) {
                // 1. 设置欢迎你 xxx （优先使用昵称，没有昵称，使用账号）
                let name = res.data.nickname || res.data.username;
                $('.username').text(name);

                // 2. 设置头像（优先使用图片，没有图片只能截取name的首字母）
                if (res.data.user_pic) {
                    // 有图片类型的头像
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.text-avatar').hide(); // 这一点，更换头像的时候，再讲一次
                } else {
                    // 没有图片类型的头像
                    let first = res.data.username.substring(0, 1).toUpperCase();
                    $('.text-avatar').text(first).css('display', 'inline-block');
                }

            }
        }
    });
}

getUserInfo();

// --------------退出------------
// 点击退出->询问--->移除token&& 跳转到login.html
$('#logout').on('click', function () {
    // 阻止默认行为

    layer.confirm('您真的确认要退出吗？', function (index) {
        //do something
        // 移除token
        localStorage.removeItem('token')
        location.href = 'http://127.0.0.1:5500/login.html'
        layer.close(index);
    });

})