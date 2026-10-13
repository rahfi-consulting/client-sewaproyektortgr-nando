import Image from "next/image";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import { getSiteSettings, instagramUrl, tiktokUrl } from "@/lib/site-content";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata = {
  title: "Tentang kami",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const whatsapp = buildWhatsAppLink(settings.whatsappNumber, settings.siteName);
  const instagram = instagramUrl(settings.instagram);
  const tiktok = tiktokUrl(settings.tiktok);
  const [opening, ...rest] = settings.aboutBody;

  const contact = [
    { label: "Phone", value: settings.phoneNumber, href: undefined },
    { label: "Address", value: settings.address, href: undefined },
    { label: "Instagram", value: `@${settings.instagram}`, href: instagram },
    { label: "Tiktok", value: `@${settings.tiktok}`, href: tiktok },
  ].filter((item) => item.value && item.value !== "@");

  return (
    <div className="py-16 sm:py-20">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-16">
          <div className="space-y-8">
            <div>
              <span className="text-sm font-semibold text-muted">About Us</span>
              <h1 className="display-1 mt-3">Tentang Kami</h1>
            </div>
            <div className="prose-column space-y-5 text-base leading-7 text-muted sm:text-lg">
              <p>
                <b className="text-ink">{settings.siteName}</b> {opening}
              </p>
              {rest.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {whatsapp ? (
              <TrackedWhatsAppLink
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lamp"
                source="about_page"
              >
                Hubungi via WhatsApp
              </TrackedWhatsAppLink>
            ) : null}
          </div>

          <div className="space-y-8">
            <div className="screen screen-standard">
              <Image
                src={settings.aboutImage}
                alt="Tim menyiapkan perlengkapan acara"
                width={1200}
                height={900}
                className="h-full w-full object-cover opacity-95"
              />
            </div>

            <dl>
              {contact.map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between gap-4 border-t border-rule py-4 last:border-b"
                >
                  <dt className="text-sm text-muted">{item.label}</dt>
                  <dd className="figure text-right font-medium">
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:text-muted"
                      >
                        {item.label === "Instagram" ? <FaInstagram className="h-4 w-4" /> : null}
                        {item.label === "Tiktok" ? <FaTiktok className="h-4 w-4" /> : null}
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
