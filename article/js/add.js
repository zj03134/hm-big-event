// 富文本
tinymce.init({
    selector: '#editor',
    height: 500,
    menubar: true
})
// *************************************图片**************
let $image = $('#image');
let option = {
    // 宽高比
    aspectRatio: 1,
    preview: '.img-preview'
}
$image.cropper(option)

// 选择图片上传
$('#btn').on('click', function () {
    $('#file').trigger('click')
})

//************************** 获取真实分类，并渲染 *****************************
$.ajax({
    url: '/my/category/list',
    success: function (res) {
        if (res.status === 0) {
            let str = '';
            res.data.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`;
            });
            $('#category').append(str);
            // 更新渲染
            let form = layui.form;
            form.render('select');
        }
    }
});

// *******************************最后的添加***************************
$('form').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault()
    // 收集数据
    let fd = new FormData(this)
    // 修改原来的content的值
    fd.set('content', tinyMCE.activeEditor.getContent())
    // 剪裁图片
    let canvas = $image.cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    })
    canvas.toBlob(function (blob) {
        fd.append('.cover_img', blob)
    })
    // 提交数据
    $.ajax({
        type: 'POST',
        url: '/my/article/add',
        data: fd,
        processData: false, // 不要处理数据；意思是不要把对象形式的fd转换成查询字符串形式
        contentType: false, // 不要加默认的请求头（application/x-www-for
        success: function (res) {
            if (res.status === 0) {
                layer.msg(res.message)
                location.href = 'http://127.0.0.1:5500/article/list.html'
            }
        }
    })
})