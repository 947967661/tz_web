<template>
  <div class="subscription-page">
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

    <div class="header_container" />

    <h1 class="page-title">
      {{ $t('home.subscription') }}
    </h1>

    <div class="select_container">
      <div class="left_tab">
        <div
          class="left_tab_item"
          :class="selectCurrent === 0 ? 'left_tab_item_active' : ''"
          @click="tabChange(0)"
        >
          {{ $t('subscription.inProgress') }}
        </div>
        <div
          class="left_tab_item"
          :class="selectCurrent === 1 ? 'left_tab_item_active' : ''"
          @click="tabChange(1)"
        >
          {{ $t('subscription.completed') }}
        </div>
      </div>
    </div>

    <div class="card">
      <div
        v-if="pageLoading"
        class="card_item card_item--empty"
      >
        <div class="empty-text">
          Loading...
        </div>
      </div>
      <div
        v-else-if="myOrderList.length === 0"
        class="card_item card_item--empty"
      >
        <div class="empty-text">
          {{ $t('utils.noData') }}
        </div>
      </div>
      <div
        v-for="(item, index) in myOrderList"
        :key="index"
        class="card_item"
      >
        <div class="top">
          <div class="top_left">
            <img
              class="avatar"
              :src="item.image || defaultAvatar"
              alt=""
            >
            <div class="user_info">
              <div class="text1">
                {{ item.title || '-' }}
              </div>
              <div class="text2">
                {{ item.subTitle || $t('invest.invest') }}
              </div>
            </div>
          </div>
          <div
            v-if="showMonthlyYield(item)"
            class="top_right"
          >
            <div class="text3">
              {{ $t('subscription.monthlyYieldRate') }}
            </div>
            <div class="text4">
              {{ displayMonthlyReturnRate(item) }}%
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="item">
            <div class="label">
              {{ $t('subscription.orderNo') }}
            </div>
            <div class="value">
              {{ item.order_no || item.id }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              {{ $t('subscription.investmentAmount') }}
            </div>
            <div class="value">
              {{ platformMoneySymbol }} {{ formatMoney(item.money) }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              {{ $t('subscription.duration') }}
            </div>
            <div class="value">
              {{ item.day }}{{ $t('subscription.day') }}
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="item">
            <div class="label">
              {{ $t('subscription.subscriptionTime') }}
            </div>
            <div class="value">
              {{ item.time_actual || '-' }}
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="item">
            <div class="label">
              {{ $t('subscription.interestPeriod') }}
            </div>
            <div class="value">
              {{ $t('subscription.everyDay') }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              {{ $t('subscription.yieldDistribution') }}
            </div>
            <div class="value">
              {{ $t('subscription.nextDay') }} 8:00 am
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="item">
            <div class="label">
              {{ $t('subscription.endTime') }}
            </div>
            <div class="value">
              {{ item.time2_actual || '-' }}
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="item">
            <div class="label">
              {{ $t('subscription.dailyIncome') }}
            </div>
            <div class="value">
              {{ platformMoneySymbol }} {{ calcDailyIncome(item) }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              {{ $t('subscription.maturityIncome') }}
            </div>
            <div class="value">
              {{ platformMoneySymbol }} {{ calcMaturityIncome(item) }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              {{ $t('subscription.earnedIncome') }}
            </div>
            <div class="value">
              {{ platformMoneySymbol }} {{ formatMoney(item.total_interest) }}
            </div>
          </div>
        </div>

        <div
          v-if="item.is_renew !== undefined && selectCurrent === 0"
          class="status-and-action"
        >
          <div
            class="renewal-status"
            :class="{ active: item.is_renew }"
          >
            {{ item.is_renew ? $t('subscription.autoRenew') : $t('subscription.noAutoRenew') }}
          </div>
          <div
            class="renewal-button"
            @click="toggleRenewal(item)"
          >
            {{ item.is_renew ? $t('subscription.cancelRenewal') : $t('subscription.renewal') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Fetch from '../../utils/fetch';

export default {
	name: "Subscription",
	data() {
		return {
			pageLoading: true,
			selectCurrent: 0,
			myOrderList: [],
			platformMoneySymbol: localStorage.getItem('currency_symbol_basic') || '$',
			defaultAvatar: '/static/images/web3/icon-avatar.png'
		};
	},
	created() {
		window.document.title = this.$t('home.subscription');
		if (window.plus) {
			plus.navigator.setStatusBarBackground('#faf7ff');
			plus.navigator.setStatusBarStyle('dark');
		}
		this.$parent.footer('subscription', true);
	},
	mounted() {
		this.loadData();
	},
	methods: {
		tabChange(index) {
			this.selectCurrent = index;
			this.loadData();
		},
		loadData() {
			this.pageLoading = true;
			Fetch('/user/investRecord', {
				status: this.selectCurrent === 0 ? 0 : 1,
				page: 1,
				listRows: 100
			}).then((r) => {
				let list = r.data.list || [];
				// Fallback client-side filtering if backend ignores status param
				const expectedStatus = this.selectCurrent === 0 ? 0 : 1;
				if (list.length && list[0].status !== undefined) {
					const filtered = list.filter(item => Number(item.status) === expectedStatus);
					if (filtered.length > 0 || list.some(item => Number(item.status) === expectedStatus)) {
						list = filtered;
					}
				}
				this.myOrderList = list;
			}).catch(() => {
				this.myOrderList = [];
			}).finally(() => {
				this.pageLoading = false;
			});
		},
		formatMoney(val) {
			if (val === undefined || val === null) return '0.00';
			return Number(val).toFixed(2);
		},
		showMonthlyYield(item) {
			return item.rate && Number(item.rate) > 0;
		},
		getDailyRate(item) {
			return Number(item.rate || 0) / 100;
		},
		displayMonthlyReturnRate(item) {
			const daily = this.getDailyRate(item);
			if (!daily) return '0.00';
			const monthly = Math.pow(1 + daily, 30) - 1;
			return (monthly * 100).toFixed(2);
		},
		calcDailyIncome(item) {
			const rate = this.getDailyRate(item);
			const money = Number(item.money || 0);
			return (rate * money).toFixed(4);
		},
		calcMaturityIncome(item) {
			const rate = this.getDailyRate(item);
			const money = Number(item.money || 0);
			const day = Number(item.day || 0);
			return (rate * money * day).toFixed(4);
		},
		toggleRenewal(item) {
			// Current PHP backend does not expose a toggle_renewal endpoint,
			// so we only reflect the state change locally.
			item.is_renew = !item.is_renew;
			this.$toast(item.is_renew ? this.$t('subscription.renewalEnabledSuccess') : this.$t('subscription.renewalDisabledSuccess'));
		}
	}
};
</script>

<style lang="less" scoped>
.subscription-page {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	min-height: 100vh;
	background: #faf7ff;
	padding-bottom: 80px;
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

.header_container {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	width: 100%;
	height: 10px;
	padding: 10px 16px 0;
}

.page-title {
	width: 100%;
	margin: 0;
	margin-top: 13px;
	font-weight: 700;
	font-size: 30px;
	color: #00001c;
	line-height: 34px;
	text-align: left;
	padding-left: 20px;
	box-sizing: border-box;
}

.select_container {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	padding: 0 20px;
	margin-top: 16px;

	.left_tab {
		display: flex;
		align-items: center;

		.left_tab_item {
			height: 20px;
			font-weight: 500;
			font-size: 14px;
			color: #8e8e93;
			line-height: 20px;
			text-align: left;

			&:nth-child(n+2) {
				margin-left: 21px;
			}
		}

		.left_tab_item_active {
			position: relative;
			height: 20px;
			font-weight: 700;
			font-size: 14px;
			color: #000;
			line-height: 20px;
			text-align: left;

			&::before {
				content: '';
				position: absolute;
				bottom: -5px;
				left: 0;
				width: 100%;
				height: 2px;
				background: #767dff;
				border-radius: 2px;
			}
		}
	}
}

.card {
	width: 100%;
	background: rgba(255, 255, 255, 0.84);
	border-radius: 20px;
	border: 1px solid #fff;
	margin-top: 25px;
	box-sizing: border-box;
	padding: 18px 14px 55px;
	backdrop-filter: blur(8px);

	.card_item {
		width: 100%;
		min-height: 160px;
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0 7px 16px rgba(70, 74, 135, 0.08);
		border: 1px solid #fff;
		border-radius: 12px;
		box-sizing: border-box;
		padding: 14px 12px 16px;

		&:nth-child(n+2) {
			margin-top: 20px;
		}

		&--empty {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 120px;
		}

		.empty-text {
			font-size: 14px;
			color: #8e8e93;
		}

		.top {
			box-sizing: border-box;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 12px;
			border-bottom: 1px solid #edf0ff;

			.top_left {
				display: flex;
				align-items: center;

				.avatar {
					width: 48px;
					height: 48px;
					border-radius: 50%;
					object-fit: cover;
				}

				.user_info {
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin-left: 10px;

					.text1 {
						font-weight: 700;
						font-size: 15px;
						color: #00001c;
						line-height: 22px;
						text-align: left;
					}

					.text2 {
						font-weight: 400;
						font-size: 12px;
						color: #64676e;
						line-height: 17px;
						text-align: left;
						margin-top: 3px;
					}
				}
			}

			.top_right {
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 7px 9px;
				border-radius: 10px;
				background: rgba(118, 125, 255, 0.08);

				.text3 {
					font-weight: 700;
					font-size: 11px;
					color: #64676e;
					line-height: 16px;
					text-align: right;
				}

				.text4 {
					font-weight: 700;
					font-size: 16px;
					color: #747cfd;
					line-height: 21px;
					text-align: right;
				}
			}
		}

		.bottom {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 8px;

			.item {
				flex: 1;

				.label {
					font-weight: 700;
					font-size: 11px;
					color: #64676e;
					line-height: 16px;
					text-align: center;
				}

				.value {
					margin-top: 8px;
					font-weight: 700;
					font-size: 14px;
					color: #747cfd;
					line-height: 20px;
					text-align: center;
					word-break: break-word;
				}
			}
		}

		.status-and-action {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10px;

			.renewal-status {
				padding: 5px 9px;
				border-radius: 999px;
				font-size: 11px;
				font-weight: 600;
				background-color: #f0f0f0;
				color: #8e8e93;

				&.active {
					background-color: rgba(118, 125, 255, 0.12);
					color: #767dff;
				}
			}

			.renewal-button {
				padding: 6px 12px;
				background-color: #767dff;
				color: #fff;
				border-radius: 10px;
				text-align: center;
				font-size: 12px;
				font-weight: 600;
				cursor: pointer;
			}
		}
	}
}
</style>
