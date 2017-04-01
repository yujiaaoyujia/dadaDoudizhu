'use strict';

/*!
 * main.js v1.0.0
 * Created by zero on 2017-03-23
 * 嗒嗒斗地主活动主脚本库
 */

var ddbSrcId = B.url.getParam('ddb_src_id') || ''; // 全局渠道号
var swipeTimeout = 800; // 全局滑动延时 单位:ms
var animeTimeout = 2000; // 全局动画延时 单位:ms
var globalPage = 0; // 全局页面状态 0-4

// 微信分享设置
var shareConfig = {
  title: '欢乐斗地主嗒嗒巴士赛',
  desc: '斗地主，赢福利，一大波福利来袭',
  link: 'http://' + ddb.host + '/h5/active/dadaddz/index.html',
  imgUrl: 'http://' + ddb.host + '/h5/active/dadaddz/image/share.png'
};

var Home = {
  template: '#template-home',
  data: function data() {
    return {
      page: globalPage, // 页面状态
      animePlay: [0, 0, 0, 0, 0], // 播放动画
      fnTimeout: 0, // 动画延时函数
      loading: false
    };
  },
  created: function created() {},
  mounted: function mounted() {
    var _this = this;

    this.initSwipe();
    this.initTouchEvent();

    // 重要图片加载完成后执行动画
    (function () {
      var images = ['image/page0/boy.png', 'image/page0/boy-sleep.png', 'image/page0/girl.png', 'image/page0/girl-sad.png', 'image/page0/girl-hand.png', 'image/page0/person.png', 'image/page0/bg.png', 'image/page0/bus.png', 'image/page0/seat-back.png', 'image/page0/seat-front.png', 'image/page0/bftext.png'];
      var _ref = [0, 0, images.length],
          process = _ref[0],
          loaded = _ref[1],
          length = _ref[2];

      var callback = function callback() {
        process = ++loaded / length;
        if (process == 1) {
          _this.replayAnime(globalPage);
        }
      };

      images.forEach(function (url) {
        var img = document.createElement('img');
        img.src = url;
        img.onload = img.onerror = img.onabort = callback;
      });
    })();

    // 全屏页禁止微信下拉显示网页信息
    document.getElementsByClassName('m-swipe-wrap')[0].addEventListener('touchstart', function (e) {
      if (e.target.className.indexOf('allow') === -1 && _this.page < 4) {
        e.preventDefault();
      }
    });

    // 设置微信分享
    ddb.wx.share({
      isShare: 0,
      JSSDK_Share: shareConfig,
      mtaid: 'dadaddz'
    });
  },


  methods: {
    initSwipe: function initSwipe() {
      var elem = document.getElementById('ddzSwipe');
      window.mySwipe = Swipe(elem, {
        startSlide: globalPage,
        auto: 0,
        speed: swipeTimeout,
        continuous: false,
        disableTouch: true
        // disableScroll: true,
        // stopPropagation: true,
        // slideDirection: 'y',
        // callback: (index, elem) => {},
        // transitionEnd: (index, element) => { console.log('page: ' + this.page); }
      });
    },
    initTouchEvent: function initTouchEvent() {
      var _this2 = this;

      var $swipePage = $('.swipe-page');
      $swipePage.on("swipeleft", function () {
        _this2.swipePage(1);
      });
      $swipePage.on("swiperight", function () {
        _this2.swipePage(-1);
      });
    },
    swipePage: function swipePage() {
      var _this3 = this;

      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (this.loading) return;
      this.loading = true;

      var curPage = this.page;
      if (type < 0 && curPage > 0) {
        curPage -= 1;
        mySwipe.prev();
      } else if (type >= 0 && curPage < 4) {
        curPage += 1;
        mySwipe.next();
      } else {
        this.loading = false;
        return;
      }

      setTimeout(function () {
        _this3.page = curPage;
        _this3.replayAnime(curPage);
        _this3.loading = false;
      }, swipeTimeout);
    },
    replayAnime: function replayAnime(page) {
      var _this4 = this;

      this.animePlay = [0, 0, 0, 0, 0];
      this.fnTimeout && clearTimeout(this.fnTimeout);
      this.fnTimeout = setTimeout(function () {
        _this4.animePlay = _this4.animePlay.map(function (item, index) {
          return index == page ? 1 : 0;
        });
      }, animeTimeout);
    },
    downloadDDZ: function downloadDDZ() {
      location.href = "";
    },
    downloadDadabus: function downloadDadabus() {
      location.href = "";
    }
  }
};

// 根组件构造器
var App = Vue.extend({
  created: function created() {
    var _this5 = this;

    $(window).on('popstate', function () {
      var view = window.location.hash.replace(/#\/?/, '');
      var routers = _this5.$options.components;
      _this5.view = view in routers ? view : 'home';
    }).trigger('popstate');
  },

  methods: {},
  components: {
    home: Home
  }
});

// 创建 App 实例，并挂载到一个元素上。
new App().$mount('#app');
