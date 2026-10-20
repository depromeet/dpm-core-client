import { AccountLinkCallback } from '../../../_components/account-link-callback';

interface AppleAccountLinkCompletePageProps {
	searchParams: Promise<{ code?: string; state?: string; error?: string }>;
}

export default async function AppleAccountLinkCompletePage({
	searchParams,
}: AppleAccountLinkCompletePageProps) {
	const { code, state, error } = await searchParams;

	return <AccountLinkCallback provider="APPLE" code={code} state={state} providerError={error} />;
}
