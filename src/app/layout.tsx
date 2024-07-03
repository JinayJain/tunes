import type { Metadata } from "next";
import "./index.css";
import { DM_Sans } from "next/font/google";

const sansFont = DM_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SoundSketch",
  description:
    "An online modular synthesizer to create and share audio compositions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sansFont.variable}>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
