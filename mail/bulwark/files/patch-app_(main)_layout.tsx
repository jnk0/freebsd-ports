--- app/(main)/layout.tsx.orig
+++ app/(main)/layout.tsx
@@ -1,6 +1,12 @@
 import type { Metadata, Viewport } from "next";
 import { getLocaleDirection } from "@/i18n/direction";
-import { Geist, Geist_Mono, Hanken_Grotesk } from "next/font/google";
+// FreeBSD port: the fonts come from @fontsource-variable packages that are
+// part of the prefetched node modules, as next/font/google downloads them
+// from Google at build time and the ports build has no network access.
+import "@fontsource-variable/geist";
+import "@fontsource-variable/geist-mono";
+import "@fontsource-variable/hanken-grotesk";
+import "../freebsd-fonts.css";
 import { headers } from "next/headers";
 import { getLocale, getTranslations } from "next-intl/server";
 import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
@@ -44,26 +50,11 @@
   return seg ?? (await getLocale());
 }
 
-const geistSans = Geist({
-  variable: "--font-geist-sans",
-  subsets: ["latin"],
-});
-
-const geistMono = Geist_Mono({
-  variable: "--font-geist-mono",
-  subsets: ["latin"],
-});
-
-// The "Flat fields" theme's family. Not preloaded and no metric-adjusted
-// fallback: the file is only fetched once that theme renders text in it, and
-// scripts Hanken does not cover fall through to the theme's system stack.
-const hankenGrotesk = Hanken_Grotesk({
-  variable: "--font-hanken",
-  subsets: ["latin", "latin-ext"],
-  display: "swap",
-  preload: false,
-  adjustFontFallback: false,
-});
+// Classes that set --font-geist-sans, --font-geist-mono and --font-hanken
+// (app/freebsd-fonts.css), like the variable classes of next/font did.
+const geistSans = { variable: "freebsd-font-geist-sans" };
+const geistMono = { variable: "freebsd-font-geist-mono" };
+const hankenGrotesk = { variable: "freebsd-font-hanken" };
 
 // Resolve a branding value for the requesting host: per-domain override first,
 // then the global admin/env/default value (same precedence as app/manifest.ts).
