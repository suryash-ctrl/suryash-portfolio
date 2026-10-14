import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
                    borderRadius: 14,
                }}
            >
                <span style={{ color: "#4fb3d9", fontSize: 38, fontWeight: 700, fontFamily: "monospace" }}>S</span>
            </div>
        ),
        { ...size },
    );
}
