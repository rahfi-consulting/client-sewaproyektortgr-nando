import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

/**
 * The public site: it loads its own code, Google's tags, and images from
 * Sanity's CDN. Nothing else may run or be embedded.
 */
const sitePolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net`,
  "style-src 'self' 'unsafe-inline'",
  // Sanity serves the photographs; the rest of the https allowance is for the
  // Google Ads and Analytics measurement pixels, which are served from a
  // different Google domain per country and cannot be listed one by one.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "frame-src 'self' https://www.googletagmanager.com https://bid.g.doubleclick.net",
  "connect-src 'self' https://cdn.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://www.googleadservices.com https://www.google.com https://ad.doubleclick.net https://googleads.g.doubleclick.net",
  "upgrade-insecure-requests",
].join("; ");

/**
 * The Studio is Sanity's own application and talks to a long list of their
 * hosts, plus Google for the sign-in avatar, so it gets a policy of its own
 * rather than being squeezed into the site's. The framing, object and base
 * rules stay as strict as the site's.
 */
const studioPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' https://*.sanity.io",
  "frame-ancestors 'none'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://*.sanity.io https://*.sanity-cdn.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://*.sanity.io",
  "frame-src 'self' https://*.sanity.io",
  "worker-src 'self' blob:",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.sanity-cdn.com https://*.googleapis.com",
  "upgrade-insecure-requests",
].join("; ");

const sharedHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  },
  ...(isDevelopment
    ? []
    : [
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      },
    ]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Everything except the Studio, which the rule below covers.
        source: "/((?!studio).*)",
        headers: [
          { key: "Content-Security-Policy", value: sitePolicy },
          ...sharedHeaders,
        ],
      },
      {
        source: "/studio/:path*",
        headers: [
          { key: "Content-Security-Policy", value: studioPolicy },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          ...sharedHeaders,
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
