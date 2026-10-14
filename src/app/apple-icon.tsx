import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0e1a26",
                }}
            >
                <span style={{ color: "#4fb3d9", fontSize: 104, fontWeight: 700, fontFamily: "monospace" }}>S</span>
            </div>
        ),
        { ...size },
    );
}
