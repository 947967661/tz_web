<template>
  <div class="page-inner">
    <div class="topbar">
      <div
        class="topbar-action"
        @click="$router.back()"
      >
        <img
          class="topbar-icon-image"
          src="../img/common/back_b.png"
        >
      </div>
      <div
        class="topbar-action topbar-action-lang"
        @click="$router.push('/language')"
      >
        <img
          class="topbar-icon-image-lang"
          :src="language_logo"
        >
      </div>
    </div>
    <div class="hero">
      <div class="hero-logo-shell">
        <img
          class="hero-logo"
          :src="config.logo"
        >
      </div>
      <div class="hero-title">
          &nbsp;
      </div>
    </div>

    <!-- 合并后的滑动切换登录注册卡片 -->
    <auth-card />

    <div
      class="kefu"
      :class="show_kefu ? '' : 'kefu_hide'"
      @click="kefu_to"
    >
      <img
        class="kefu_img"
        src="../img/index/kefu.png"
      >
    </div>
  </div>
</template>

<script>
	import Fetch from "../../utils/fetch";
	import AuthCard from "../../components/AuthCard.vue";

	export default {
		name: "Login",
		components: {
			AuthCard
		},
		data() {
			return {
				language_logo: localStorage.getItem('language_logo'),
				show_kefu: false,
				config: {
					logo: ""
				}
			};
		},
		created() {
			if (window.plus) {
				window.plus.navigator.setStatusBarBackground('#FAFAFA');
				window.plus.navigator.setStatusBarStyle('dark');
			}
			this.$parent.footer("user", false);
		},
		mounted() {
			var that = this;
			document.body.addEventListener(
				"scroll",
				function() {
					if (!that.show_kefu) {
						return;
					}
					that.show_kefu = false;
				},
				false
			);
			document.addEventListener(
				"click",
				function(ev) {
					if (ev.target.className != "kefu_img") {
						that.show_kefu = false;
					}
				},
				false
			);
			this.start();
		},
		methods: {
			start() {
				Fetch("/index/getWebInfo").then((r) => {
					this.config = r.data;
				});
			},
			kefu_to() {
				if (this.show_kefu) {
					this.$router.push("/service");
				}
				this.show_kefu = !this.show_kefu;
			}
		}
	};
</script>

<style lang="less" scoped>
	.page-inner{
    position: relative;
    z-index: 1;
    min-height: 100vh;
    padding: calc(16px + env(safe-area-inset-top)) 18px 40px;
	}
  .topbar{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .topbar-action{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    border-radius: 18px;
    background: #ffffffb8;
    border: 1px solid #ffffffeb;
    box-shadow: 0 9px 20px #464a8714;
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  .topbar-icon-image {
    width: 22px;
    height: 20px;
  }
  .topbar-icon-image-lang {
    width: 50px;
    height: 50px;
  }
  .topbar-action-lang{
    padding: 0 10px;
    width: auto;
    min-width: 58px;
  }
  .hero{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 6px 20px;
    text-align: center;
  }
  .hero-logo {
    width: 64px;
    height: 64px;
  }
  .hero-logo-shell{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 93px;
    height: 93px;
    border-radius: 26px;
    background: #ffffffd1;
    border: 1px solid #fffffff0;
    box-shadow: 0 12px 28px #464a871a;
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  .hero-title {
    margin-top: 18px;
    font-size: 37px;
    font-weight: 700;
    line-height: 1.12;
    color: #00001c;
    text-align: center;
  }
</style>
