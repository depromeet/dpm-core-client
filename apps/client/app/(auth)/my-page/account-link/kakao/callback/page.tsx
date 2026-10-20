import { AccountLinkCallback } from '../../../_components/account-link-callback';

interface KakaoAccountLinkCallbackPageProps {
	searchParams: Promise<{ code?: string; state?: string; error?: string }>;
}

export default async function KakaoAccountLinkCallbackPage({
	searchParams,
}: KakaoAccountLinkCallbackPageProps) {
	const { code, state, error } = await searchParams;

	return <AccountLinkCallback provider="KAKAO" code={code} state={state} providerError={error} />;
}
