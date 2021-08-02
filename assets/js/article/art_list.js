$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义一个时间格式化的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dateFormat = new Date(date);

        var year = dateFormat.getFullYear();
        var month = dateFormat.getMonth() + 1;
        var day = dateFormat.getDate();

        var hours = dateFormat.getHours();
        var minutes = dateFormat.getMinutes();
        var seconds = dateFormat.getSeconds();

        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }


    // 定义一个查询参数的对象
    var queryObj = {
        pagenum: 1,     // 页码值，默认请求第一页的数据
        pagesize: 2,    // 每页显示多少条数据
        cate_id: '',    // 文章分类的ID
        state: ''       // 文章的发布状态
    }

    // 接口有问题时使用的假数据
    var articleArr = [
        {
            "Id": 1,
            "title": "abab",
            "pub_date": "2020-01-03 12:19:57.690",
            "state": "已发布",
            "cate_name": "最新"
        },
        {
            "Id": 2,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "草稿",
            "cate_name": "股市"
        },
        {
            "Id": 3,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "已发布",
            "cate_name": "股市"
        },
        {
            "Id": 4,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "已发布",
            "cate_name": "股市"
        },
        {
            "Id": 5,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "已发布",
            "cate_name": "股市"
        },
        {
            "Id": 6,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "草稿",
            "cate_name": "股市"
        },
        {
            "Id": 7,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "已发布",
            "cate_name": "股市"
        },
        {
            "Id": 8,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "草稿",
            "cate_name": "股市"
        },
        {
            "Id": 9,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "已发布",
            "cate_name": "股市"
        },
        {
            "Id": 10,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "草稿",
            "cate_name": "股市"
        },
        {
            "Id": 11,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "已发布",
            "cate_name": "股市"
        },
        {
            "Id": 12,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "草稿",
            "cate_name": "股市"
        },
        {
            "Id": 13,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "已发布",
            "cate_name": "股市"
        },
        {
            "Id": 14,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "已发布",
            "cate_name": "股市"
        },
        {
            "Id": 15,
            "title": "666",
            "pub_date": "2020-01-03 12:20:19.817",
            "state": "草稿",
            "cate_name": "股市"
        }
    ]

    // 根据查询参数过滤假数据
    function filterData() {
        queryObj.state = $('[name="state"]').val();
        var data = articleArr.filter(item => {
            if (queryObj.state === '') {
                return true;
            } else if (item.state === queryObj.state) {
                return true;
            }
        });
        data = data.splice(0, queryObj.pagesize);

        return data;
    }

    // 初始化文章列表数据
    initArticleList();
    function initArticleList() {
        $.ajax({
            url: '/my/article/list',
            mehtod: 'GET',
            data: queryObj,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("请求文章分类列表失败");
                }
                var dataList = filterData();
                res.data = res.data.length === 0 ? dataList : res.data;
                var articleListStr = template('articl-list', res);
                $('tbody').html(articleListStr);
                renderPage(res.total == 0 ? dataList.length : res.total);
            }
        });
    }

    initCate();
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败");
                }
                var cateListStr = template('tpl-cateList', res);
                $('[name="cate_id"]').html(cateListStr);
                // 动态添加表单选项后需要render()重新渲染表单数据
                form.render();
            }
        });
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        queryObj.cate_id = $('[name="cate_id"]').val();
        queryObj.state = $('[name="state"]').val();
        initArticleList();
    });


    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'laypage',
            count: total,
            limit: queryObj.pagesize,
            curr: queryObj.pagenum,
            limits: [2, 3, 4, 5],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页切换时调用的回调是函数
            jump: function (obj, first) {

                queryObj.pagenum = obj.curr;
                queryObj.pagesize = obj.limit;
                // 直接调用会死循环
                // initArticleList();
                if (!first) {
                    initArticleList();
                }

            }
        });
    }


    // 通过事件代理的方式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        // 获取当前页上所有删除按钮的个数
        var len = $('.btn-delete').length;
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'GET',
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败");
                    }
                    layer.msg("删除成功");
                    // 当前数据被删除完之后，判断当前页是否还有数据，没有数据了让页码-1
                    if (len === 1) {
                        queryObj.pagenum = queryObj.pagenum === 1 ? 1 : queryObj.pagenum--;
                    }

                    initArticleList();
                }
            });

            layer.close(index);
        });
    });


});