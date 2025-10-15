import { GA_ID } from '../../constants/google-analytics';

export const getGAScriptSrc = () => `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

export const getGAConfigScript = () => `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
`;
