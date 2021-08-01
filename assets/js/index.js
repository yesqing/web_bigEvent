$(function () {
    var layer = layui.layer;
    getUserInfo();
    $('#btnLoginOut').on('click', function () {
        // 提示用户是否退出
        layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
            
            // 清空本地存储的token，跳转回登录页
            localStorage.removeItem('token');
            location.href = '/login.html';

            layer.close(index);
        });
    });
});


// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败");
            }
            drawUser(res.data);
        }
        
    });
}

// 渲染用户名和头像
function drawUser(user) {
    var name = user.nickname || user.username;
    var firstStr = name[0].toUpperCase();
    if (user.user_pic !== null) {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();
    } else {
        $('.text-avatar').html(firstStr).show();
    }
    $('#welcome').html('欢迎&nbsp;' + name).show();
}