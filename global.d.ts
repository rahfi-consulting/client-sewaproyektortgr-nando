type GoogleTagValue = string | number | boolean | null | undefined;

type GoogleTagParams = Record<string, GoogleTagValue>;

type GoogleTagCommand =
  | ["js", Date]
  | ["config", string, GoogleTagParams?]
  | ["event", string, GoogleTagParams?];

type GoogleTagFunction = (...args: GoogleTagCommand) => void;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: GoogleTagFunction;
  }
}

export {};
