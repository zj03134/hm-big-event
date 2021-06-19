// 数据渲染
function renderCategory() {
    $.ajax({
        url: '/my/category/list',
        success: function (res) {
            if (res.status === 0) {
                let str = ''
                res.data.forEach(item => {
                    str += `<tr>
                    <td>${item.name}</td>
                    <td>${item.alias}</td>
                    <td>
                        <button type="button" class="layui-btn layui-btn-sm">编辑</button>
                        <button  data-id='${item.id}' type="button" class="layui-btn layui-btn-sm layui-btn-danger">删除</button>
                    </td>
                </tr>`;
                })
                $('tbody').html(str)
            }
        }
    })
}
renderCategory()
let addIndex
// 点击按钮弹出显示层
$('button:contains("添加类别")').on('click', function () {
    addIndex = layer.open({
        title: '添加分类',
        content: $('#tpl-add').html(),
        area: ['500px', '350px']
    });

})


// 表单提交  事件委派
$('body').on('submit', '#add-form', function (e) {
    // 阻止默认行为
    e.preventDefault()
    $.ajax({
        url: '/my/category/add',
        type: 'POST',
        data: $(this).serialize(),
        success: function (res) {
            // console.log(res);
            if (res.status === 0) {
                layer.msg(res.message)
                renderCategory() //更新页面数据
                layer.close(addIndex) //关闭弹出层
            }
        }
    })
})

// ----------------删除分类--------------
// 事件委托的方式注册单击事件-->获取
$('tbody').on('click', 'button:contains("删除")', function () {
    // 获取id
    let id = $(this).data('id') //data-xxx=xxx
    console.log(id);
    // 询问
    layer.confirm('确认要删除吗？', function (index) {
        // 发送ajax请求
        $.ajax({
            url: '/my/category/delete',
            data: {
                id: id //id=0(查询字符串)     
            }, //对象形式(data:{id:id})
            success: function (res) {
                if (res.status === 0) {
                    layer.msg(res.message);
                    renderCategory();
                }
            }
        })
        // 改变弹出框
        layer.close(index)
    })
})




// ------------------修改分类----------------
let editIndex;
// 1、点击 编辑 按钮 ，出现弹层
$('tbody').on('click', 'button:contains("编辑")', function () {
    // alert(123)
    let shuju = $(this).data() //不给data传递参数
    editIndex = layer.open({
        type: 1,
        title: '修改分类',
        content: $('#tpl-edit').html(),
        area: ['500px', '350px'],
        success: function () {

        }
    });
})
// 2、设置弹出中的表单

// 3、数据回填

// 4、表单提交，完成修改
// 表单提交  事件委派
$('body').on('submit', '#edit-form', function (e) {
    // 阻止默认行为
    e.preventDefault()
    $.ajax({
        url: '/my/category/add',
        type: 'POST',
        data: $(this).serialize(),
        success: function (res) {
            console.log(res);
            if (res.status === 0) {
                layer.msg(res.message)
                renderCategory() //更新页面数据
                layer.close(editIndex) //关闭弹出层
                renderUser()
            }
        }
    })
})