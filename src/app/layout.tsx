import type { Metadata } from "next";
import { Manrope } from "next/font/google"; // import font
import "./globals.css";
import ConvexClientProvider from "../components/providers/ConvexClientProvider";
import { AudioProvider } from "@/components/providers/AudioProvider";
import AudioPlayer from "@/components/AudioPlayer";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcastr",
  description: "Generate your podcasts using AI",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <ConvexClientProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </ConvexClientProvider>
        <AudioPlayer />
      </body>
    </html>
  );
}
