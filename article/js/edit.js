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


// 获取地址栏的id，这个id是文章的id；
var id = location.search.substr(4);
// console.log(id);


// -------------------------- 获取分类，渲染到下拉框的位置 --------
$.ajax({
    type: 'POST',
    url: '/my/article/update',
    success: function (res) {
        let arr = [];
        res.data.forEach(item => {
            arr.push(`<option value="${item.id}">${item.name}</option>`);
        })
        // $('#category').append(str);
        $('select[name=cate_id]').append(arr.join(''));
        // 更新渲染
        // form.render('select', 'lay-filter属性值');
        form.render('select');
        // 下拉框的分类渲染完成，然后再去发送ajax请求，获取文章详情
        // 根据id可以获取文章详情（标题、内容、状态、图片.....）全部获取到
        $.ajax({
            // url: '/my/article/:id', // 把 :id 换成真实的id即可
            url: '/my/article/' + id,
            success: function (res) {
                // console.log(res);
                // 获取到详情后，做数据回填 (使用layui提供的 form.val())
                form.val('article', res.data);
                // 一定先做数据回填，然后在把 textarea 换成 富文本编辑器
                initEditor();
                // 更换图片(销毁剪裁区 --> 更换图片 --> 重建剪裁区)
                $image
                    .cropper('destroy')
                    .attr('src', baseUrl + '/' + res.data.cover_img)
                    .cropper(options);
            }
        });
    }
});
var options = {
    // 宽高比
    aspectRatio: 400 / 280,
    autoCropArea: 1, // 让剪裁框铺满整个剪裁区
    // 设置预览区的选择器
    preview: '.img-preview'
};