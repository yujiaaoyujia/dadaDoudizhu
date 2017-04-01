/*!
 * main.js v1.0.0
 * Created by zero on 2017-03-23
 * 嗒嗒斗地主活动主脚本库
 */

const ddbSrcId = B.url.getParam('ddb_src_id') || ''; // 全局渠道号
const swipeTimeout = 800; // 全局滑动延时 单位:ms
const animeTimeout = 2000; // 全局动画延时 单位:ms
const globalPage = 0; // 全局页面状态 0-4

// 微信分享设置
const shareConfig = {
  title: '欢乐斗地主嗒嗒巴士赛',
  desc: '斗地主，赢福利，一大波福利来袭',
  link: 'http://' + ddb.host + '/h5/active/dadaddz/index.html',
  imgUrl: 'http://' + ddb.host + '/h5/active/dadaddz/image/share.png'
};


let Home = {
  template: '#template-home',
  data() {
    return {
      page: globalPage, // 页面状态
      animePlay: [0,0,0,0,0], // 播放动画
      fnTimeout: 0, // 动画延时函数
      loading: false
    };
  },

  created() {

  },

  mounted() {
    this.initSwipe();
    this.initTouchEvent();

    // 重要图片加载完成后执行动画
    (() => {
      const images = [
        'image/page0/boy.png',
        'image/page0/boy-sleep.png',
        'image/page0/girl.png',
        'image/page0/girl-sad.png',
        'image/page0/girl-hand.png',
        'image/page0/person.png',
        'image/page0/bg.png',
        'image/page0/bus.png',
        'image/page0/seat-back.png',
        'image/page0/seat-front.png',
        'image/page0/bftext.png'
      ];
      let [process, loaded, length] = [0, 0, images.length];
      let callback = () => {
        process = ++loaded / length;
        if (process == 1) {
          this.replayAnime(globalPage);
        }
      };

      images.forEach(url => {
        let img = document.createElement('img');
        img.src = url;
        img.onload = img.onerror = img.onabort = callback;
      })
    })();

    // 全屏页禁止微信下拉显示网页信息
    document.getElementsByClassName('m-swipe-wrap')[0].addEventListener('touchstart', e => {
      if (e.target.className.indexOf('allow') === -1 && this.page < 4) {
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
    initSwipe() {
      const elem = document.getElementById('ddzSwipe');
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

    initTouchEvent() {
      const $swipePage = $('.swipe-page');
      $swipePage.on("swipeleft", () => {
        this.swipePage(1);
      });
      $swipePage.on("swiperight", () => {
        this.swipePage(-1);
      });
    },

    swipePage(type = 1) {
      if (this.loading) return;
      this.loading = true;

      let curPage = this.page;
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

      setTimeout(() => {
        this.page = curPage;
        this.replayAnime(curPage);
        this.loading = false;
      }, swipeTimeout);
    },

    replayAnime(page) {
      this.animePlay = [0,0,0,0,0];
      this.fnTimeout && clearTimeout(this.fnTimeout);
      this.fnTimeout = setTimeout(() => {
        this.animePlay = this.animePlay.map((item, index) => {
          return index == page? 1:0;
        });
      }, animeTimeout);
    },

    downloadDDZ() {
      location.href = "";
    },

    downloadDadabus() {
      location.href = "";
    }
  }
};



// 根组件构造器
let App = Vue.extend({
  created() {
    $(window).on('popstate', () => {
      const view = window.location.hash.replace(/#\/?/, '');
      const routers = this.$options.components;
      this.view = view in routers ? view : 'home';
    }).trigger('popstate');
  },
  methods: {

  },
  components: {
    home: Home
  }
});

// 创建 App 实例，并挂载到一个元素上。
new App().$mount('#app');