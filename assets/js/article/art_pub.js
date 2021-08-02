$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 加载文章分类的方法
    inifCate();
    function inifCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("加载文章失败");
                }
                var cateListStr = template('cateList', res);
                $("[name='cate_id']").html(cateListStr);
                // 动态添加的下拉选项，要调用render函数重新渲染
                form.render();
            }
        });
    }

    // 初始化富文本编辑器
    initEditor();


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面按钮添加事件
    $('#btnChooseImage').on("click", function (e) {
        $('#coverFile').click();
    });

    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0];
        if (file.length === 0) {
            return false
        }
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 文章的发布状态
    var art_state = '已发布';

    // 为存为草稿按钮绑定事件
    $('#saveDraft').on('click', function () {
        art_state = '草稿';
    });

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        // 组织表单的默认行为
        e.preventDefault();
        // 基于form表单创建一个FormData对象
        var formData = new FormData($(this)[0]);

        formData.append('state', art_state);

        // 将封面裁剪后的图片输出成一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                formData.append('cover_img', blob);
            })


        publishArticle(formData);

    });


    // 发布ajax请求发布文章
    function publishArticle(formData) {

        $.ajax({
            url: '/my/article/add',
            method: 'POST',
            data: formData,
            // 向服务器发送FormData对象的数据需要添加以下配置
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(1);
                if (res.status !== 0) {
                    return layer.msg("发布文章失败");
                }
                layer.msg("发布文章成功");
                location.href = '/article/art_list.html';
            }
        });
    }

});