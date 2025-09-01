'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { initGA } from '../utils/analytics';

const GA_ID = 'G-NX5RGT9VXM';

export const AnalyticScript = () => {
	const gtagConfigScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `;

	useEffect(() => {
		initGA();
	}, []);

	return (
		<>
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
			<Script id="google-analytics">{gtagConfigScript}</Script>
		</>
	);
};