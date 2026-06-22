<template>
  <div class="analyst-page">
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
      {{ $t('home.holdings') }}
    </h1>

    <div
      v-show="show_tabs"
      class="select_container"
    >
      <div class="left_tab">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          class="left_tab_item"
          :class="active === index ? 'left_tab_item_active' : ''"
          @click="sort(index)"
        >
          {{ tab.title }}
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
        v-else-if="analystList.length === 0"
        class="card_item card_item--empty"
      >
        <div class="empty-text">
          {{ $t('utils.noData') }}
        </div>
      </div>
      <div
        v-for="(item, index) in analystList"
        :key="index"
        class="card_item"
      >
        <div class="top">
          <div class="top_left">
            <img
              class="avatar"
              :src="item.img || defaultAvatar"
              alt=""
            >
            <div class="user_info">
              <div class="text1">
                {{ item.title || '-' }}
              </div>
              <div class="text2">
                {{ item.subTitle || $t('analyst.fixedTerm') }}
              </div>
            </div>
          </div>
          <div
            v-if="showReferenceAnnualized(item)"
            class="rate_top_right"
          >
            <div class="text3">
              {{ $t('analyst.referenceAnnualized') }}
            </div>
            <div class="text4">
              {{ displayAnnualizedRate(item) }}%
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="item">
            <div class="label">
              {{ $t('analyst.dailyYieldRate') }}
            </div>
            <div class="value">
              {{ item.rate }}%
            </div>
          </div>
          <div class="item">
            <div class="label">
              {{ $t('analyst.duration') }}
            </div>
            <div class="value">
              {{ item.day }}{{ $t('analyst.day') }}
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="item">
            <div class="label">
              {{ $t('analyst.dailyIncome') }}
            </div>
            <div class="value">
              {{ calcDailyIncome(item) }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              {{ $t('analyst.maturityIncome') }}
            </div>
            <div class="value">
              {{ calcMaturityIncome(item) }}
            </div>
          </div>
        </div>

        <div
          class="button"
          @click="subscribe(item)"
        >
          {{ getSubscribeButtonText(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Fetch from '../../utils/fetch';

export default {
	name: "Analyst",
	data() {
		return {
			pageLoading: true,
			show_tabs: false,
			active: 0,
			tabs: [{
				id: 0,
				title: this.$t('tabs.all')
			}],
			analystList: [],
			page: 1,
			listRows: 20,
			finished: false,
			defaultAvatar: '/static/images/web3/icon-avatar.png'
		};
	},
	created() {
		window.document.title = this.$t('home.holdings');
		if (window.plus) {
			plus.navigator.setStatusBarBackground('#faf7ff');
			plus.navigator.setStatusBarStyle('dark');
		}
		this.$parent.footer('holdings', true);
	},
	mounted() {
		if (this.$router.history.current.query.type) {
			this.active = parseInt(this.$router.history.current.query.type);
		}
		this.start();
	},
	methods: {
		start() {
			Fetch('/index/item_class').then((r) => {
				var tabs1 = [{
					id: 0,
					title: this.$t('tabs.all')
				}];
				r.data.classes.forEach(item => {
					tabs1.push({
						id: item.id,
						title: item.title,
					});
				});
				this.tabs = tabs1;
				this.show_tabs = tabs1.length > 1;
				this.loadData();
			}).catch(() => {
				this.loadData();
			});
		},
		sort(index) {
			this.active = index;
			this.page = 1;
			this.analystList = [];
			this.finished = false;
			this.loadData();
		},
		loadData() {
			this.pageLoading = true;
			Fetch('/index/item_list', {
				page: this.page,
				listRows: this.listRows,
				type: this.tabs[this.active]['id']
			}).then(r => {
				var list = r.data.list || [];
				if (this.page === 1) {
					this.analystList = list;
				} else {
					this.analystList = this.analystList.concat(list);
				}
				if (this.analystList.length >= r.data.length) {
					this.finished = true;
				} else {
					this.page = this.page + 1;
				}
			}).catch(() => {
				if (this.page === 1) {
					this.analystList = [];
				}
			}).finally(() => {
				this.pageLoading = false;
			});
		},
		showReferenceAnnualized(item) {
			return item.rate && Number(item.rate) > 0;
		},
		getDailyRate(item) {
			return Number(item.rate || 0) / 100;
		},
		displayAnnualizedRate(item) {
			const daily = this.getDailyRate(item);
			if (!daily) return '0.00';
			const monthly = Math.pow(1 + daily, 30) - 1;
			return (monthly * 100 * 12).toFixed(2);
		},
		calcDailyIncome(item) {
			const rate = this.getDailyRate(item);
			const min = Number(item.min || 0);
			return (rate * min).toFixed(4);
		},
		calcMaturityIncome(item) {
			const rate = this.getDailyRate(item);
			const min = Number(item.min || 0);
			const day = Number(item.day || 0);
			return (rate * min * day).toFixed(4);
		},
		getSubscribeButtonText(item) {
			return item.open_status === 'closed' ? this.$t('analyst.notOpen') : this.$t('analyst.subscribe');
		},
		subscribe(item) {
			if (item.open_status === 'closed') {
				this.$toast(this.$t('analyst.notOpenCannotBuy'));
				return;
			}
			this.$router.push('/invest/detail/' + item.id);
		}
	}
};
</script>

<style lang="less" scoped>
.analyst-page {
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
				flex: 1;
				min-width: 0;

				.avatar {
					width: 48px;
					height: 48px;
					border-radius: 50%;
					object-fit: cover;
					flex-shrink: 0;
				}

				.user_info {
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin-left: 10px;
					min-width: 0;

					.text1 {
						font-weight: 700;
						font-size: 15px;
						color: #00001c;
						line-height: 22px;
						text-align: left;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 100%;
					}

					.text2 {
						font-weight: 400;
						font-size: 12px;
						color: #64676e;
						line-height: 17px;
						text-align: left;
						margin-top: 3px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						max-width: 100%;
					}
				}
			}

			.rate_top_right {
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 7px 9px;
				border-radius: 10px;
				background: rgba(118, 125, 255, 0.08);
				flex-shrink: 0;
				margin-left: 10px;
				min-width: 70px;

				.text3 {
					font-weight: 700;
					font-size: 11px;
					color: #64676e;
					line-height: 16px;
					text-align: right;
					white-space: nowrap;
				}

				.text4 {
					font-weight: 700;
					font-size: 16px;
					color: #747cfd;
					line-height: 21px;
					text-align: right;
					white-space: nowrap;
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

		.button {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 44px;
			background: #767dff;
			border-radius: 12px;
			font-weight: 700;
			font-size: 14px;
			color: #fff;
			margin-top: 20px;
			cursor: pointer;
		}
	}
}
</style>
