import Fetch from './fetch';

export function getCountryCodeList(defaultCode = '+234') {
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
		const hasDefault = countryCode.some((c) => c.text === defaultCode);
		if (!hasDefault) {
			countryCode.push({
				text: defaultCode,
				value: countryCode.length,
				counrty: 'en_ng'
			});
		}
		const defaultItem = countryCode.find((c) => c.text === defaultCode);
		const defaultIndex = defaultItem ? defaultItem.value : 0;
		return { list: countryCode, defaultIndex };
	});
}
