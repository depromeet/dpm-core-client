export const validateHHMM = (value: string) => {
	return /^([0-1][0-9]|2[0-3])[0-5][0-9]$/.test(value);
};
