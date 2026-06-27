<template>
  <div class="basic_wrap">
    <bsHeader
      :title="$t('user.languagePreference')"
      @backurl="$router.back()"
    />
    <div class="wrap_box">
      <div
        v-for="(item,index) in languages"
        class="block_div flex_center item"
        @click="changeLang(item.country,$event)"
      >
        <div class="left flex_center">
          <div><img :src="item.logo"></div>
          <div class="info">
            {{ item.country_loc }}
          </div>
        </div>
        <div v-if="lang==item.country">
          ✓
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	import Fetch from '../../utils/fetch'
	import bsHeader from '../../components/bsHeader.vue'
	import {
		Toast
	} from 'vant'
	export default {
		name: "Language",
		components: {
			bsHeader
		},
		data() {
			return {
				lang: this.$i18n.locale || "zh_cn",
				languages: []
			};
		},
		created() {
			if (window.plus) {
				plus.navigator.setStatusBarBackground('#FFFFFF');
				plus.navigator.setStatusBarStyle('dark');
			}
			this.$parent.footer('user', false);
		},
		mounted() {
			this.start();
		},
		methods: {
			start() {
				const allowed = ['en_us', 'ko_kr', 'ja_jp', 'de_de', 'zh_hk', 'ur_pk', 'fr_fr', 'es_es'];
				Fetch('/index/getLanguages').then(r => {
					let list = (r.data.list || []).slice();
					const hasUrdu = list.some(item => String(item.country).toLowerCase() === 'ur_pk');
					if (!hasUrdu) {
						list.push({
							country: 'ur_pk',
							country_loc: 'اردو',
							logo: '/images/language/ur_pk.png'
						});
					}
					this.languages = list.filter(item => allowed.includes(String(item.country).toLowerCase()));
				})
			},
			changeLang(lang, event) {
				this.lang = lang;
				this.$i18n.locale = lang;
				localStorage.setItem("lang", lang);
				Fetch("/index/changeLang").then((r) => {
					localStorage.setItem('currency', "");
					localStorage.setItem('precision', r.data.precision);
					localStorage.setItem("language_logo", r.data.language_logo);
					this.$router.go(-1);
				});
			},
		}
	};
</script>

<style lang="less" scoped>
	.wrap_box {
		flex-direction: column;
		align-items: center;
		padding-top: 55px;

		.item {
			height: 50px;
			padding: 15px;
			font-size: 14px;
			color: rgba(0, 0, 0, .8);
			font-weight: bold;
			line-height: 20px;
			justify-content: space-between;
			margin-bottom: 10px;

			.tips {
				color: rgba(0, 0, 0, .6);
				margin-left: auto;
				margin-right: 4px;
				font-weight: normal;
			}

			.left {
				img {
					width: 33px;
					margin-top: 5px;
				}
			}
		}
	}
</style>
