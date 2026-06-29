<template>
  <div class="auth-card-container">
    <div class="auth-tabs">
      <div
        class="auth-tab"
        :class="{ 'auth-tab-active': activeTab === 'login' }"
        @click="switchTab('login')"
      >
        {{ $t('login.loginNow') }}
      </div>
      <div
        class="auth-tab"
        :class="{ 'auth-tab-active': activeTab === 'register' }"
        @click="switchTab('register')"
      >
        {{ $t('login.registerNow') }}
      </div>
    </div>

    <div class="auth-slider-wrap">
      <div
        class="auth-slider"
        :style="{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(-50%)' }"
      >
        <!-- 登录表单 Slide -->
        <div class="auth-slide-item">
          <form
            class="auth-form"
            @submit.prevent
          >
            <div
              v-if="!config.register_phone"
              class="field-group"
            >
              <div class="field-label">
                {{ $t('login.username') }}
              </div>
              <div
                class="field-control"
                style="z-index: 10;"
              >
                <div class="field-icon">
                  <div class="field-icon-text iconfont icon-login_icon_phone_number">
                    <span />
                  </div>
                </div>
                <input
                  v-model.trim="loginData.username"
                  type="text"
                  class="uni-input-input login_box_input"
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
              <div
                class="field-control"
                style="z-index: 10;"
              >
                <div class="field-icon">
                  <div class="field-icon-text iconfont icon-login_icon_phone_number">
                    <span />
                  </div>
                </div>
                <div class="phone-prefix-wrap">
                  <div
                    class="phone-prefix-trigger"
                    @click.stop="toggleLoginPrefix"
                  >
                    <span class="phone-prefix-text">{{ selectedLoginCountryCode || '+' }}</span>
                    <span class="phone-prefix-arrow">▾</span>
                  </div>
                  <div
                    v-show="showLoginPrefixList"
                    class="phone-prefix-list"
                  >
                    <div
                      v-for="item in countryCodeList"
                      :key="item.value"
                      class="phone-prefix-item"
                      @click.stop="selectLoginPrefix(item)"
                    >
                      {{ item.text }}
                    </div>
                  </div>
                </div>
                <input
                  v-model.trim="loginData.username"
                  type="number"
                  class="uni-input-input login_box_input"
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
                  v-model.trim="loginData.password"
                  :type="loginPwdType"
                  class="field-input field-input-with-action login_box_input"
                  :placeholder="$t('login.password')"
                >
                <div class="field-action">
                  <div
                    class="field-action-text wlIcon wlIcon-chakan field-action-icon-muted"
                    :class="loginPwdType == 'text' ? 'eye' : ''"
                    @click="showLoginPwd"
                  />
                </div>
              </div>
            </div>

            <div class="field-group" v-if="showImageCode">
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
                  v-model.trim="loginData.code"
                  type="text"
                  class="inp login_box_input"
                  :placeholder="$t('login.code')"
                >
                <div class="verify-img-wrap">
                  <img
                    style="height: 32px;margin-bottom: 8px;"
                    :src="verify_img"
                    @click="getVerifyCode"
                  >
                </div>
              </div>
            </div>

            <div
              class="submit-button"
              :class="loginData.username == '' || loginData.password == '' || (showImageCode && loginData.code === '') ? 'no_touch' : ''"
              @click="submitLogin"
            >
              {{ $t('login.loginNow') }}
            </div>
          </form>
        </div>

        <!-- 注册表单 Slide -->
        <div class="auth-slide-item">
          <!-- 非手机注册 start -->
          <div v-if="!config.register_phone">
            <form
              class="auth-form"
              @submit.prevent
            >
              <div class="field-group">
                <div class="field-label">
                  {{ $t('login.username') }}
                </div>
                <div
                  class="field-control"
                  style="z-index: 10;"
                >
                  <input
                    v-model.trim="registerData.username"
                    type="text"
                    class="uni-input-input login_box_input"
                    :placeholder="$t('login.username')"
                  >
                </div>
              </div>

              <div class="field-group">
                <div class="field-label">
                  {{ $t('login.password') }}
                </div>
                <div class="field-control">
                  <input
                    v-model.trim="registerData.password"
                    :type="registerPwdType"
                    class="field-input field-input-with-action login_box_input"
                    :placeholder="$t('login.password')"
                  >
                  <div class="field-action">
                    <div
                      class="field-action-text wlIcon wlIcon-chakan field-action-icon-muted"
                      :class="registerPwdType == 'text' ? 'eye' : ''"
                      @click="showRegisterPwd"
                    />
                  </div>
                </div>
              </div>

              <div class="field-group">
                <div class="field-label">
                  {{ config.invite_code ? $t('register.inviteCode') : $t('register.inviteCodeOptional') }}
                </div>
                <div class="field-control">
                  <input
                    v-model.trim="registerData.invite_code"
                    type="text"
                    class="uni-input-input login_box_input"
                    :placeholder="config.invite_code ? $t('register.inviteCode') : $t('register.inviteCodeOptional')"
                  >
                </div>
              </div>

              <div class="field-group" v-if="showImageCode">
                <div class="field-label">
                  {{ $t('login.code') }}
                </div>
                <div class="field-control">
                  <input
                    v-model.trim="registerData.code"
                    type="text"
                    class="uni-input-input login_box_input"
                    :placeholder="$t('login.code')"
                  >
                  <div class="verify-img-wrap">
                    <img
                      style="height: 32px;margin-bottom: 8px;"
                      :src="verify_img"
                      @click="getVerifyCode"
                    >
                  </div>
                </div>
              </div>

              <div
                class="submit-button"
                :class="registerData.username == '' || registerData.password == '' || (showImageCode && registerData.code === '') ? 'no_touch' : ''"
                @click="submitRegister"
              >
                {{ $t('login.registerNow') }}
              </div>
            </form>
          </div>
          <!-- 非手机注册 end -->

          <!-- 手机注册 start -->
          <div v-if="config.register_phone">
            <form
              class="auth-form"
              @submit.prevent
            >
              <div class="field-group">
                <div class="field-label">
                  {{ $t('login.phone') }}
                </div>
                <div
                  class="field-control"
                  style="z-index: 10;"
                >
                  <div class="phone-prefix-wrap">
                    <div
                      class="phone-prefix-trigger"
                      @click.stop="toggleRegisterPrefix"
                    >
                      <span class="phone-prefix-text">{{ selectedRegisterCountryCode || '+' }}</span>
                      <span class="phone-prefix-arrow">▾</span>
                    </div>
                    <div
                      v-show="showRegisterPrefixList"
                      class="phone-prefix-list"
                    >
                      <div
                        v-for="item in countryCodeList"
                        :key="item.value"
                        class="phone-prefix-item"
                        @click.stop="selectRegisterPrefix(item)"
                      >
                        {{ item.text }}
                      </div>
                    </div>
                  </div>
                  <input
                    v-model.trim="registerData.phone"
                    type="number"
                    class="uni-input-input login_box_input"
                    :placeholder="$t('login.phone')"
                  >
                </div>
              </div>

              <div class="field-group">
                <div class="field-label">
                  {{ $t('login.code') }}
                </div>
                <div class="field-control">
                  <input
                    v-model.trim="registerData.smsCode"
                    type="text"
                    class="uni-input-input login_box_input"
                    :placeholder="$t('login.code')"
                  >
                  <div class="verify-img-wrap">
                    <van-count-down
                      :time="smsCountdownTime"
                      class="btn get_captcha"
                      @finish="timeCall"
                    >
                      <template v-slot="timeData">
                        <span
                          style="color:#747cfd;font-weight:600;cursor:pointer;font-size:15px;"
                          @click="sendCode"
                        >{{
                          timeData.seconds > 0
                            ? timeData.seconds
                            : $t('auth.sendPhoneCode')
                        }}</span>
                      </template>
                    </van-count-down>
                  </div>
                </div>
              </div>

              <div class="field-group">
                <div class="field-label">
                  {{ $t('login.password') }}
                </div>
                <div class="field-control">
                  <input
                    v-model.trim="registerData.password"
                    :type="registerPwdType"
                    class="field-input field-input-with-action login_box_input"
                    :placeholder="$t('login.password')"
                  >
                  <div class="field-action">
                    <div
                      class="field-action-text wlIcon wlIcon-chakan field-action-icon-muted"
                      :class="registerPwdType == 'text' ? 'eye' : ''"
                      @click="showRegisterPwd"
                    />
                  </div>
                </div>
              </div>

              <div class="field-group">
                <div class="field-label">
                  {{ config.invite_code ? $t('register.inviteCode') : $t('register.inviteCodeOptional') }}
                </div>
                <div class="field-control">
                  <input
                    v-model.trim="registerData.invite_code"
                    type="text"
                    class="uni-input-input login_box_input"
                    :placeholder="config.invite_code ? $t('register.inviteCode') : $t('register.inviteCodeOptional')"
                  >
                </div>
              </div>

              <div
                class="submit-button"
                :class="registerData.phone == '' || registerData.smsCode == '' || registerData.password == '' ? 'no_touch' : ''"
                @click="submitRegister"
              >
                {{ $t('login.registerNow') }}
              </div>
            </form>
          </div>
          <!-- 手机注册 end -->
        </div>
      </div>
    </div>

    <!-- 获取验证码需先验证 -->
    <van-popup
      v-model="showSmsVerifyPopup"
      :round="true"
      :style="{ width: '90%' }"
    >
      <div class="sms_verify">
        <div>
          <img
            style="height: 40px;"
            :src="verify_img"
            @click="getVerifyCode"
          >
          <br><input
            v-model.trim="smsVerifyCode"
            type="text"
            class="inp"
            :placeholder="$t('auth.charEmpty')"
          >
        </div>
        <div class="btn flex_center">
          <div @click="showSmsVerifyPopup = false">
            {{ $t('utils.cancel') }}
          </div>
          <div @click="getSmsCode">
            {{ $t('utils.confirm') }}
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import Fetch from '../utils/fetch';
import { getCountryCodeList } from '../utils/language';
import { CountDown, Checkbox, Dialog, Popup } from 'vant';

