import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WorkflowProvider } from "@/contexts/workflow-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Staffing Workflow",
  description: "Resume scoring and profile management workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <WorkflowProvider>{children}</WorkflowProvider>
      </body>
    </html>
  );
}
