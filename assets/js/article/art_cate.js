$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 获取文章分类的列表数据
    initArticleList();
    function initArticleList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败");
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        });
    }

    // 添加分类按钮
    var indexAddPane = null;
    $('#addCate').on('click', function (e) {
        indexAddPane = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '300px'],
            content: $('#tpl-addCate').html()
        });
    });

    // 通过事件代理的方式绑定表单提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("添加分类失败");
                }
                initArticleList();
                layer.msg("新增分类成功");
                // 根据索引关闭弹出层
                layer.close(indexAddPane);
            }
        });
    });
    var indexEdit = null;
    // 通过事件代理的方式绑定表单编辑事件
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '300px'],
            content: $('#tpl-editCate').html()
        });
        var id = $(this).attr('data-id');
        $.ajax({
            url: '/my/article/cates/' + id,
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("修改文章分类失败");
                }
                form.val('form-edit', res.data);
            }
        });
    });

    // 通过事件委托为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("修改分类名称失败");
                }
                layer.msg("修改分类名称成功");
                layer.close(indexEdit);
                initArticleList();
            }
        });

    });

    // 通过事件委托为删除分类按钮添加事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).prev().attr('data-id');
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'GET',
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败");
                    }
                    layer.msg("删除成功");
                    initArticleList();
                }
            });

            layer.close(index);
        });
    });


});