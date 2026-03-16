import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chấm Cơm Cơ Quan",
  description: "Ứng dụng chấm cơm hàng ngày cho nhân viên",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
