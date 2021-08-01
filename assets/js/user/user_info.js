$(function () {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        // 设置昵称的验证规则
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间';
            }
        }
    });
    initUserInfo();
    // 获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                form.val('formUserInfo', res.data);
            }
        });
    }

    // 更新用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: form.val('formUserInfo'),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败');
                }
                // 调用iframe标签外页面的方法，重新渲染用户信息和头像
                window.parent.getUserInfo();
                return layer.msg('用户信息修改成功');
            }
        });
    });

    // 重置表单数据
    $('#resetUserInfo').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    });

});