import Script from 'next/script';

/* Google Tag Manager */
export const GTMProvider = () => {
  return (
    <Script id="gtm-script" strategy="afterInteractive">
      {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://ipamtguesbf.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-TLDW38');
            `}
    </Script>
  );
};
