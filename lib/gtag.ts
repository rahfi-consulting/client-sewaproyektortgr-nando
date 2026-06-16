const FALLBACK_GOOGLE_TAG_ID = "AW-18239175991";

export const GOOGLE_TAG_ID =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || FALLBACK_GOOGLE_TAG_ID;

export const GOOGLE_TAG_SCRIPT_SRC =
  `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;

function getGoogleTag() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.gtag;
}

export function hasGoogleTag() {
  return GOOGLE_TAG_ID.length > 0;
}

export function trackGoogleEvent(action: string, params: GoogleTagParams = {}) {
  const gtag = getGoogleTag();

  if (!gtag) {
    return;
  }

  gtag("event", action, params);
}

export function trackGoogleAdsConversion(
  label: string,
  params: GoogleTagParams = {},
) {
  trackGoogleEvent("conversion", {
    send_to: `${GOOGLE_TAG_ID}/${label}`,
    ...params,
  });
}
