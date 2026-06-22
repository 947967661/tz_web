const assert = require('assert');
const {
	buildPhoneCodeOptions,
	buildCountryCodeOptions,
	getDefaultCountryCodeValue,
	getCountryCodeTextByValue
} = require('../src/utils/countryCode');

const sourceList = [
	{
		country_code: '+86',
		country: 'zh_cn'
	},
	{
		country_code: '+1',
		country: 'en_us'
	},
	{
		country_code: '+84',
		country: 'vi_vn'
	}
];

const options = buildCountryCodeOptions(sourceList);
const phoneOptions = buildPhoneCodeOptions([
	{
		short: 'US',
		tel: '1'
	},
	{
		short: 'VN',
		tel: '84'
	}
]);

assert.deepStrictEqual(options, [
	{
		text: '+86',
		value: 0,
		counrty: 'zh_cn'
	},
	{
		text: '+1',
		value: 1,
		counrty: 'en_us'
	},
	{
		text: '+84',
		value: 2,
		counrty: 'vi_vn'
	}
]);

assert.deepStrictEqual(phoneOptions, [
	{
		text: '+1',
		value: 0,
		country: 'us',
		tel: '1'
	},
	{
		text: '+84',
		value: 1,
		country: 'vn',
		tel: '84'
	}
]);

assert.strictEqual(getDefaultCountryCodeValue(options, 'EN_US'), 1);
assert.strictEqual(getDefaultCountryCodeValue(phoneOptions, 'en_us'), 0);
assert.strictEqual(getDefaultCountryCodeValue(phoneOptions, 'vi_vn'), 1);
assert.strictEqual(getDefaultCountryCodeValue(options, 'vi_vn'), 2);
assert.strictEqual(getDefaultCountryCodeValue(options, 'missing_locale'), 0);
assert.strictEqual(getCountryCodeTextByValue(options, 2), '+84');
assert.strictEqual(getCountryCodeTextByValue(options, 99), '');

console.log('countryCode utils test passed');