Vue.use(CountDown).use(Checkbox).use(Dialog).use(Popup);

export default {
  name: 'AuthCard',
  props: {
    initialTab: {
      type: String,
      default: 'login'
    }
  },
  data() {
    const devLoginDefaults = process.env.NODE_ENV === 'production' ? {
      username: '',
      password: ''
    } : {
      username: '111111',
      password: '111111'
    };
    return {
      activeTab: this.$route.query.tab || this.initialTab || 'login',
      lang: this.$i18n.locale || 'en_us',
      showLoginPrefixList: false,
      showRegisterPrefixList: false,
      loginPwdType: 'password',
      registerPwdType: 'password',
      loading: false,
      showImageCode: false,
      loginData: {
        username: devLoginDefaults.username,
        password: devLoginDefaults.password,
        code: '',
        country_code: ''
      },
      registerData: {
        username: '',
        password: '',
        invite_code: '',
        code: '',
        smsCode: '',
        phone: '',
        country_code: ''
      },
      config: {
        invite_code: 0,
        // 前端强制关闭手机注册（短信验证码），如需恢复服务端控制请改回 1
        register_phone: 0
      },
      verify_img: '',
      countryCodeList: [],
      loginPrefixIndex: 0,
      registerPrefixIndex: 0,
      smsCountdownTime: 0,
      isSendingSms: false,
      showSmsVerifyPopup: false,
      smsVerifyCode: ''
    };
  },
  computed: {
    selectedLoginCountryCode() {
      const current = this.countryCodeList[this.loginPrefixIndex];
      return current ? current.text : '';
    },
    selectedRegisterCountryCode() {
      const current = this.countryCodeList[this.registerPrefixIndex];
      return current ? current.text : '';
    }
  },
  watch: {
    initialTab(val) {
      if (val && (val === 'login' || val === 'register')) {
        this.activeTab = val;
      }
    },
    '$route.query.tab'(newTab) {
      if (newTab && (newTab === 'login' || newTab === 'register')) {
        this.activeTab = newTab;
      }
    }
  },
  mounted() {
    const that = this;
    document.addEventListener(
      'click',
      function(ev) {
        if (!ev.target.closest || !ev.target.closest('.phone-prefix-wrap')) {
          that.showLoginPrefixList = false;
          that.showRegisterPrefixList = false;
        }
      },
      false
    );
    this.start();
    this.getLanguages();
    this.getParams();
    this.getVerifyCode();
  },
  methods: {
    start() {
      Fetch('/index/getWebInfo').then((r) => {
        this.config = r.data;
      });
    },
    switchTab(tab) {
      if (this.activeTab === tab) return;
      this.activeTab = tab;
      this.$router.replace({ query: { ...this.$route.query, tab } }).catch(() => {});
      this.getVerifyCode();
    },
    toggleLoginPrefix() {
      this.showLoginPrefixList = !this.showLoginPrefixList;
    },
    selectLoginPrefix(item) {
      this.loginPrefixIndex = item.value;
      this.showLoginPrefixList = false;
    },
    toggleRegisterPrefix() {
      this.showRegisterPrefixList = !this.showRegisterPrefixList;
    },
    selectRegisterPrefix(item) {
      this.registerPrefixIndex = item.value;
      this.showRegisterPrefixList = false;
    },
    getLanguages() {
      getCountryCodeList(this.lang).then(({ list, defaultIndex }) => {
        this.countryCodeList = list;
        this.loginPrefixIndex = defaultIndex;
        this.registerPrefixIndex = defaultIndex;
      });
    },
    timeCall() {
      this.isSendingSms = false;
      this.smsCountdownTime = 0;
    },
    sendCode() {
      this.smsVerifyCode = '';
      if (this.isSendingSms) {
        return false;
      }
      if (!this.registerData.phone) {
        this.$toast(this.$t('auth.phoneEmpty'));
        return false;
      }
      if (this.registerData.phone.length < 6 || this.registerData.phone.length > 16) {
        this.$toast(this.$t('auth.phoneError'));
        return;
      }
      this.showSmsVerifyPopup = true;
    },
    getSmsCode() {
      if (this.isSendingSms) {
        return false;
      }
      if (!this.registerData.phone) {
        this.$toast(this.$t('auth.phoneEmpty'));
        return false;
      }
      if (this.registerData.phone.length < 6 || this.registerData.phone.length > 16) {
        this.$toast(this.$t('auth.phoneError'));
        return;
      }
      if (!this.smsVerifyCode) {
        this.$toast(this.$t('auth.charEmpty'));
        return false;
      }
      this.isSendingSms = true;
      Fetch('/user/getSmsCode', {
        phone: this.registerData.phone,
        country_code: this.selectedRegisterCountryCode,
        verify_code: this.smsVerifyCode
      }).then(() => {
        this.showSmsVerifyPopup = false;
        this.smsCountdownTime = 60 * 1000;
        this.$toast({
          background: '#07c160',
          message: this.$t('auth.sendsuccess')
        });
      }).catch(() => {
        this.isSendingSms = false;
        this.showSmsVerifyPopup = false;
        this.getVerifyCode();
      });
    },
    showLoginPwd() {
      this.loginPwdType = this.loginPwdType === 'password' ? 'text' : 'password';
    },
    showRegisterPwd() {
      this.registerPwdType = this.registerPwdType === 'password' ? 'text' : 'password';
    },
    getParams() {
      const inviteCode = this.$route.query.code;
      if (inviteCode) {
        this.registerData.invite_code = inviteCode;
      }
    },
    getVerifyCode() {
      Fetch('/index/captcha').then((r) => {
        this.verify_img = r.data.image;
      });
    },
    submitLogin() {
      if (this.loading) {
        return false;
      }
      const reg1 = /^[0-9a-zA-Z_]{1,}$/;
      
      this.loginData.country_code = this.selectedLoginCountryCode;

      if (!this.config.register_phone) {
        if (!this.loginData.username) {
          this.$toast(this.$t('login.usernameEmpty'));
          return false;
        }
        if (!reg1.test(this.loginData.username)) {
          this.$toast(this.$t('login.usernameLimit'));
          return false;
        }
        if (this.loginData.username.length > 16 || this.loginData.username.length < 4) {
          this.$toast(this.$t('login.usernameLength'));
          return false;
        }
      } else {
        if (!this.loginData.username) {
          this.$toast(this.$t('auth.phoneEmpty'));
          return false;
        }
        if (this.loginData.username.length < 6 || this.loginData.username.length > 16) {
          this.$toast(this.$t('auth.phoneError'));
          return;
        }
      }
      
      if (!this.loginData.password) {
        this.$toast(this.$t('login.passwordEmpty'));
        return false;
      }
      if (!reg1.test(this.loginData.password)) {
        this.$toast(this.$t('login.passwordLimit'));
        return false;
      }
      if (this.loginData.password.length > 16 || this.loginData.password.length < 6) {
        this.$toast(this.$t('login.passwordLength'));
        return false;
      }
      if (this.showImageCode && !this.loginData.code) {
        this.$toast(this.$t('login.codeEmpty'));
        return false;
      }
      this.loading = true;
      const _that = this;
      Fetch('/index/login', {
        ...this.loginData
      }).then((res) => {
        if(res.code===2026){
          _that.showImageCode=true
        }
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        this.$toast(this.$t('login.loginSuccess'));
        this.$router.replace('/index');
      }).catch(() => {
        this.getVerifyCode();
        this.loading = false;
      });
    },
    submitRegister() {
      if (this.loading) {
        return false;
      }
      const reg1 = /^[0-9a-zA-Z_]{1,}$/;
      if (!this.config.register_phone) {
        this.registerData.country_code = this.selectedRegisterCountryCode;
        if (!this.registerData.username) {
          this.$toast(this.$t('login.usernameEmpty'));
          return false;
        }
        if (!reg1.test(this.registerData.username)) {
          this.$toast(this.$t('login.usernameLimit'));
          return false;
        }
        if (this.registerData.username.length > 16 || this.registerData.username.length < 4) {
          this.$toast(this.$t('login.usernameLength'));
          return false;
        }
      } else {
        if (!this.registerData.phone) {
          this.$toast(this.$t('auth.phoneEmpty'));
          return false;
        }
        if (this.registerData.phone.length < 6 || this.registerData.phone.length > 16) {
          this.$toast(this.$t('auth.phoneError'));
          return;
        }
        if (!this.registerData.smsCode) {
          this.$toast(this.$t('login.codeEmpty'));
          return false;
        }
        this.registerData.country_code = this.selectedRegisterCountryCode;
      }
      if (!this.registerData.password) {
        this.$toast(this.$t('login.passwordEmpty'));
        return false;
      }
      if (!reg1.test(this.registerData.password)) {
        this.$toast(this.$t('login.passwordLimit'));
        return false;
      }
      if (this.registerData.password.length > 16 || this.registerData.password.length < 6) {
        this.$toast(this.$t('login.passwordLength'));
        return false;
      }
      if (this.config.invite_code && !this.registerData.invite_code) {
        this.$toast(this.$t('register.inviteCodeEmpty'));
        return false;
      }
      if (!this.config.register_phone && (this.showImageCode && !this.registerData.code)) {
        this.$toast(this.$t('login.codeEmpty'));
        return false;
      }
      this.loading = true;
      const _that=this;
      Fetch('/index/register', {
        ...this.registerData
      }).then((res) => {
        if(res.code===2026){
          _that.showImageCode=true
        }
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        this.$toast(this.$t('register.registerSuccess'));
        this.$router.replace('/index');
      }).catch(() => {
        this.getVerifyCode();
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_box_input{
  padding-left: 20px;
  font-size: 18px;
}
.auth-card-container {
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
  margin-bottom: 22px;
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
  cursor: pointer;
  user-select: none;
}
.auth-tab-active {
  background: #fff;
  box-shadow: 0 8px 18px #464a8714;
  color: #111827;
  font-weight: 700;
}

/* 滑动切换布局 */
.auth-slider-wrap {
  width: 100%;
  overflow: hidden;
}
.auth-slider {
  display: flex;
  width: 200%;
  transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.auth-slide-item {
  width: 50%;
  flex-shrink: 0;
  box-sizing: border-box;
}

/* 登录表单样式 */
.auth-form {
  padding: 0 4px;
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
.field-control {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 64px;
  background: #fffffff5;
  border: 1px solid #ecebff;
  border-radius: 16px;
  box-shadow: inset 0 1px 0 #fffc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
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
  cursor: pointer;
}


.sms_verify {
  padding: 20px 20px 0 20px;
  input {
    margin-top: 15px;
    height: 36px;
    font-size: 16px;
    width: 100%;
    border: 1px solid #ecebff;
    border-radius: 8px;
    padding: 0 10px;
    box-sizing: border-box;
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
      line-height: 48px;
      cursor: pointer;
    }
    div:nth-child(1) {
      border-right: 1px solid #ebedf0;
      color: #666;
    }
  }
}

/* 统一手机前缀下拉样式 */
.phone-prefix-wrap {
  position: relative;
  flex-shrink: 0;
  border-right: 1px solid #ecebff;
  margin-right: 14px;
}
.phone-prefix-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 64px;
  min-width: 72px;
  padding: 0 12px;
  cursor: pointer;
  color: #747cfd;
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  user-select: none;
  box-sizing: border-box;
}
.phone-prefix-arrow {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 1px;
}
.phone-prefix-list {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 110px;
  max-height: 220px;
  overflow-y: auto;
  background: #fff;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 6px 16px rgba(100, 100, 200, 0.15);
  z-index: 9999;
}
.phone-prefix-item {
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}
.phone-prefix-item:hover {
  background: #f5f3ff;
  color: #747cfd;
}

.no_touch {
  pointer-events: none;
  opacity: 0.6;
}
</style>
