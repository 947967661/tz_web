<template>
  <div class="web3-home">
    <img
      class="page-bg page-bg-main"
      :src="bgMain"
      alt=""
    >
    <img
      class="page-bg page-bg-second"
      :src="bgSecond"
      alt=""
    >
    <img
      class="page-bg page-bg-third"
      :src="bgThird"
      alt=""
    >
    <img
      class="page-bg page-bg-fourth"
      :src="bgFourth"
      alt=""
    >

    <div class="home-topbar">
      <div class="home-logo-wrap">
        <img
          class="home-logo"
          :src="logo"
          alt="logo"
        >
      </div>
      <div
        class="home-language"
        @click="$router.push('/language')"
      >
        <img
          :src="language_logo"
          alt="language"
        >
      </div>
    </div>

    <section class="hero-section">
      <div class="hero-visual">
        <img
          class="hero-banner"
          :src="heroBanner"
          alt="hero-banner"
        >
      </div>
      <h1 class="hero-title">
        {{ homeCopy.heroTitle }}
      </h1>
      <p class="hero-desc">
        {{ homeCopy.heroDesc }}
      </p>
    </section>

    <section class="feature-section">
      <h2 class="section-title">
        {{ homeCopy.whyAiTitle }}
      </h2>
      <p class="section-desc">
        {{ homeCopy.whyAiDesc }}
      </p>

      <div class="feature-list">
        <article
          v-for="feature in featureCards"
          :key="feature.index"
          class="feature-card"
        >
          <div class="feature-badge">
            {{ feature.index }}
          </div>
          <h3 class="feature-card-title">
            {{ feature.title }}
          </h3>
          <p class="feature-card-desc">
            {{ feature.desc }}
          </p>
        </article>
      </div>
    </section>

    <section class="partner-section">
      <h2 class="section-title">
        {{ homeCopy.partnerTitle }}
      </h2>
      <p class="section-desc">
        {{ homeCopy.partnerDesc }}
      </p>

      <div class="partner-grid">
        <div
          v-for="partner in partners"
          :key="partner.name"
          class="partner-card"
        >
          <img
            class="partner-logo"
            :src="partner.logo"
            :alt="partner.name"
          >
        </div>
      </div>
    </section>

    <div
      class="kefu-stack"
      :class="show_kefu ? '' : 'kefu-stack-hide'"
      @click="kefu_to"
    >
      <div class="kefu-stack-item">
        <img
          class="kefu_img"
          src="../img/index/kefu.png"
          alt="service"
        >
      </div>
      <div class="kefu-stack-item telegram-item">
        <img
          class="kefu_img"
          src="/static/images/tt.jpg"
          alt="telegram"
        >
      </div>
    </div>
  </div>
</template>

<script>
	import Fetch from '../../utils/fetch';

	export default {
		name: "Index",
		data() {
			return {
				language_logo: localStorage.getItem('language_logo'),
				logo: localStorage.getItem("logo2"),
				show_kefu: false,
				bgMain: require('../img/index/web3/bg.png'),
				bgSecond: require('../img/index/web3/bg1.png'),
				bgThird: require('../img/index/web3/bg2.png'),
				bgFourth: require('../img/index/web3/bg3.png'),
				heroBanner: require('../img/index/web3/hero-banner.png'),
				partners: [
					{name: 'ChainGPT', logo: require('../img/index/web3/partners/chaingpt-main.svg')},
					{name: 'OpenAI', logo: require('../img/index/web3/partners/openai.webp')},
					{name: 'Hugging Face', logo: require('../img/index/web3/partners/huggingface.svg')},
					{name: 'Mistral AI', logo: require('../img/index/web3/partners/mistral.png')},
					{name: 'Cohere', logo: require('../img/index/web3/partners/cohere.svg')},
					{name: 'NVIDIA', logo: require('../img/index/web3/partners/nvidia.svg')},
					{name: 'Microsoft', logo: require('../img/index/web3/partners/microsoft.svg')},
					{name: 'Google', logo: require('../img/index/web3/partners/google.png')},
					{name: 'IBM', logo: require('../img/index/web3/partners/ibm.svg')},
					{name: 'AWS', logo: require('../img/index/web3/partners/aws.png')}
				],
				homeCopy: {
					heroTitle: 'Acexbit是全球领先的 AI 算力租赁平台',
					heroDesc: '加入 Acexbit，利用全球领先的 AI 调度算法，将您的 Token 租赁给急需算力与资源的机构。无需操作，收益按期到账。',
					whyAiTitle: '为什么选择 AI 租赁？',
					whyAiDesc: 'Acexbit AI 算力租赁平台“汇集私募资金，租赁顶级上游 AI 算力，并将收益分配给投资者“',
					featureSniffTitle: '智能嗅探',
					featureSniffDesc: 'AI 毫秒级监控全球租金，哪里贵，钱就租到哪里。',
					featureSecurityTitle: '安全合规',
					featureSecurityDesc: '所有租赁行为通过智能合约执行，资金不离开安全池。',
					featureReinvestTitle: '全自动复投',
					featureReinvestDesc: '产生的租金自动加入下一轮租赁，实现复利增长。',
					partnerTitle: '战略伙伴',
					partnerDesc: '联合全球领先的 AI 与云计算机构，为 Token 租赁、算力调度与安全结算提供底层支撑。'
				}
			};
		},
		computed: {
			featureCards() {
				return [
					{
						index: '01',
						title: this.homeCopy.featureSniffTitle,
						desc: this.homeCopy.featureSniffDesc
					},
					{
						index: '02',
						title: this.homeCopy.featureSecurityTitle,
						desc: this.homeCopy.featureSecurityDesc
					},
					{
						index: '03',
						title: this.homeCopy.featureReinvestTitle,
						desc: this.homeCopy.featureReinvestDesc
					}
				];
			}
		},
		created() {
			window.document.title = 'xxapp';
			if (window.plus) {
				plus.navigator.setStatusBarBackground('#FFFFFF');
				plus.navigator.setStatusBarStyle('dark');
			}
			this.$parent.footer('index');
		},
		mounted() {
			this.start();
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
		},
		methods: {
			start() {
				Fetch('/index/webconfig', {}, "", false).then((r) => {
					localStorage.setItem("logo", r.data.logo);
					localStorage.setItem("logo2", r.data.logo2);
					localStorage.setItem("language_logo", r.data.language_logo);
					this.logo = r.data.logo2 || r.data.logo;
					this.language_logo = r.data.language_logo;
					window.document.title = 'xxapp';
				}).catch(() => {});
			},
			kefu_to() {
				if (this.show_kefu) {
					this.$router.push('/service');
				}
				this.show_kefu = !this.show_kefu;
			}
		}
	};
