import Image from "next/image";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { TrackedWhatsAppLink } from "@/components/tracked-whatsapp-link";
import { getSiteSettings, instagramUrl, tiktokUrl } from "@/lib/site-content";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const whatsapp = buildWhatsAppLink(settings.whatsappNumber, settings.siteName);
  const instagram = instagramUrl(settings.instagram);
  const tiktok = tiktokUrl(settings.tiktok);
  const [opening, ...rest] = settings.aboutBody;

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
              About Us
            </span>
            <h1 className="mt-3 text-4xl font-semibold text-zinc-950 sm:text-5xl">
              Tentang Kami
            </h1>
          </div>

          <div className="space-y-5 text-base leading-7 text-zinc-600 sm:text-lg">
            {/* The opening paragraph carries the business name, so it is set in
                bold ahead of the copy written in Studio. */}
            <p>
              <b>{settings.siteName}</b> {opening}
            </p>
            {rest.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="grid gap-4 border-zinc-200 bg-zinc-50 p-6 sm:grid-cols-2">
            {settings.phoneNumber ? (
              <div>
                <p className="text-sm tracking-[0.1em] text-zinc-500">
                  Phone
                </p>
                <p className="mt-2 font-medium text-zinc-950">{settings.phoneNumber}</p>
              </div>
            ) : null}
            {settings.address ? (
              <div>
                <p className="text-sm tracking-[0.1em] text-zinc-500">
                  Address
                </p>
                <p className="mt-2 font-medium text-zinc-950">{settings.address}</p>
              </div>
            ) : null}
            {instagram ? (
              <div>
                <p className="text-sm tracking-[0.1em] text-zinc-500">
                  Instagram
                </p>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-zinc-950"
                >
                  <FaInstagram className="h-5 w-5" />
                  <span className="text-sm font-medium">@{settings.instagram}</span>
                </a>
              </div>
            ) : null}
            {tiktok ? (
              <div>
                <p className="text-sm tracking-[0.1em] text-zinc-500">
                  Tiktok
                </p>
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-zinc-950"
                >
                  <FaTiktok className="h-5 w-5" />
                  <span className="text-sm font-medium">@{settings.tiktok}</span>
                </a>
              </div>
            ) : null}
          </div>

          {whatsapp ? (
            <TrackedWhatsAppLink
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="button-dark"
              source="about_page"
            >
              Hubungi via WhatsApp
            </TrackedWhatsAppLink>
          ) : null}
        </div>

        <div className="overflow-hidden border-zinc-200 bg-zinc-100">
          <Image
            src={settings.aboutImage}
            alt="Team discussion and planning session"
            width={1200}
            height={900}
            className="h-[340px] w-full object-cover sm:h-[420px] lg:h-[560px]"
          />
        </div>
      </div>
    </div>
  );
}
