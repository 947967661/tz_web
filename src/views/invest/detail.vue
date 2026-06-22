<template>
  <div class="confirm-page">
    <img
      class="page-bg bg-main"
      src="../img/index/web3/bg.png"
      alt=""
    >

    <div class="sub-header">
      <div
        class="side left"
        @click="$router.back()"
      >
        <img
          class="back-icon"
          src="/static/images/web3/icon-back.png"
          alt="back"
        >
      </div>
      <div class="title">
        {{ translate('paymentConfirmation', '付款确认', 'Payment Confirmation') }}
      </div>
      <div class="side right" />
    </div>

    <div class="checkout_card">
      <div class="compact_amount">
        <div class="compact_top">
          <div>
            <div class="summary_label">
              {{ translate('orderConfirm', '投资订单确认', 'Investment Order Confirmation') }}
            </div>
            <div class="summary_title">
              {{ item.title }}
            </div>
          </div>
          <div class="summary_badge">
            {{ $t('analyst.fixedTerm') }}
          </div>
        </div>
        <div class="amount_line">
          <div class="amount_label">
            {{ translate('paymentAmount', '支付金额', 'Payment Amount') }}
          </div>
          <div class="amount_value">
            {{ item.min }} <span class="currency-text">{{ symbol }}</span>
          </div>
        </div>
      </div>

      <div class="compact_receipt">
        <div class="section_title">
          {{ translate('purchaseInfo', '购买信息', 'Purchase Information') }}
        </div>
        <div class="receipt_list">
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('productName', '商品名称', 'Product Name') }}
            </div>
            <div class="receipt_value">
              {{ item.title }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('productType', '商品类型', 'Product Type') }}
            </div>
            <div class="receipt_value">
              {{ $t('analyst.fixedTerm') }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('term', '投资周期', 'Investment Period') }}
            </div>
            <div class="receipt_value">
              {{ item.day }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('rate', '日收益率', 'Daily Yield Rate') }}
            </div>
            <div class="receipt_value highlight">
              {{ item.rate }}%
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('balance', '余额', 'Balance') }}
            </div>
            <div class="receipt_value">
              {{ user.balance }} {{ symbol }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('minPurchaseLabel', '最小申购数量', 'Minimum Purchase Amount') }}
            </div>
            <div class="receipt_value">
              {{ item.min }} {{ symbol }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('maxPurchaseLabel', '最大申购数量', 'Maximum Purchase Amount') }}
            </div>
            <div class="receipt_value">
              {{ item.min }} {{ symbol }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('purchaseTimeLabel', '申购时间', 'Purchase Time') }}
            </div>
            <div class="receipt_value">
              {{ purchaseTime }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('interestCycleLabel', '计息周期', 'Interest Cycle') }}
            </div>
            <div class="receipt_value">
              {{ translate('daily', '每日', 'Daily') }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('rewardReleaseLabel', '收益发放', 'Reward Release') }}
            </div>
            <div class="receipt_value">
              {{ translate('nextDayReward', '次日 08:00 am', 'Next Day 08:00 am') }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('endTimeLabel', '结束时间', 'End Time') }}
            </div>
            <div class="receipt_value">
              {{ endTime }}
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('referenceMonthLabel', '参考月化', 'Reference Monthly Yield') }}
            </div>
            <div class="receipt_value highlight">
              {{ monthlyReturn }}%
            </div>
          </div>
          <div class="receipt_row">
            <div class="receipt_label">
              {{ translate('maturityIncomeLabel', '到期收益', 'Maturity Income') }}
            </div>
            <div class="receipt_value highlight">
              {{ maturityIncome }}
            </div>
          </div>
        </div>
      </div>

      <div
        class="inline_submit_button"
        :class="{ disabled: loading }"
        @click="submitPayment"
      >
        {{ loading ? translate('submitting', '提交中...', 'Submitting...') : translate('confirmPay', '确认支付', 'Confirm Payment') }}
      </div>
    </div>
  </div>
</template>

<script>
import Fetch from '../../utils/fetch'

