import Image from "next/image";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, SITE_IMAGES, SITE_NAME } from "@/lib/site-config";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function AboutPage() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
              About Us
            </span>
            <h1 className="mt-3 text-4xl font-semibold text-zinc-950 sm:text-5xl">
              About Us
            </h1>
          </div>

          <div className="space-y-5 text-base leading-7 text-zinc-600 sm:text-lg">
            <p>
              {SITE_NAME} berfokus pada layanan sewa proyektor dan perlengkapan
              event yang rapi, cepat, dan mudah dikoordinasikan. Kami melayani
              kebutuhan presentasi kantor, seminar, nobar, ibadah, hingga event
              komunitas di area Tangerang dan sekitarnya.
            </p>
            <p>
              Misi kami sederhana: membantu klien menjalankan acara tanpa hambatan
              teknis. Itu berarti harga jelas, pilihan perlengkapan relevan,
              komunikasi responsif, dan setup yang stabil sejak awal.
            </p>
            <p>
              Kami menjaga setiap penyewaan tetap praktis, dari konsultasi alat,
              pengantaran, hingga pengambilan kembali setelah acara selesai.
            </p>
          </div>

          <div className="grid gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-6 sm:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                Email
              </p>
              <p className="mt-2 font-medium text-zinc-950">{CONTACT_EMAIL}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                Phone
              </p>
              <p className="mt-2 font-medium text-zinc-950">{CONTACT_PHONE}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
                Address
              </p>
              <p className="mt-2 font-medium text-zinc-950">{CONTACT_ADDRESS}</p>
            </div>
          </div>

          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="button-dark"
          >
            Hubungi via WhatsApp
          </a>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Follow Us
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-950 hover:text-zinc-950"
              >
                <FaInstagram className="h-6 w-6" />
                <span>Instagram</span>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-950 hover:text-zinc-950"
              >
                <FaTiktok className="h-6 w-6" />
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
          <Image
            src={SITE_IMAGES.about}
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
