export function urljoin (base: string,  ...parts: string[]): string {
	if(parts.length == 0 || !parts[0]) {
		return "";
	}
	let toReturn = parts[0];
	if(lastChar(toReturn) == '/') {
		toReturn = toReturn.substring(0, toReturn.length - 2);
	}
	for(let i = 1; i < parts.length; i++) {
		let nextPart = parts[i];
		if(nextPart.charAt(0) != '/') {
			nextPart = '/' + nextPart;
		}
		toReturn += nextPart;
	}
	if(isAbs(toReturn)) {
		return toReturn;
	}
	else {
		if(lastChar(base) == '/') {
			if(toReturn.charAt(0) == '/') {
				return base + toReturn.substr(1);
			}
			else {
				return base + toReturn;
			}
		}
		else {
			if(toReturn.charAt(0) == '/') {
				return base + toReturn;
			}
			else {
				return base + '/' + toReturn;
			}
		}
	}
}
function isAbs(urlStr: string) {
	return urlStr.indexOf('https://') == 0 || urlStr.indexOf('http://') == 0;
}
function lastChar(str: string) {
	return str.charAt(str.length - 1);
}