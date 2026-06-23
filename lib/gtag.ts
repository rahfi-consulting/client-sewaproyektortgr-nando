type GoogleTagValue = string | number | boolean | null | undefined;
type GoogleTagParams = Record<string, GoogleTagValue>;

const FALLBACK_GOOGLE_TAG_ID = "AW-18239175991";
const FALLBACK_GOOGLE_ADS_CONVERSION_LABEL = "4j86CIC2icAcELf6jvlD";

export const GOOGLE_TAG_ID =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || FALLBACK_GOOGLE_TAG_ID;
export const GOOGLE_ADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL ||
  FALLBACK_GOOGLE_ADS_CONVERSION_LABEL;
export const GOOGLE_TAG_MANAGER_ID =
  process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || "";

function getGoogleTag() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.gtag;
}

export function hasGoogleTagManager() {
  return GOOGLE_TAG_MANAGER_ID.length > 0;
}

export function hasGoogleTag() {
  return GOOGLE_TAG_ID.length > 0;
}

function pushDataLayerEvent(action: string, params: GoogleTagParams = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const dataLayer = window.dataLayer || [];
  window.dataLayer = dataLayer;
  dataLayer.push({ event: action, ...params });
}

export function trackGoogleEvent(action: string, params: GoogleTagParams = {}) {
  const gtag = getGoogleTag();

  if (gtag) {
    gtag("event", action, params);
    return;
  }

  pushDataLayerEvent(action, params);
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
