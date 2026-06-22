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

    <div class="auth-shell">
      <div class="auth-tabs">
        <div class="auth-tab auth-tab-active">
          {{ $t('login.loginNow') }}
        </div>
        <div class="auth-tab">
          <router-link to="/register">
            {{ $t('login.registerNow') }}
          </router-link>
        </div>
      </div>
      <form class="auth-form">
        <div
          v-if="!config.register_phone"
          class="field-group"
        >
          <div class="field-label">
            {{ $t('login.username') }}
          </div>
          <div class="field-control">
            <div class="field-icon">
              <div class="field-icon-text iconfont icon-login_icon_phone_number">
                <span>
                  <van-dropdown-menu :overlay="false">
                    <van-dropdown-item
                      v-model="value"
                      :options="country_code"
                    />
                  </van-dropdown-menu>
                </span>
              </div>
            </div>
            <input
              v-model.trim="data.username"
              type="text"
              class="uni-input-input"
              :placeholder="$t('login.username')"
            >
          </div>
        </div>
        <div
          v-if="config.register_phone"
          class="field-group"
        >
          <div class="field-label">
            {{ $t('login.phone') }}
          </div>
          <div class="field-control">
            <div class="field-icon">
              <div class="field-icon-text iconfont icon-login_icon_phone_number">
                <span />
              </div>
            </div>
            <div class="field-prefix">
              <div class="field-prefix-text" />
            </div>
            <input
              v-model.trim="data.username"
              type="number"
              class="uni-input-input"
              :placeholder="$t('login.phone')"
            >
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">
            {{ $t('login.password') }}
          </div>
          <div class="field-control">
            <div class="field-icon">
              <div class="field-icon-text iconfont icon-login_icon_password">
                <span />
              </div>
            </div>
            <input
              v-model.trim="data.password"
              :type="password"
              class="field-input field-input-with-action"
              :placeholder="$t('login.password')"
            >
            <div class="field-action">
              <div
                class="field-action-text wlIcon wlIcon-chakan field-action-icon-muted"
                :class="password == 'text' ? 'eye' : ''"
                @click="showPwd"
              />
            </div>
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">
            {{ $t('login.code') }}
          </div>
          <div class="field-control">
            <div class="field-icon">
              <div class="field-icon-text iconfont icon-login_icon_password">
                <span />
              </div>
            </div>
            <input
              v-model.trim="data.code"
              type="text"
              class="inp"
              :placeholder="$t('login.code')"
            >
            <div class="verify-img-wrap">
              <img
                style="height: 32px;margin-bottom: 8px;"
                :src="verify_img"
                @click="getVerifyCode()"
              >
            </div>
          </div>
        </div>
        <div
          class="submit-button"
          :class="data.username == '' || data.password == '' || data.code == ''? 'no_touch' : ''"
          @click="submit"
        >
          {{ $t('login.loginNow') }}
        </div>
      </form>
    </div>
		

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
	import Vue from "vue";
	import bsHeader from '../../components/bsHeader.vue'
	import {
		CountDown,
		Checkbox,
		Dialog,
    DropdownMenu,
    DropdownItem,
    Popup
	} from "vant";
  Vue.use(CountDown).use(Checkbox).use(Dialog).use(DropdownMenu).use(DropdownItem).use(Popup);
	import Fetch from "../../utils/fetch";

	Vue.use(CountDown)
		.use(Checkbox)
		.use(Dialog);

	export default {
		name: "Login",
		components: {
			bsHeader
		},
		data() {
			const devLoginDefaults = process.env.NODE_ENV === "production" ? {
				username: "",
				password: ""
			} : {
				username: "111111",
				password: "111111"
			};
			return {
				language_logo: localStorage.getItem('language_logo'),
				show_kefu: false,
				password: "password",
				loading: false,
				data: {
          country_code: '',
					username: devLoginDefaults.username,
					password: devLoginDefaults.password,
					code: "",
				},
				config: {
					register_phone: 1
				},
				verify_img: "",
        country_code: [],
        value: 0,
			};
		},
		created() {
			if (window.plus) {
				plus.navigator.setStatusBarBackground('#FAFAFA');
				plus.navigator.setStatusBarStyle('dark');
			}
			this.$parent.footer("user", false);
		},
		mounted() {
			// if (this.$route.query.agent) {
			// 	localStorage.setItem('agent', this.$route.query.agent);
			// 	this.data.agent = this.$route.query.agent;
			// } else {
			// 	if (localStorage.getItem('agent')) {
			// 		this.data.agent = localStorage.getItem('agent');
			// 	}
			// }
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
      this.getLanguages();
			this.getVerifyCode();
		},
		methods: {
			start() {
				Fetch("/index/getWebInfo").then((r) => {
					this.config = r.data;
				});
			},
      getLanguages() {
        Fetch('/index/getLanguages').then((r) => {
          var list = r.data.list;
          var countryCode = [];
          for (var i = 0; i < list.length; i++) {
            countryCode.push({
              text: list[i]['country_code'],
              value: i,
              counrty: list[i]['country']
            });
          }
          this.country_code = countryCode;
          let country = this.country_code.find((country) => {
            return country['counrty'] === this.lang;
          });
          this.value = country.value;
        });
      },
			kefu_to() {
				if (this.show_kefu) {
					this.$router.push("/service");
				}
				this.show_kefu = !this.show_kefu;
			},
			showPwd() {
				if (this.password == "password") {
					this.password = "text";
				} else {
					this.password = "password";
				}
			},
			submit() {
				if (this.loading) {
					return false;
				}
				//数字、字母或下划线
				var reg1 = /^[0-9a-zA-Z_]{1,}$/;
				//非手机号注册判断
				if (!this.config.register_phone) {
					if (!this.data.username) {
						this.$toast(this.$t('login.usernameEmpty'));
						return false;
					}
					if (!reg1.test(this.data.username)) {
						this.$toast(this.$t('login.usernameLimit'));
						return false;
					}
					if (this.data.username.length > 16 || this.data.username.length < 4) {
						this.$toast(this.$t('login.usernameLength'));
						return false;
					}
				}
				//手机号注册判断
				else {
					if (!this.data.username) {
						this.$toast(this.$t('auth.phoneEmpty'));
						return false;
					}
					if (this.data.username.length < 6 || this.data.username.length > 16) {
						this.$toast(this.$t('auth.phoneError'));
						return;
					}
				}
				
				if (!this.data.password) {
					this.$toast(this.$t('login.passwordEmpty'));
					return false;
				}
				if (!reg1.test(this.data.password)) {
					this.$toast(this.$t('login.passwordLimit'));
					return false;
				}
				if (this.data.password.length > 16 || this.data.password.length < 6) {
					this.$toast(this.$t('login.passwordLength'));
					return false;
				}
				if (!this.data.code) {
					this.$toast(this.$t('login.codeEmpty'));
					return false;
				}
				this.loading = true;
				Fetch("/index/login", {
					...this.data,
				}).then((res) => {
					if (res.data.token) {
						localStorage.setItem('token', res.data.token);
					}
					this.$toast(this.$t('login.loginSuccess'));
					this.$router.replace("/index");
				}).catch((res) => {
					this.getVerifyCode();
					this.loading = false;
				});
			},
			getVerifyCode() {
				Fetch("/index/captcha").then((r) => {
					this.verify_img = r.data.image;
				});
			}
		},
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
  .auth-shell {
    background: #ffffffdb;
    border: 1px solid #fff;
    border-radius: 26px;
    box-shadow: 0 12px 28px #464a8714;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    padding: 16px;
  }
  .auth-tabs {
    display: flex;
    gap: 8px;
    padding: 6px;
    background: #747cfd14;
    border-radius: 668px;
  }
  .auth-tab {
    flex: 1;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 668px;
    font-size: 18px;
    font-weight: 600;
    color: #6b7280;
  }
  .auth-tab-active {
    background: #fff;
    box-shadow: 0 8px 18px #464a8714;
    color: #111827;
    font-weight: 700;
  }
  .auth-form {
    padding-top: 22px;
  }
  .field-group + .field-group {
    margin-top: 18px;
  }
  .field-label {
    margin-bottom: 9px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: #22273d;
  }
  .field-control{
    position: relative;
    display: flex;
    align-items: center;
    min-height: 64px;
    background: #fffffff5;
    border: 1px solid #ecebff;
    border-radius: 16px;
    box-shadow: inset 0 1px 0 #fffc;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .verify-img-wrap {
    margin-left: auto;
    padding-right: 12px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .field-icon-text {
    font-size: 17px;
    line-height: 1;
    color: #747cfd;
  }
   .iconfont {
     font-family: iconfont !important;
     font-size: 16px;
     font-style: normal;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }
  .field-prefix {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 64px;
    padding-right: 10px;
    border-right: 1px solid #ecebff;
    flex-shrink: 0;
  }
  .submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 64px;
    margin-top: 20px;
    border-radius: 16px;
    background: #767dff !important;
    border-color: #0000 !important;
    box-shadow: 0 10px 21px #747cfd3d;
    font-size: 20px !important;
    font-weight: 700 !important;
    line-height: 28px;
    color: #fff !important;
  }
  .field-prefix-text, .field-prefix-arrow {
    font-size: 16px;
    line-height: 1;
    color: #4f46e5;
    font-weight: 600;
  }


	.form_div {
		height: 600px;
		width: 100%;
		position: relative;
		top: -88px;

		.form {
			position: absolute;
			margin: 200px auto 0 5%;
			width: 90%;

			.register_btn {
				background: #68326C;
				color: #FFFFFF;
				width: 60px;
				height: 60px;
				border-radius: 50%;
				float: right;
				margin-right: 3%;
				text-align: center;
				line-height: 60px;
				font-size: 36px;
				font-weight: bold;
			}
		}
	}

	.back_left {
		background: unset;

		img {
			width: 20px;
			position: fixed;
			top: 10px;
			left: 10px;
		}
	}

	.language {
		position: absolute;
		top: 6px;
		right: 6px;
		height: 30px;
		z-index: 11;

		img {
			height: 100%;
		}
	}

	.logo {
		margin: 50px 0 0 30px;

		img {
			height: 80px;
		}
	}

	.item {
		height: 50px;
		font-size: 14px;
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		padding-bottom: 4px;
		background: #FFFFFF;
		margin-bottom: 15px;
		border-radius: 25px;
		padding: 0 20px;

		input {
			height: 50px;
			flex: 1;
		}

		.get_captcha {
			line-height: 50px;
		}

		.eye_bi {
			margin-bottom: 12px;
		}
	}

	.sms_verify {
		padding: 20px 20px 0 20px;

		input {
			margin-top: 15px;
			height: 20px;
			font-size: 16px;
			width: 100%;
		}

		.btn {
			margin-top: 15px;
			justify-content: space-around;
			color: #ee0a24;
			height: 48px;
			font-size: 16px;
			border-top: 1px solid #ebedf0;

			div {
				width: 50%;
				text-align: center;
			}

			div:nth-child(1) {
				border-right: 1px solid #ebedf0;
			}
		}
	}

	.login_register {
		position: relative;
		top: -60px;
		font-size: 14px;
		margin-left: 50px;
	}

	/deep/ .van-dropdown-menu__bar {
		background-color: unset;
		box-shadow: unset;
		height: 50px;
		margin-right: 10px;
	}

	/deep/ .van-popup--top {
		left: 5%;
		width: 30%;
	}
</style>