</script>

<style lang="less" scoped>
	.web3-home {
		position: relative;
		min-height: 100vh;
		padding: 0 0 80px;
		overflow: hidden;
		background: #faf7ff;
	}

	.page-bg {
		position: absolute;
		left: 0;
		width: 100%;
		pointer-events: none;
		z-index: 0;
	}

	.page-bg-main {
		top: 0;
	}

	.page-bg-second {
		top: 905px;
	}

	.page-bg-third {
		top: 1577px;
	}

	.page-bg-fourth {
		top: 2255px;
	}

	.home-topbar,
	.hero-section,
	.feature-section,
	.partner-section,
	.kefu-stack {
		position: relative;
		z-index: 1;
	}

	.home-topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 6px 5px;
	}

	.home-logo-wrap {
		display: flex;
		align-items: center;
		min-height: 44px;

		.home-logo {
			height: 42px;
			width: auto;
			object-fit: contain;
		}
	}

	.home-language {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.72);
		border: 1px solid rgba(255, 255, 255, 0.9);
		box-shadow: 0 10px 24px rgba(70, 74, 135, 0.12);
		backdrop-filter: blur(8px);

		img {
			width: 32px;
			height: 32px;
			object-fit: contain;
		}
	}

	.hero-section {
		padding: 10px 19px 0;
	}

	.hero-visual {
		display: flex;
		justify-content: center;
		margin-top: 20px;

		.hero-banner {
			width: 282px;
			height: 233px;
			object-fit: contain;
		}
	}

	.hero-title,
	.section-title {
		margin: 0;
		font-weight: 700;
		color: #00001c;
	}

	.hero-title {
		margin-top: 37px;
		font-size: 21px;
		line-height: 25px;
	}

	.hero-desc,
	.section-desc {
		margin: 0;
		font-weight: 400;
		color: #64676e;
		white-space: pre-line;
	}

	.hero-desc {
		margin-top: 10px;
		font-size: 14px;
		line-height: 20px;
		color: #00001c;
	}

	.feature-section,
	.partner-section {
		padding: 21px 19px 0;
	}

	.section-title {
		font-size: 24px;
		line-height: 32px;
	}

	.section-desc {
		margin-top: 12px;
		font-size: 14px;
		line-height: 22px;
	}

	.feature-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 18px;
	}

	.feature-card,
	.partner-card {
		background: rgba(255, 255, 255, 0.92);
		border: 1px solid rgba(255, 255, 255, 0.94);
		box-shadow: 0 16px 36px rgba(70, 74, 135, 0.08);
	}

	.feature-card {
		padding: 14px 15px;
		border-radius: 14px;
	}

	.feature-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		height: 20px;
		padding: 0 8px;
		border-radius: 999px;
		background: linear-gradient(135deg, #767dff, #55b2ff);
		font-size: 11px;
		font-weight: 700;
		color: #ffffff;
	}

	.feature-card-title {
		margin: 10px 0 0;
		font-size: 16px;
		line-height: 22px;
		font-weight: 700;
		color: #00001c;
	}

	.feature-card-desc {
		margin: 7px 0 0;
		font-size: 13px;
		line-height: 20px;
		font-weight: 400;
		color: #64676e;
	}

	.partner-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		margin-top: 18px;
	}

	.partner-card {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 98px;
		padding: 13px 10px;
		border-radius: 14px;
	}

	.partner-logo {
		width: 100%;
		height: 32px;
		object-fit: contain;
	}

	.kefu-stack {
		position: fixed;
		right: 13px;
		bottom: 84px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		z-index: 80;
		transition: all 0.3s ease;
	}

	.kefu-stack-item {
		width: 80px;
		height: 80px;

		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			object-fit: cover;
		}
	}

	.telegram-item img {
		border: 6px solid #ffffff;
		box-shadow: 0 8px 24px rgba(70, 74, 135, 0.18);
	}

	.kefu-stack-hide {
		transform: translateX(56px);
		opacity: 0.62;
	}
</style>
