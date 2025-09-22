'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { GA_ID } from '../../constants/google-analytics';
import { gaInit } from '../../utils/google-analytics';

export const GAScript = () => {
	const gtagConfigScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `;

	useEffect(() => {
		gaInit();
	}, []);

	return (
		<>
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
			<Script id="google-analytics">{gtagConfigScript}</Script>
		</>
	);
};