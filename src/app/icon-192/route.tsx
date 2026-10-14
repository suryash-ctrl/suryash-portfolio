import { ImageResponse } from "next/og";

export function GET() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0e1a26" }}>
                <span style={{ color: "#4fb3d9", fontSize: 108, fontWeight: 700, fontFamily: "monospace" }}>S</span>
            </div>
        ),
        { width: 192, height: 192 },
    );
}
