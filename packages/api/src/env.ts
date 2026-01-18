type Stage = 'development' | 'production';

const getStage = (): Stage => {
	const stage = process.env.NEXT_PUBLIC_STAGE;
	if (stage === 'production') return 'production';

	return 'development';
};

export const isProduction = () => getStage() === 'production';

export const getApiBaseUrl = (): string => {
	if (isProduction()) {
		return 'https://api.depromeet.com';
	}
	return 'https://api.depromeet.shop';
};
