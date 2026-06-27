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

    <!-- Stats Grid -->
    <div class="stats_grid">
      <div
        v-for="t in statsCards"
        :key="t.key"
        class="stats_item"
      >
        <div class="stats_label">
          {{ t.label }}
        </div>
        <div class="stats_value item_column">
          <div class="item_amount">
            {{ t.value }}
          </div>
          <div
            v-if="t.key !== 'teamSize'"
            class="item_unit"
          >
            {{ platformMoneySymbol }}
          </div>
          <div
            v-else
            class="item_unit"
          >
            {{ $t('team.people') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Invitation Link Card -->
    <div class="amount_card invite_card">
      <div class="item invite_item">
        <div class="title">
          {{ translate('team.inviteLabel', '邀请链接', 'Invitation Link') }}
        </div>
        <div class="invite_content">
          <span class="invite_link">{{ user_info.share_link || "-" }}</span>
          <img
            v-clipboard="() => user_info.share_link"
            v-clipboard:success="copy"
            class="copy_button"
            src="/static/images/web3/icon-copy.png"
            alt="copy"
          >
        </div>
      </div>
    </div>

    <!-- Team Bonus Panel -->
    <div
      v-if="bonusDisplayRows.length"
      class="team_bonus_panel"
    >
      <div
        v-for="t in bonusDisplayRows"
        :key="t.key"
        class="team_bonus_row"
      >
        <span class="team_bonus_line">{{ t.text }}</span>
      </div>
    </div>

    <!-- Leaderboard / Sub-users List Card -->
    <div class="card_container">
      <div class="leaderboard">
        <!-- Level Tabs -->
        <div class="level_tabs">
          <div
            class="level_tab"
            :class="{ active: 1 === subLevel }"
            @click="changeSubLevel(1)"
          >
            {{ translate('team.level1', '一级下线', 'Level 1') }}
          </div>
          <div
            class="level_tab"
            :class="{ active: 2 === subLevel }"
            @click="changeSubLevel(2)"
          >
            {{ translate('team.level2', '二级下线', 'Level 2') }}
          </div>
          <div
            class="level_tab"
            :class="{ active: 3 === subLevel }"
            @click="changeSubLevel(3)"
          >
            {{ translate('team.level3', '三级下线', 'Level 3') }}
          </div>
        </div>

        <!-- Leaderboard Header -->
        <div class="leaderboard_header">
          <div class="header_item1">
            {{ translate('team.registeredAccount', '注册账户', 'Registered Account') }}
          </div>
          <div class="header_item">
            {{ translate('team.rechargeAmount', '投资金额', 'Investment Amount') }}
          </div>
          <div class="header_item">
            {{ translate('team.selfInvestmentProfit', '投入收益总计', 'Self Investment Profit') }}
          </div>
        </div>

        <!-- Leaderboard List -->
        <div
          v-if="subUsers.length"
          class="leaderboard_list"
        >
          <div
            v-for="item in subUsers"
            :key="item.id"
            class="leaderboard_item"
          >
            <div class="item-main">
              <div class="item1">
                {{ item.username }}
              </div>
              <div class="item item_column">
                <div class="item_amount">
                  {{ common.precision_basic(item.recharge_sum) }}
                </div>
                <div class="item_unit">
                  {{ platformMoneySymbol }}
                </div>
              </div>
              <div class="item item_column">
                <div class="item_amount">
                  0.00
                </div>
                <div class="item_unit">
                  {{ platformMoneySymbol }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="leaderboard_list"
        >
          <van-empty :description="$t('utils.noData')" />
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="pagination"
        >
          <div
            class="page-button"
            :class="{disabled: 1 === currentPage}"
            @click="handlePageChange(currentPage - 1)"
          >
            <img
              class="icon-arrow icon-arrow-left"
              src="/static/images/web3/icon-arrow.png"
              alt="Previous"
            >
          </div>
          <div
            v-for="page in visiblePages"
            :key="page"
            :class="['page-item', {active: page === currentPage}]"
            @click="handlePageChange(page)"
          >
            {{ page }}
          </div>
          <div
            class="page-button"
            :class="{disabled: currentPage === totalPages}"
            @click="handlePageChange(currentPage + 1)"
          >
            <img
              class="icon-arrow icon-arrow-right"
              src="/static/images/web3/icon-arrow.png"
              alt="Next"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	import Vue from 'vue';
	import Fetch from '../../utils/fetch'
	import Clipboard from "v-clipboard";
	import {
		Icon,
		Empty,
		Popup
	} from "vant";

	Vue.use(Icon).use(Clipboard).use(Empty).use(Popup);

	export default {
		name: "Team",
		data() {
			return {
				user_info: {},
				report: {
					"direct_count": 0,
					"indirect_count": 0,
					"income": 0,
					"income_to": 0,
					"income_ye": 0,
					"add_count": 0,
					"add_count_to": 0,
					"add_count_ye": 0
				},
				subLevel: 1,
				currentPage: 1,
				pageSize: 10,
				totalPages: 1,
				allList: [],
				allListLoaded: false,
				subUsers: [],
				pageLoading: true
			};
		},
		computed: {
			statsCards() {
				return [
					{
						key: "totalRevenue",
						label: this.$t('team.totalRevenue'),
						value: this.common.precision_basic(this.report.income)
					},
					{
						key: "revenueToday",
						label: this.$t('team.revenueToday'),
						value: this.common.precision_basic(this.report.income_to)
					},
					{
						key: "yesterday",
						label: this.$t('team.yesterday'),
						value: this.common.precision_basic(this.report.income_ye)
					},
					{
						key: "teamSize",
						label: this.$t('team.teamSize'),
						value: this.report.add_count
					}
				];
			},
			platformMoneySymbol() {
				return this.common.currency_symbol_basic();
			},
			visiblePages() {
				const size = 5;
				let start = Math.max(1, this.currentPage - Math.floor(size / 2));
				let end = Math.min(this.totalPages, start + size - 1);
				if (end - start + 1 < size) {
					start = Math.max(1, end - size + 1);
				}
				const pages = [];
				for (let i = start; i <= end; i++) {
					pages.push(i);
				}
				return pages;
			},
			bonusDisplayRows() {
				return [
					{
						key: "bonus_line_1",
						text: this.translate("team.bonus_line_1", "一级首投奖励 8%", "Team Level 1 First Investment Bonus 8%")
					},
					{
						key: "bonus_line_2",
						text: this.translate("team.bonus_line_2", "二级首投奖励 3%", "Team Level 2 First Investment Bonus 3%")
					},
					{
						key: "bonus_line_3",
						text: this.translate("team.bonus_line_3", "三级首投奖励 2%", "Team Level 3 First Investment Bonus 2%")
					},
					{
						key: "bonus_line_4",
						text: this.translate("team.bonus_line_4", "一级日返利 3%", "Team Level 1 Daily Rebate 3%")
					},
					{
						key: "bonus_line_5",
						text: this.translate("team.bonus_line_5", "二级日返利 2%", "Team Level 2 Daily Rebate 2%")
					},
					{
						key: "bonus_line_6",
						text: this.translate("team.bonus_line_6", "三级日返利 1%", "Team Level 3 Daily Rebate 1%")
					}
				];
			}
		},
		created() {
			window.document.title = this.$t('home.team');
			if (window.plus) {
				window.plus.navigator.setStatusBarBackground('#faf7ff');
				window.plus.navigator.setStatusBarStyle('dark');
			}
			this.$parent.footer('team');
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
				try {
					const r = await Fetch('/user/myTeam');
					this.user_info = r.data.user_info || {};
					this.report = r.data.report || {};
					
					// Dynamic invitation link construct to target current domain
					if (this.user_info.invite_code) {
						const origin = window.location.origin;
						this.user_info.share_link = `${origin}/#/register?code=${this.user_info.invite_code}`;
					}
					
					await this.getSubUsers();
				} catch (e) {
					console.error(e);
				} finally {
					this.pageLoading = false;
				}
			},
			async getSubUsers() {
				if (this.allListLoaded) {
					this.updateCurrentPageList();
					return;
				}
				try {
					const r = await Fetch('/user/teamList', {
						page: 1,
						listRows: 1000
					});
					this.allList = r.data.list || [];
					this.allListLoaded = true;
					this.updateCurrentPageList();
				} catch (e) {
					console.error(e);
				}
			},
			updateCurrentPageList() {
				const filtered = this.allList.filter(item => {
					if (this.subLevel === 1) return item.level === 1;
					if (this.subLevel === 2) return item.level === 2;
					return item.level >= 3;
				});

				this.totalPages = Math.ceil(filtered.length / this.pageSize) || 1;
				if (this.currentPage > this.totalPages) {
					this.currentPage = this.totalPages;
				}

				const start = (this.currentPage - 1) * this.pageSize;
				const end = start + this.pageSize;
				this.subUsers = filtered.slice(start, end);
			},
			changeSubLevel(level) {
				if (this.subLevel !== level) {
					this.subLevel = level;
					this.currentPage = 1;
					this.updateCurrentPageList();
				}
			},
			handlePageChange(page) {
				if (page >= 1 && page <= this.totalPages) {
					this.currentPage = page;
					this.updateCurrentPageList();
				}
			}
		}
	};
</script>

<style lang="less" scoped>
.page {
	position: relative;
	min-height: 100vh;
	background: #faf7ff;
	padding: 20px 0 80px;
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

.amount_card {
	display: flex;
	width: 335px;
	background: rgba(255, 255, 255, 0.95);
	border: 1px solid #fff;
	box-shadow: 0 9px 21px rgba(70, 74, 135, 0.08);
	border-radius: 20px;
	margin: 15px auto 0;
}

.invite_card {
	min-height: 90px;
	padding: 12px 15px;
	box-sizing: border-box;
}

.stats_grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
	width: 335px;
	margin: 15px auto 0;
}

.stats_item {
	min-height: 84px;
	padding: 12px;
	background: rgba(255, 255, 255, 0.95);
	border: 1px solid #fff;
	border-radius: 16px;
	box-shadow: 0 9px 21px rgba(70, 74, 135, 0.08);
	box-sizing: border-box;
}

.stats_label {
	font-weight: 700;
	font-size: 14px;
	line-height: 20px;
	color: #64676e;
}

.stats_value {
	margin-top: 9px;
	font-weight: 700;
	font-size: 18px;
	line-height: 25px;
	color: #00001c;
	word-break: break-all;
}

.invite_item {
	width: 100%;
}

.title {
	font-family: PingFang SC;
	font-weight: 700;
	font-size: 16px;
	color: #64676e;
	line-height: 22px;
}

.invite_content {
	display: flex;
	align-items: flex-start;
	gap: 6px;
	margin-top: 8px;
}

.invite_link {
	flex: 1;
	font-size: 12px;
	color: #00001c;
	word-break: break-all;
	line-height: 1.6;
}

.copy_button {
	width: 14px;
	height: 14px;
	flex-shrink: 0;
	cursor: pointer;
}

.team_bonus_panel {
	width: 335px;
	margin: 12px auto 0;
	padding: 12px 14px;
	background: rgba(255, 255, 255, 0.95);
	border: 1px solid #fff;
	border-radius: 16px;
	box-shadow: 0 9px 21px rgba(70, 74, 135, 0.08);
	box-sizing: border-box;
}

.team_bonus_row + .team_bonus_row {
	margin-top: 7px;
}

.team_bonus_line {
	display: block;
	font-weight: 700;
	font-size: 12px;
	line-height: 17px;
	color: #64676e;
	word-break: break-word;
}

.card_container {
	box-sizing: border-box;
	width: 335px;
	background: rgba(255, 255, 255, 0.84);
	border-radius: 20px;
	border: 1px solid #fff;
	padding: 13px 12px 15px;
	margin: 21px auto 0;
	backdrop-filter: blur(4px);
}

.level_tabs {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 6px;
	margin-bottom: 12px;
	padding: 4px;
	border-radius: 12px;
	background: #f4f0ff;
}

.level_tab {
	min-height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 4px;
	border-radius: 9px;
	font-weight: 700;
	font-size: 12px;
	line-height: 17px;
	color: #64676e;
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
}

.level_tab.active {
	color: #fff;
	background: linear-gradient(135deg, #8b5cf6, #6d5dfc);
	box-shadow: 0 5px 11px rgba(109, 93, 252, 0.22);
}

.leaderboard_header {
	display: grid;
	grid-template-columns: 110px minmax(0, 1fr) minmax(0, 1fr);
	column-gap: 8px;
	align-items: center;
	width: 100%;
	font-weight: 700;
	font-size: 14px;
	color: #64676e;
}

.header_item1 {
	text-align: left;
}

.header_item {
	text-align: center;
	font-size: 12px;
}

.leaderboard_list {
	margin-top: 9px;
}

.leaderboard_item {
	margin-bottom: 8px;
	border: 1px solid #edf0ff;
	border-radius: 12px;
	overflow: hidden;
	background: #fff;
	box-shadow: 0 6px 15px rgba(70, 74, 135, 0.08);
}

.item-main {
	display: grid;
	grid-template-columns: 110px minmax(0, 1fr) minmax(0, 1fr);
	column-gap: 8px;
	align-items: center;
	padding: 11px 12px;
	background-color: #fff;
	box-sizing: border-box;
}

.item1 {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 12px;
	color: #1f2437;
}

.item {
	flex: 1;
	text-align: center;
	font-size: 12px;
	color: #444b66;
}

.item_column {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.item_amount {
	font-weight: 700;
	font-size: 16px;
	line-height: 22px;
	color: #00001c;
	word-break: break-all;
}

.item_unit {
	margin-top: 2px;
	font-weight: 700;
	font-size: 10px;
	line-height: 14px;
	color: #64676e;
}

/* Pagination styles */
.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 10px;
}

.page-item {
	padding: 5px 10px;
	margin: 0 3px;
	border: 1px solid #ccc;
	border-radius: 2.5px;
	font-size: 12px;
	cursor: pointer;
}

.page-item.active {
	background-color: #767dff;
	color: #fff;
	border-color: #767dff;
}

.page-button {
	padding: 5px;
	cursor: pointer;
	display: flex;
	align-items: center;
}

.page-button.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.icon-arrow {
	width: 10px;
	height: 15px;
}

.icon-arrow-left {
	transform: rotate(180deg);
}
</style>
