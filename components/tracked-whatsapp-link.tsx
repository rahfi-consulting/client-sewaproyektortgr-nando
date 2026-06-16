"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { trackGoogleEvent } from "@/lib/gtag";

type TrackedWhatsAppLinkProps = ComponentPropsWithoutRef<"a"> & {
  source: string;
  productName?: string;
};

export function TrackedWhatsAppLink({
  source,
  productName,
  onClick,
  ...props
}: TrackedWhatsAppLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackGoogleEvent("whatsapp_click", {
      event_category: "engagement",
      event_label: source,
      source,
      product_name: productName,
      destination: props.href,
    });

    onClick?.(event);
  }

  return <a {...props} onClick={handleClick} />;
}
