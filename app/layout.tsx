import { Providers } from "./providers";
import "./globals.css";
import { ConfigProvider } from "antd";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col">
                <Providers>
                    {/* {children} */}
                    <ConfigProvider locale={locale}>
                        <div className="flex flex-1 min-h-screen">
                        <Sidebar />
                            <div className="flex flex-col flex-1">
                                <Header />
                                    <main className="flex-1 pt-1">
                                        {children}
                                    </main>
                                <Footer/>
                            </div>
                        </div>
                    </ConfigProvider>
                </Providers>
            </body>
        </html>
    );
}
