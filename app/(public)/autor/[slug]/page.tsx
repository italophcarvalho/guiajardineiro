import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { authors, getAuthorBySlug, getPostsByAuthor } from "@/lib/mock-data";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AuthorPostFilter } from "@/components/author/AuthorPostFilter";

const SITE_URL = "https://www.guiajardineiro.com.br";

/* ------------------------------------------------------------------ */
/* Static generation                                                   */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

/* ------------------------------------------------------------------ */
/* Metadata                                                            */
/* ------------------------------------------------------------------ */

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const author = getAuthorBySlug(params.slug);
  if (!author) return {};

  return {
    title: `${author.name} — Guia Jardineiro`,
    description: author.bio,
    alternates: { canonical: `${SITE_URL}/autor/${author.slug}` },
    openGraph: {
      title: `${author.name} — Guia Jardineiro`,
      description: author.bio,
      type: "profile",
      locale: "pt_BR",
      siteName: "Guia Jardineiro",
    },
  };
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AutorPage({ params }: { params: { slug: string } }) {
  const author = getAuthorBySlug(params.slug);
  if (!author) notFound();

  const authorPosts = getPostsByAuthor(author.id);

  return (
    <div>
      {/* ============================================================
          PROFILE HEADER
          ============================================================ */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-container px-6 py-10">
          <Breadcrumb items={[{ label: author.name }]} />

          <div className="mt-7 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div
              className="flex h-[80px] w-[80px] flex-none items-center justify-center rounded-full text-[32px] text-white"
              style={{ background: "linear-gradient(135deg,#2D6A4F,#40916C)" }}
            >
              <span className="font-lora font-bold">{author.initial}</span>
            </div>

            {/* Name + role + social */}
            <div className="flex-1">
              <div className="text-[12px] font-bold uppercase tracking-[0.06em] text-terracotta">
                {author.role}
              </div>
              <h1 className="mt-0.5 font-lora text-[32px] font-bold leading-tight tracking-[-0.01em] text-green-900">
                {author.name}
              </h1>

              {/* Social links */}
              {author.social && Object.keys(author.social).length > 0 && (
                <div className="mt-2.5 flex items-center gap-3">
                  {author.social.twitter && (
                    <SocialLink
                      href={author.social.twitter}
                      label="Twitter / X"
                      icon={<XIcon />}
                    />
                  )}
                  {author.social.instagram && (
                    <SocialLink
                      href={author.social.instagram}
                      label="Instagram"
                      icon={<InstagramIcon />}
                    />
                  )}
                  {author.social.linkedin && (
                    <SocialLink
                      href={author.social.linkedin}
                      label="LinkedIn"
                      icon={<LinkedInIcon />}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <p className="mt-6 max-w-[62ch] font-inter text-[17px] leading-[1.75] text-body-2">
            {author.bio}
          </p>

          {/* Specialty chips */}
          {author.specialties.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {author.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-pill bg-green-tint px-3 py-1.5 font-inter text-[13px] font-semibold text-green-700"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Post count */}
          <p className="mt-4 text-[13.5px] font-semibold text-muted">
            {authorPosts.length} artigo{authorPosts.length !== 1 && "s"} publicado{authorPosts.length !== 1 && "s"}
          </p>
        </div>
      </header>

      {/* ============================================================
          POSTS GRID (with filter)
          ============================================================ */}
      <div className="mx-auto max-w-container px-6 py-10">
        <h2 className="mb-7 font-lora text-[24px] font-bold tracking-[-0.01em] text-green-900">
          Artigos de {author.firstName}
        </h2>

        <AuthorPostFilter posts={authorPosts} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Local components                                                    */
/* ------------------------------------------------------------------ */

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-green-700/50 hover:text-green-700"
    >
      {icon}
    </a>
  );
}

/* ---- Social icons ------------------------------------------------- */

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
