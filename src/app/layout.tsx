import type { Metadata } from "next";
import "reactflow/dist/style.css";
import "./index.css";
import { DM_Sans, DM_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";

const sansFont = DM_Sans({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const monoFont = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "soundsketch",
  description:
    "An online modular synthesizer to create and share audio compositions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={clsx(sansFont.variable, monoFont.variable)}>
      <body>
        <div id="root">
          <Toaster />
          {children}
        </div>
      </body>
    </html>
  );
}
