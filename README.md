[![Website](https://img.shields.io/badge/Website-sewaproyektortgr.com-111111?)](https://sewaproyektortgr.com)
[![Instagram](https://img.shields.io/badge/Instagram-%40sewaproyektor.tgr-E4405F?&logo=instagram&logoColor=white)](https://instagram.com/sewaproyektor.tgr)
[![TikTok](https://img.shields.io/badge/TikTok-%40sewaproyektor.tgr-000000?&logo=tiktok&logoColor=white)](https://tiktok.com/@sewaproyektor.tgr)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Sanity](https://img.shields.io/badge/Sanity-6.18.0-F03E2F?logo=sanity&logoColor=white)](https://sanity.io)
[![Swiper](https://img.shields.io/badge/Swiper-12.2.0-6B83E8?logo=swiper&logoColor=white)](https://swiperjs.com)

<div align=center>
    <img src="public/light-logo.png" width=250 height=250>
    <h3>@sewaproyektor.tgr Website Portfolio</h3>
</div>

### Overview

<p align=justify>
    <code>SEWAPROYEKTOR.TGR</code> is a marketing and product catalog website for projector rental services in Tangerang. The site presents company information and a live product catalog. Everything on it, from the logo and the photographs to the phone number and the product list, is edited in Sanity Studio at <code>/studio</code>, so the business can change its own content without a deploy.
</p>

### Website Scope

- Public pages: home, products, and about.
- Content, images and contact details are loaded from Sanity.
- Editing happens at `/studio`, signed in with the Google account the Sanity project is shared with.
- WhatsApp is used as the primary contact and conversion channel.
- One branch: `main`. There is no staging or development branch.

### What Editors Can Change

Everything below is edited in Studio and takes effect within a minute, with no deploy.

| Document | Controls |
| :- | :- |
| Site Settings | Both logos, the home and About photographs, business name, tagline, description, selling points, About copy, WhatsApp number, phone number, e-mail, location, Instagram and TikTok handles |
| Products | Name, photo, price, description, category, featured on the home page, available, order |

The logo has two versions: a dark one for the white header and a light one for the black footer. The Studio uses the same two files and switches between them with its own light and dark mode. The browser tab icon is the dark logo.

### Environment Variables

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id   # from sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET=production                  # dataset name
NEXT_PUBLIC_GOOGLE_TAG_ID=your-google-tag-id           # Google Ads conversion tracking ID
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=your-google-tag-manager-id # Google Tag Manager ID
SANITY_WRITE_TOKEN=your-sanity-write-token             # import script only, never deployed
```

The two `NEXT_PUBLIC_SANITY_` values are public by design: the dataset is readable without a key, which is what lets the catalogue render. Writing requires a Sanity login. `SANITY_WRITE_TOKEN` is only used by the import script on a developer machine and does not belong in the hosting environment.

### Setting Up Sanity

```bash
npm install
npx sanity login          # choose Google, with the account that owns the project
npx sanity init --project-plan free   # creates the project, or reuse an existing one
```

Put the project id and dataset in `.env`, then register the browser origins that may read the project, or the Studio fails with a CORS error:

```bash
npx sanity cors add http://localhost:3000 --credentials
npx sanity cors add https://sewaproyektortgr.com --credentials
```

### Moving The Old Catalogue In

The catalogue used to live in Supabase, with product photographs hosted on Cloudinary and a few stock libraries. Two scripts move it across. Both report before they write.

```bash
npm run export:supabase   # writes export/products.json and downloads every image
npm run import:sanity     # reports what it would create
APPLY=1 npm run import:sanity   # uploads the images and creates the documents
```

`export/` is ignored by git: it holds a copy of the catalogue and its images, not source.

The import creates a Site Settings document from the values the site used to carry in code and in the environment, including the WhatsApp and phone numbers. It never overwrites a document that already exists, so running it twice is safe.

Once the content is in Sanity and the site is deployed from it, the Supabase project can be paused and deleted from the Supabase dashboard, and the Cloudinary assets are no longer referenced by anything.

### Local Development

```bash
npm run dev     # http://localhost:3000, Studio at /studio
npm run build   # production build, the closest check before deploying
npx eslint .    # lint
```

Use `npm.cmd` in PowerShell if `npm` is blocked by the local execution policy.

### Deployment Notes

- The project is deployed on Vercel.
- Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` and the two Google tag ids in the Vercel project before deploying.
- A successful local build is the closest validation for the Vercel build pipeline.
- The site is static: pages are prerendered and re-read content from Sanity on a one minute interval, so an edit in Studio appears without a redeploy.

### Security Notes

- The only credential in the project is `SANITY_WRITE_TOKEN`, used by the import script on a developer machine. The site itself ships no key.
- `.env` and every variant of it are gitignored; `.env.example` holds placeholders only.
- Content security policies are set in `next.config.ts`: a strict one for the public site, and a separate one for `/studio`, which is Sanity's own application and talks to their hosts.
- Every image address rendered by the site is checked to be an https URL on Sanity's CDN before it reaches an `src`.
