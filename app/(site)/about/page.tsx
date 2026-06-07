import Image from "next/image";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { CONTACT_ADDRESS, CONTACT_PHONE, SITE_IMAGES, SITE_NAME } from "@/lib/site-config";
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
              Tentang Kami
            </h1>
          </div>

          <div className="space-y-5 text-base leading-7 text-zinc-600 sm:text-lg">
            <p>
              <b>{SITE_NAME}</b> berfokus pada layanan sewa proyektor dan perlengkapan
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

          <div className="grid gap-4 border-zinc-200 bg-zinc-50 p-6 sm:grid-cols-2">
            <div>
              <p className="text-sm tracking-[0.1em] text-zinc-500">
                Phone
              </p>
              <p className="mt-2 font-medium text-zinc-950">{CONTACT_PHONE}</p>
            </div>
            <div>
              <p className="text-sm tracking-[0.1em] text-zinc-500">
                Address
              </p>
              <p className="mt-2 font-medium text-zinc-950">{CONTACT_ADDRESS}</p>
            </div>
            <div>
              <p className="text-sm tracking-[0.1em] text-zinc-500">
                Instagram
              </p>
              <a
                href="https://instagram.com/sewaproyektor.tgr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-zinc-950"
              >
                <FaInstagram className="h-5 w-5" />
                <span className="text-sm font-medium">@sewaproyektor.tgr</span>
              </a>
            </div>
            <div>
              <p className="text-sm tracking-[0.1em] text-zinc-500">
                Tiktok
              </p>
              <a
                href="https://tiktok.com/@sewaproyektor.tgr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-zinc-950"
              >
                <FaTiktok className="h-5 w-5" />
                <span className="text-sm font-medium">@sewaproyektor.tgr</span>
              </a>
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
        </div>

        <div className="overflow-hidden border-zinc-200 bg-zinc-100">
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
