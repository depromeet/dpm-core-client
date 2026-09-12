const stages = ['development', 'production'] as const;
type Stage = (typeof stages)[number];

const getStage = (): Stage => {
	const stage = process.env.NEXT_PUBLIC_STAGE as Stage | undefined;
	if (!stage) {
		throw new Error('NEXT_PUBLIC_STAGE is not set');
	}

	if (!stages.includes(stage)) {
		throw new Error(`Invalid stage: ${stage}. Must be one of: ${stages.join(', ')}`);
	}

	return stage;
};

export const IS_PROD = getStage() === 'production';

export const getApiBaseUrl = (): string => {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	if (!baseUrl) {
		throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
	}

	return baseUrl;
};
