import Fetch from './fetch';

export function getCountryCodeList(defaultLocale = '') {
	return Fetch('/index/getLanguages').then((r) => {
		const list = r.data.list || [];
		const countryCode = [];
		for (let i = 0; i < list.length; i++) {
			countryCode.push({
				text: list[i]['country_code'],
				value: i,
				counrty: list[i]['country']
			});
		}
		const defaultItem = countryCode.find((c) => c.counrty === defaultLocale);
		const defaultIndex = defaultItem ? defaultItem.value : 0;
		return { list: countryCode, defaultIndex };
	});
}
