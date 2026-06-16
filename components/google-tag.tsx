import Script from "next/script";
import { GOOGLE_TAG_ID, GOOGLE_TAG_SCRIPT_SRC, hasGoogleTag } from "@/lib/gtag";

export function GoogleTag() {
  if (!hasGoogleTag()) {
    return null;
  }

  return (
    <>
      <Script src={GOOGLE_TAG_SCRIPT_SRC} strategy="afterInteractive" />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GOOGLE_TAG_ID}');`}
      </Script>
    </>
  );
}
