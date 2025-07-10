import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { Inter } from "next/font/google"; 
import ToastProvider from "../components/ToastProvider";
import BootstrapClients from '@/components/BootstrapClients';
import { Providers } from './providers';
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable}`}
    >
      <body cz-shortcut-listen="true">
        <ToastProvider />
        <Providers>
          {children}
        </Providers>
        <BootstrapClients />
      </body>
    </html>
  );
}