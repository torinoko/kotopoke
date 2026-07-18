import { StaticPage } from "@/components/static-page";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL;
const twitterLabel = process.env.NEXT_PUBLIC_TWITTER_LABEL ?? twitterUrl;

export default function ContactPage() {
  return (
    <StaticPage title="おたより" description="ことぽけへのご連絡はこちらへ。">
      <section>
        <h2 className="text-2xl font-medium text-stone-600">連絡先</h2>
        <dl className="mt-5 grid gap-5">
          <div>
            <dt className="text-sm font-medium text-stone-500">
              メールアドレス
            </dt>
            <dd className="mt-1">
              {contactEmail ? (
                  contactEmail
              ) : (
                <span className="text-stone-500">準備中です</span>
              )}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-stone-500">
              Twitter
            </dt>
            <dd className="mt-1">
              {twitterUrl ? (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#5f8f86] underline-offset-4 hover:underline"
                >
                  {twitterLabel}
                </a>
              ) : (
                <span className="text-stone-500">準備中です</span>
              )}
            </dd>
          </div>
        </dl>
      </section>
    </StaticPage>
  );
}
