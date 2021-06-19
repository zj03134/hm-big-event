// 项目的统一配置文件
let baseUrl = 'http://www.itcbc.com:8080';

$.ajaxPrefilter(function (option) {
    // 统一配置url的根路径
    option.url = baseUrl + option.url;
    option.complete = function (xhr) {
        let res = xhr.responseJSON

        // 只针对失败进行提示
        if (res.status === 1) {
            layer.msg(res.message)
            if (res.message === '身份认证失败') {
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        }
    }

    // 统一配置请求头
    option.headers = {
        Authorization: localStorage.getItem('token')
    }
});