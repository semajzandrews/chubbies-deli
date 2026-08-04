import { site } from "@/app/lib/site";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-tile pt-14 pb-10 border-t-4 border-tomato">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 text-center">
        <div className="font-display text-5xl uppercase text-tomato">CHUBBIES</div>
        <div className="font-chalk text-2xl text-mustard">— the deli on Central —</div>
        <p className="mt-5 max-w-sm mx-auto text-tile/70 italic">
          Heroes, breakfast sandwiches, hot platters. Open six to six,
          Monday through Saturday. Closed Sundays — go to church.
        </p>
        <div className="mt-7">
          <a href={site.phoneHref} className="font-display text-3xl uppercase text-mustard transition-colors hover:text-tomato">
            {site.phone}
          </a>
          <div className="mt-1 font-chalk text-2xl text-tile/70">
            or <a href={site.smsHref} className="text-mustard underline-offset-4 hover:underline">text your order</a>
          </div>
        </div>
        <div className="mt-10 font-display text-[10px] uppercase tracking-[0.32em] text-tile/50">
          © {new Date().getFullYear()} · Chubbies Deli · Central Ave · Orange, NJ · <a href="https://bysemaj.com" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline transition-opacity hover:opacity-80">built · bysemaj.com</a>
        </div>
      </div>
    </footer>
  );
}
