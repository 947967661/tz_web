<template>
  <div class="page">
    <img
      class="page-bg bg-main"
      src="../img/index/web3/bg.png"
      alt=""
    >
    <img
      class="page-bg bg-second"
      src="../img/index/web3/bg2.png"
      alt=""
    >
    <img
      class="page-bg bg-third"
      src="../img/index/web3/bg3.png"
      alt=""
    >

    <!-- User Info Header -->
    <div class="user_container">
      <img
        class="avatar"
        src="/static/images/web3/icon-avatar.png"
        alt="avatar"
      >
      <div class="text uid_row">
        <span>UID: {{ data.username }}</span>
        <img
          v-clipboard="() => data.username"
          v-clipboard:success="copy"
          class="copy_button"
          src="/static/images/web3/icon-copy.png"
          alt="copy"
        >
      </div>
    </div>

    <!-- Amount / Balance Card -->
    <div class="amount_card">
      <div class="item">
        <div class="title">
          {{ $t('user.fundingAccount') }}
        </div>
        <div class="amount">
          {{ common.precision_basic(fundBalanceUsd) }}
        </div>
        <div class="amount_unit">
          {{ platformMoneySymbol }}
        </div>
        <div class="amount_desc">
          ≈ {{ currency }}{{ common.precision_basic(fundBalance) }}
        </div>
      </div>
      <div class="item">
        <div class="title">
          {{ translate('user.teamProfitLabel', '累计投入收益', 'Cumulative Investment Profit') }}
        </div>
        <div class="amount">
          {{ common.precision_basic(selfInvestmentProfit) }}
        </div>
        <div class="amount_unit">
          {{ platformMoneySymbol }}
        </div>
      </div>
    </div>

    <!-- Funds Operation Card -->
    <div class="card_container">
      <div class="card_title">
        {{ translate('user.fundsTitle', '资金操作', 'Funds Operation') }}
      </div>
      <div class="menu_grid primary_actions">
        <div
          class="menu_item"
          @click="$router.push('/recharge')"
        >
          <div class="menu_name">
            {{ $t('user.recharge') }}
          </div>
        </div>
        <div
          class="menu_item"
          @click="$router.push('/withdraw')"
        >
          <div class="menu_name">
            {{ $t('user.withdraw') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Features / Tools Card -->
    <div class="card_container">
      <div class="card_title">
        {{ translate('user.toolsTitle', '功能', 'Features') }}
      </div>
      <div class="menu_grid">
        <div
          class="menu_item"
          @click="$router.push('/funding/record')"
        >
          <div class="menu_name">
            {{ $t('user.fundingDetails') }}
          </div>
        </div>
        <div
          class="menu_item"
          @click="$router.push('/savings')"
        >
          <div class="menu_name">
            {{ $t('savings.savings') }}
          </div>
        </div>
        <div
          class="menu_item"
          @click="$router.push('/vip')"
        >
          <div class="menu_name">
            {{ $t('user.vip') }}
          </div>
        </div>
        <div
          class="menu_item"
          @click="$router.push('/rewards')"
        >
          <div class="menu_name">
            {{ $t('user.rewards') }}
          </div>
        </div>
        <div
          class="menu_item"
          @click="$router.push('/recharge/record')"
        >
          <div class="menu_name">
            {{ $t('user.rechargeRecord') }}
          </div>
        </div>
        <div
          class="menu_item"
          @click="$router.push('/withdraw/record')"
        >
          <div class="menu_name">
            {{ $t('user.withdrawRecord') }}
          </div>
        </div>
        <div
          class="menu_item"
          @click="$router.push('/wallet')"
        >
          <div class="menu_name">
            {{ $t('user.withdrawAccount') }}
          </div>
        </div>
        <div
          class="menu_item"
          @click="$router.push('/auth')"
        >
          <div class="menu_name">
            {{ $t('user.certificationCenter') }}
          </div>
        </div>
        <div
          class="menu_item menu_item_column"
          @click="$router.push('/language')"
        >
          <div class="menu_name">
            {{ $t('user.languagePreference') }}
          </div>
          <div class="menu_desc">
            {{ currentLanguageName }}
          </div>
        </div>
        <div
          v-if="false"
          class="menu_item"
          @click="$router.push('/questions')"
        >
          <div class="menu_name">
            {{ $t('user.faq') }}
          </div>
        </div>
        <div
          class="menu_item menu_item_column menu_item_danger"
          style="grid-column: span 2;"
          @click="logout"
        >
          <div class="menu_name">
            {{ $t('user.signOut') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	import Vue from 'vue';
	import Fetch from '../../utils/fetch';
	import Clipboard from "v-clipboard";
	import {
		Icon,
		Empty,
		Popup
	} from "vant";

	Vue.use(Icon).use(Clipboard).use(Empty).use(Popup);

	export default {
		name: "User",
		data() {
			return {
				currency: '',
				data: {},
				fundBalance: 0.00,
				fundBalanceUsd: 0.00,
				selfInvestmentProfit: 0.00,
				signinStatue: false,
				pageLoading: true
			};
		},
		computed: {
			currentLanguageName() {
				const locale = this.$i18n.locale;
				if (locale === 'zh_CN') return '中文';
				if (locale === 'zh_HK') return '繁體中文';
				if (locale === 'en_US') return 'English';
				if (locale === 'vi_VN') return 'Tiếng Việt';
				if (locale === 'th_TH') return 'ไทย';
				return 'English';
			},
			platformMoneySymbol() {
				return this.common.currency_symbol_basic();
			}
		},
		created() {
			window.document.title = this.$t('home.my');
			if (window.plus) {
				window.plus.navigator.setStatusBarBackground('#faf7ff');
				window.plus.navigator.setStatusBarStyle('dark');
			}
			this.$parent.footer('user');
		},
		mounted() {
			this.start();
		},
		methods: {
			translate(key, defaultZh, defaultEn) {
				const lang = this.$i18n.locale;
				if (lang === 'zh_CN' || lang === 'zh_HK') {
					return defaultZh;
				}
				const val = this.$t(key);
				if (val && val !== key) {
					return val;
				}
				return defaultEn || defaultZh;
			},
			copy() {
				this.$toast(this.$t('recharge.copySuccess'));
			},
			async start() {
				this.pageLoading = true;
				let isapp = 0;
				if (window.plus) {
					isapp = 1;
				}
				try {
					const [rInfo, rTeam] = await Promise.all([
						Fetch('/user/info', { isapp: isapp }),
						Fetch('/user/myTeam')
					]);
					this.data = rInfo.data || {};
					this.fundBalance = rInfo.data.fundBalance || 0;
					this.fundBalanceUsd = rInfo.data.fundBalanceUsd || 0;
					this.currency = rInfo.data.currency || '';
					this.signinStatue = rInfo.data.signin || false;
					this.selfInvestmentProfit = rTeam.data.report.income || 0;
				} catch (e) {
					console.error(e);
				} finally {
					this.pageLoading = false;
				}
			},
			logout() {
				localStorage.removeItem('token');
				this.$router.replace("/");
			}
		}
	};
</script>

<style lang="less" scoped>
.page {
	position: relative;
	min-height: 100vh;
	background: #faf7ff;
	padding: 20px 0 88px;
	box-sizing: border-box;
	z-index: 1;
	overflow: hidden;
}

.page-bg {
	position: absolute;
	left: 0;
	width: 100%;
	pointer-events: none;
	z-index: -1;
}

.bg-main {
	top: 0;
}

.bg-second {
	top: 626px;
}

.bg-third {
	top: 1315px;
}

.user_container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	padding: 18px 12px 0;
	box-sizing: border-box;
}

.avatar {
	width: 60px;
	height: 60px;
	margin-bottom: 8px;
}

.text {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	font-weight: 700;
	font-size: 13px;
	color: #00001c;
}

.copy_button {
	width: 14px;
	height: 14px;
	margin-left: 8px;
	flex-shrink: 0;
	cursor: pointer;
}

.uid_row {
	height: 16px;
	margin-bottom: 6px;
}

.amount_card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	min-height: 102px;
	background: rgba(255, 255, 255, 0.95);
	border: 1px solid #fff;
	box-shadow: 0 9px 21px rgba(70, 74, 135, 0.08);
	border-radius: 20px;
	margin: 12px auto 0;
	box-sizing: border-box;
}

.item {
	flex: 1;
	padding: 12px 0;
	box-sizing: border-box;
}

.title {
	width: 100%;
	font-weight: 700;
	font-size: 13px;
	color: #64676e;
	line-height: 19px;
	text-align: center;
}

.amount {
	font-weight: 700;
	font-size: 20px;
	color: #00001c;
	line-height: 28px;
	text-align: center;
	margin-top: 9px;
	word-break: break-all;
	padding: 0 10px;
}

.amount_unit {
	margin-top: 3px;
	font-weight: 700;
	font-size: 11px;
	color: #64676e;
	line-height: 17px;
	text-align: center;
}

.amount_desc {
	margin-top: 3px;
	font-weight: 700;
	font-size: 11px;
	color: #64676e;
	line-height: 17px;
	text-align: center;
	padding: 0 8px;
	word-break: break-all;
}

.card_container {
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.84);
	border-radius: 20px;
	border: 1px solid #fff;
	padding: 11px 10px 12px;
	margin: 14px auto 0;
	backdrop-filter: blur(4px);
}

.card_title {
	margin-bottom: 8px;
	padding-left: 4px;
	font-size: 13px;
	font-weight: 700;
	line-height: 15px;
	color: #7a7f93;
	letter-spacing: 0.5px;
}

.menu_grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 8px;
	padding: 0;
}

.primary_actions {
	grid-template-columns: repeat(2, 1fr);
}

.menu_item {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 52px;
	padding: 9px 6px;
	background: #fff;
	border: 1px solid #edf0ff;
	border-radius: 10px;
	box-shadow: 0 6px 15px rgba(70, 74, 135, 0.08);
	cursor: pointer;
	box-sizing: border-box;
}

.menu_item:active {
	background: #f8f9ff;
}

.menu_item_column {
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 10px 9px;
}

.menu_item_danger {
	border-color: #ffd9de;
	background: linear-gradient(180deg, #fff, #fff8f9);
}

.menu_item_danger:active {
	background: #fff1f4;
}

.menu_name {
	font-size: 12px;
	font-weight: 600;
	color: #22273d;
	text-align: center;
	line-height: 1.4;
}

.menu_desc {
	margin-top: 3px;
	font-weight: 700;
	font-size: 10px;
	line-height: 14px;
	color: #7a7f93;
	text-align: center;
	word-break: break-word;
}
</style>
