import { NextResponse } from "next/server";

const API_URL = "https://park.matrix-net.tech/park/v1/parking-spot";

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 如果需要认证，添加 Authorization 头，例如：
        // "Authorization": `Bearer ${process.env.API_KEY}`
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "请求失败" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("请求失败：", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

//https://github.com/vercel/next.js/tree/canary/examples/with-mysql