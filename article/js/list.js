let data = {
    pagenum: 1, // 页码，这里的1 表示获取第1页的数据
    pagesize: 2 // 每页几条数据，2表示每页2条数据
}

/************************** 分页获取数据，并渲染 *****************************/
function renderArticle() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function (res) {
            console.log(res);
            let {
                status,
                message,
                data,
                total
            } = res;
            if (status === 0) {
                // ajax请求成功后，显示页码
                showPage(total);
                let str = '';
                data.forEach(item => {
                    str += `
            <tr>
              <td>${item.title}</td>
              <td>${item.cate_name}</td>
              <td>${item.pub_date}</td>
              <td>${item.state}</td>
              <td>
                <button type="button" class="layui-btn layui-btn-xs">编辑</button>
                <button data-id="${item.id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
              </td>
            </tr>
            `;
                });
                $('tbody').html(str);
            }
        }
    })
}

renderArticle();

/************************** 分页 *****************************/
function showPage(t) {
    let laypage = layui.laypage;
    // 执行一个laypage实例
    laypage.render({
        elem: 'page', // 注意，这里的 test1 是 ID，不用加 # 号
        count: t, // 数据总数，从服务端得到
        limit: data.pagesize, // 每页显示的条数
        curr: data.pagenum, // 当前页
        // prev: '上一篇',
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 自定义排版
        limits: [2, 3, 5, 10], // 下拉框的 条数
        // 当执行一个laypage实例的时候，jump就会触发一次；后续切换页码的时候也会触发
        jump: function (obj, first) {
            // 首次不执行（页面刷新，first=true; 后续点击页码的时候first=undefined）
            if (!first) {
                // obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); // 得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); // 得到每页显示的条数
                // 刷新之后，这里不执行，点击页码的时候，这里能够执行了，并且可以获取到当前点击的页码
                data.pagenum = obj.curr;
                data.pagesize = obj.limit;
                renderArticle();
            }
        }
    });
}


/************************** 获取真实分类，并渲染 *****************************/
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


/************************** 筛选 *****************************/
$('#search').on('submit', function (e) {
    e.preventDefault();
    let cate_id = $('#category').val();
    let state = $('#state').val();
    // 设置ajax请求参数
    if (cate_id) {
        data.cate_id = cate_id;
    } else {
        delete data.cate_id; // delete是JS中的一个关键字，用于删除 对象的属性；
    }

    if (state) {
        data.state = state;
    } else {
        delete data.state;
    }

    // 筛选的时候，重置页码为 1
    data.pagenum = 1;

    renderArticle();
})
// ***************************删除***********************
// - JS代码中，事件委托的方案，给删除注册单击事件
$('tbody').on('click', 'button:contains("删除")', function (e) {
    // 阻止默认行为
    e.preventDefault();
    // 事件内部， 获取id
    let id = $(this).data('id')
    console.log(id);
    // 询问是否要删除
    layer.confirm('确认删除吗？', function (index) {
        // 如果确定删除， 则发送ajax请求， 完成删除
        $.ajax({
            url: '/my/article/delete/' + id,
            success: function (res) {
                // console.log(res);
                // 完成删除之后， 从新渲染页面
                if (res.status === 0) {
                    layer.msg(res.message)
                    renderArticle()
                }
            }
        })
        layer.close(index); // 关闭弹层
    })
})