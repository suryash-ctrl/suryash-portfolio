import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "90px",
                    background: "#0e1a26",
                    fontFamily: "monospace",
                }}
            >
                <span style={{ color: "#4fb3d9", fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>
                    Digital marketing · operations · customer success
                </span>
                <span style={{ color: "#f4f7fa", fontSize: 108, fontWeight: 700, marginTop: 28 }}>Suryash Raj</span>
                <div style={{ display: "flex", marginTop: 48, gap: 18 }}>
                    {["United Parcel Service", "NoBroker Interiors", "Botmatic Solutions"].map((t) => (
                        <span
                            key={t}
                            style={{
                                color: "#9fb3c2",
                                fontSize: 20,
                                border: "1px solid #24384a",
                                borderRadius: 4,
                                padding: "8px 16px",
                            }}
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        ),
        { ...size },
    );
}
