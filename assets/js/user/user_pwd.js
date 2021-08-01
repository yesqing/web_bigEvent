$(function () {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if(value === $('[name="oldPwd"]').val()){
                return "新旧密码不能相同";
            }
        },
        rePwd: function (value) {
            if(value !== $('[name="newPwd"]').val()){
                return "两次输入密码不一致";
            }
        }
    });

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg('更新密码失败');
                }
                // jquery没有重置表单的方法，使用原生js的reset()方法
                $('.layui-form')[0].reset();

                return layer.msg('更新密码成功');
            }
        });
    })
});