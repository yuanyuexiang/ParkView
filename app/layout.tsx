import { Providers } from "./providers";
import "./globals.css";
import { ConfigProvider } from "antd";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {/* {children} */}
                    <ConfigProvider >
                        <div className="flex min-h-screen">
                        <Sidebar />
                            <div className="flex-1">
                                <Header />
                                <main className="flex-1 pt-1">
                                {children}
                                </main>
                                <Footer />
                            </div>
                        </div>
                    </ConfigProvider>
                </Providers>
            </body>
        </html>
    );
}
