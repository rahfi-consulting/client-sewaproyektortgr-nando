import Script from "next/script";
import { GOOGLE_TAG_ID, hasGoogleTag } from "@/lib/gtag";

export function GoogleTag() {
  if (!hasGoogleTag()) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GOOGLE_TAG_ID}');`}
      </Script>
    </>
  );
}
