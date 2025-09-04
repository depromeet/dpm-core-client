type Authority = 'DEEPER' | 'ORGANIZER';

const AuthorityLabelMap: Record<Authority, string> = {
	DEEPER: '디퍼',
	ORGANIZER: '운영진',
};

export const formatAuthorityName = (value: string) => {
	if (!value) return '';

	const [generation, authority] = value.split('_') as [string, Authority];

	const generationLabel = `${generation}기`;
	const authorityLabel = AuthorityLabelMap[authority] ?? authority;

	return `${generationLabel} ${authorityLabel}`;
};
