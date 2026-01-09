import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import "@/styles/home.css";

import { Inter, Poppins } from "next/font/google";
import ToastProvider from "../components/ToastProvider";
import BootstrapClients from '@/components/BootstrapClients';
import { Providers } from './providers';
import ReduxProvider from "@/utils/redux-provider"; // ✅ ADD THIS
import NextTopLoader from 'nextjs-toploader';
import SmoothScrollProvider from '@/components/animations/SmoothScrollProvider';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
    >
      <body cz-shortcut-listen="true">
        <NextTopLoader showSpinner={false} color="#C11111" speed={500} height={2} />
          <ReduxProvider> {/* ✅ REDUX WRAP */}
            <ToastProvider />
            <Providers>
              {children}
            </Providers>
            <BootstrapClients />
          </ReduxProvider>
      </body>
    </html>
  );
}
