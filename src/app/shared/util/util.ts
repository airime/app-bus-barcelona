
export type Nullable<T> = T | null;

export function isNull<T>(value: T | null | undefined): boolean {
  return value === undefined || value === null;
}

export function isNullOrEmpty(value: string | undefined | null): boolean {
  return value === undefined || value === null || value == "" || value.trim() == "";
}

export function removeSpacesAlsoNonbreakables(s: string): string {
	return s.replace(/[\x08-\x14\x20]+/g,'');
}

//==== COMPTE! =====================================================
//- Aquesta funció no es pot modificar
//  es fa servir per a la verificació del DisplayName dels usuaris
//==================================================================
export const plainLowerCaseString = (str: string) => {
	const removeAccents = (str: string) => {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	}
	const removeWhitespaces = (str: string) => {
		return str.replace(/\s+/g, '');
	}
	const removeSymbolsAndNumbers = (str: string) => {
		return str.replace(/(\d|[^a-zA-Z])+/g, '');
	}
	if (str) return removeSymbolsAndNumbers(removeWhitespaces(removeAccents(str))).toLowerCase();
	else return "";
}

//export const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\\-\x22\x26\/\(\)'¡¿·!@#~$%=?¿ _:;+*.,]).{8,24}/;

export function emptyImg(): string {
  return "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
}
