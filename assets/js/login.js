$(function () {
    // 点击切换注册页面
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    });

    // 点击切换登录页面
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    });



    var form = layui.form;
    var layer = layui.layer;


    // 自定义校验规则
    form.verify({

        // 校验密码
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repass: function (value, item) {
            if (value !== $(".reg-box input[name='password']").val()) {
                return "两次密码不一致"
            }
        }
    });



    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 组织表单默认的提交行为
        e.preventDefault();
        // 发送AJAX请求注册新用户
        var data = {
            username: $('#form_reg input[name="username"]').val(), password: $('#form_reg input[name="password"]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            $("#link_login").click()
        })
    });


    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success:function (res) {
                if(res.status !== 0) {
                    return layer.msg("登录失败");
                }
                // 将服务器发来的token保存到本地存储，后续所有需要身份验证的请求都需要携带该值
                localStorage.setItem('token', res.token);
                layer.msg("登录成功");
                // 跳转后台主页
                // location.href = '/index.html';
            },
            error: function (error) {
                console.log(error);
            }
        });
    });


    /*
        username: aaa123123aaa
        password: aaaaaa
    */
});