export default {
	name: "InvestDetail",
	data() {
		return {
			item: {
				min: 0,
				type: 1,
				rate: 0,
				day: 0,
				title: ""
			},
			user: {
				balance: "0.0000",
				login: false
			},
			purchaseTime: "",
			endTime: "",
			monthlyReturn: "0.00",
			maturityIncome: "0.00",
			loading: false,
			symbol: localStorage.getItem('currency_symbol_basic') || 'PHP'
		};
	},
	created() {
		if (window.plus) {
			window.plus.navigator.setStatusBarBackground('#faf7ff');
			window.plus.navigator.setStatusBarStyle('dark');
		}
		this.$parent.footer('user', false);
	},
	mounted() {
		this.start();
	},
	methods: {
		start() {
			Fetch('/index/item_detail', {
				id: this.$router.history.current.params.code
			}).then(r => {
				this.item = r.data.item;
				this.user = r.data.user;
				this.symbol = this.common.currency_symbol_basic() || 'PHP';
				this.calculateDetails();
			}).catch(() => {
				this.$toast(this.translate('networkException', '网络异常，请重试', 'Network exception, please try again'));
			});
		},
		calculateDetails() {
			const now = new Date();
			this.purchaseTime = this.getFormattedDate(now);
			
			// Calculate End Time (set to 20:00:00 per target spec)
			const end = new Date(now.getTime() + Number(this.item.day || 0) * 24 * 60 * 60 * 1000);
			end.setHours(20, 0, 0, 0);
			this.endTime = this.getFormattedDate(end);
			
			// Compound Monthly Yield calculation
			const daily = Number(this.item.rate || 0) / 100;
			const monthly = Math.pow(1 + daily, 30) - 1;
			this.monthlyReturn = (monthly * 100).toFixed(2);
			
			// Maturity Income calculation
			if (this.item.type == 1) {
				this.maturityIncome = this.common.precision_basic(this.item.min * this.item.rate * this.item.day / 100);
			} else {
				this.maturityIncome = this.common.precision_basic(this.item.min * this.item.rate / 100);
			}
		},
		getFormattedDate(date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			const seconds = String(date.getSeconds()).padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		},
		translate(key, defaultZh, defaultEn) {
			const val = this.$t(key);
			if (val && val !== key) {
				return val;
			}
			const lang = this.$i18n.locale || 'en_us';
			if (lang.toLowerCase().indexOf('zh') !== -1) {
				return defaultZh;
			}
			return defaultEn;
		},
		submitPayment() {
			if (this.loading) return;
			if (!this.user.login) {
				this.$toast(this.$t('invest.loginFirst'));
				return;
			}
			if (Number(this.user.balance) - Number(this.item.min) < 0) {
				this.$toast(this.$t('invest.moneyNotEnough'));
				return;
			}
			this.loading = true;
			Fetch('/user/invest', {
				id: this.item.id
			}).then(() => {
				this.$toast.success(this.translate('investSuccess', '支付成功', 'Payment Successful'));
				setTimeout(() => {
					this.$router.replace('/invest/record');
				}, 1000);
			}).catch(() => {
				this.loading = false;
			});
		}
	}
};
</script>

<style lang="less" scoped>
.confirm-page {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	min-height: 100vh;
	background: #faf7ff;
	padding-bottom: 40px;
	z-index: 1;
	overflow-x: hidden;
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

.sub-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 52px;
	padding: 12px 14px 0;
	box-sizing: border-box;
	background-color: transparent;
}

.side {
	width: 60px;
	height: 32px;
	display: flex;
	align-items: center;
}

.left {
	justify-content: flex-start;
}

.right {
	justify-content: flex-end;
}

.back-icon {
	width: 20px;
	height: 17.5px;
	cursor: pointer;
}

.title {
	flex: 1;
	text-align: center;
	font-size: 15px;
	font-weight: 700;
	color: #102348;
	line-height: 21px;
}

.checkout_card {
	margin: 22px 18px 34px;
	padding: 20px;
	border-radius: 20px;
	background: rgba(255, 255, 255, 0.95);
	border: 1.5px solid #fff;
	box-shadow: 0 7px 16px rgba(70, 74, 135, 0.08);
	overflow: hidden;
	position: relative;
	backdrop-filter: blur(8px);
}

.checkout_card::after {
	content: "";
	position: absolute;
	right: -45px;
	top: -45px;
	width: 115px;
	height: 115px;
	border-radius: 50%;
	background: rgba(118, 125, 255, 0.08);
	pointer-events: none;
}

.compact_amount {
	padding: 18px;
	border-radius: 13px;
	background: linear-gradient(135deg, #f8f9ff, #fff);
	border: 1px solid #eef1ff;
}

.compact_top, .amount_line {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 9px;
}

.amount_line {
	margin-top: 15px;
}

.summary_label, .amount_label {
	font-size: 12px;
	color: #64676e;
	line-height: 17px;
}

.summary_title {
	margin-top: 4px;
	font-size: 15px;
	font-weight: 700;
	color: #00001c;
	line-height: 19px;
}

.summary_badge {
	flex-shrink: 0;
	padding: 5px 9px;
	border-radius: 999px;
	font-size: 11px;
	font-weight: 700;
	color: #767dff;
	background: rgba(118, 125, 255, 0.08);
}

.amount_value {
	font-size: 21px;
	font-weight: 700;
	color: #747cfd;
	line-height: 25px;
	text-align: right;
}

.currency-text {
	font-size: 12px;
	color: #64676e;
	margin-left: 3px;
	font-weight: normal;
}

.compact_receipt {
	margin-top: 18px;
}

.section_title {
	font-size: 13px;
	font-weight: 700;
	color: #00001c;
	line-height: 17px;
	margin-bottom: 8px;
}

.receipt_list {
	padding: 2px 1px 0;
}

.receipt_row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 0;
	border-bottom: 1px solid #f0f2ff;
}

.receipt_row:last-child {
	border-bottom: 0;
	padding-bottom: 2px;
}

.receipt_label {
	flex-shrink: 0;
	font-size: 11.5px;
	color: #70737d;
	line-height: 16.5px;
}

.receipt_value {
	font-size: 12px;
	font-weight: 600;
	color: #00001c;
	line-height: 16.5px;
	text-align: right;
	word-break: break-word;
}

.receipt_value.highlight {
	color: #747cfd;
}

.inline_submit_button {
	margin-top: 24px;
	height: 46px;
	border-radius: 11px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	font-weight: 600;
	color: #fff;
	background: linear-gradient(135deg, #767dff, #5560ff);
	box-shadow: 0 8px 14px rgba(118, 125, 255, 0.2);
	cursor: pointer;
	transition: opacity 0.2s;
}

.inline_submit_button:active {
	opacity: 0.85;
}

.inline_submit_button.disabled {
	opacity: 0.6;
	cursor: not-allowed;
}
</style>
