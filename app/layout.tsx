import type { Metadata } from "next";
import { LayoutProvider } from "@/components/LayoutProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pratik Singh",
  description: "Product designer working with startups and founders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');var r=t==='light'?'light':'dark';document.documentElement.setAttribute('data-theme',r);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();",
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
