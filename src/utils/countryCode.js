function normalizeLocale(locale) {
	return String(locale || '').toLowerCase();
}

function normalizeCountryCode(countryCode) {
	return String(countryCode || '').toLowerCase();
}

function getLocaleCountryCode(locale) {
	var normalizedLocale = normalizeLocale(locale);
	var localeCountryMap = {
		en_us: 'us',
		zh_cn: 'cn',
		zh_hk: 'hk',
		vi_vn: 'vn',
		th_th: 'th',
		ja_jp: 'jp',
		ko_kr: 'kr',
		ms_my: 'my',
		pt_pt: 'pt',
		tr_tr: 'tr',
		es_es: 'es',
		de_de: 'de',
		fr_fr: 'fr',
		id_id: 'id'
	};
	return localeCountryMap[normalizedLocale] || normalizedLocale.split('_').pop() || '';
}

function buildCountryCodeOptions(list) {
	var source = Array.isArray(list) ? list : [];
	return source.map(function(item, index) {
		return {
			text: item['country_code'],
			value: index,
			counrty: normalizeLocale(item['country'])
		};
	});
}

function buildPhoneCodeOptions(list) {
	var source = Array.isArray(list) ? list : [];
	return source.map(function(item, index) {
		return {
			text: '+' + item.tel,
			value: index,
			country: normalizeCountryCode(item.short),
			tel: item.tel
		};
	});
}

function getDefaultCountryCodeValue(options, locale) {
	var normalizedLocale = normalizeLocale(locale);
	var normalizedCountryCode = getLocaleCountryCode(locale);
	var matched = (options || []).find(function(option) {
		return option.counrty === normalizedLocale || option.country === normalizedCountryCode;
	});
	return matched ? matched.value : 0;
}

function getCountryCodeTextByValue(options, value) {
	var matched = (options || []).find(function(option) {
		return option.value === value;
	});
	return matched && matched.text ? matched.text : '';
}

module.exports = {
	normalizeLocale,
	getLocaleCountryCode,
	buildPhoneCodeOptions,
	buildCountryCodeOptions,
	getDefaultCountryCodeValue,
	getCountryCodeTextByValue
};
