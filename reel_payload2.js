const payloadJS = `
/* ===== REEL DEMO SECTION STYLES ===== */
.reel-section {
    padding: 24px 20px 40px;
    text-align: center;
    position: relative;
    z-index: 1;
}
.reel-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(20px, 2.2vw, 26px);
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
    margin: 0 0 6px;
}
.reel-subheading {
    color: #888;
    font-size: clamp(12px, 1.1vw, 14px);
    margin: 0 0 18px;
}
.reel-stage {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}
.reel-play-pause {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    background: rgba(0,0,0,0.45);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 999px;
    padding: 8px 12px;
    font-size: 13px;
    cursor: pointer;
    backdrop-filter: blur(12px);
}
.phone-mockup {
    width: min(320px, 82vw);
    border-radius: 28px;
    background: #0b0b18;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 30px 80px rgba(0,0,0,0.45), 0 0 60px rgba(255,107,53,0.08);
    overflow: hidden;
    position: relative;
}
.phone-notch {
    height: 28px;
    background: #000;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.phone-screen {
    height: 520px;
    overflow: hidden;
    position: relative;
}
.reel-track {
    display: flex;
    height: 100%;
    transition: transform 0.55s cubic-bezier(0.23, 1, 0.32, 1);
}
.reel-slide {
    min-width: 100%;
    height: 100%;
    padding: 16px 18px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 14px;
    color: #e8e8e8;
}
.mini-header {
    display: flex;
    align-items: center;
    gap: 10px;
}
.mini-logo {
    font-size: 22px;
}
.mini-title {
    font-weight: 700;
    font-size: 16px;
}
.mini-hero {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.mini-hero p {
    margin: 0;
    font-size: 13px;
    color: #c8c8c8;
}
.mini-badge {
    display: inline-flex;
    align-self: flex-start;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(0,0,0,0.35);
    border: 1px solid rgba(255,255,255,0.08);
    font-size: 11px;
    color: #ffe2cc;
}
.mini-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}
.mini-card {
    aspect-ratio: 3/4;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255,107,53,0.25), rgba(255,107,53,0.05));
    border: 1px solid rgba(255,255,255,0.08);
}
.mini-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.mini-search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #fff;
}
.mini-search-line {
    height: 8px;
    flex: 1;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
}
.mini-results {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.mini-result {
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.07));
    border: 1px solid rgba(255,255,255,0.06);
}
.mini-mandal-header {
    height: 90px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255,107,53,0.35), rgba(255,69,0,0.1));
    border: 1px solid rgba(255,255,255,0.08);
}
.mini-arti-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.mini-arti {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    font-size: 12px;
    color: #ddd;
}
.mini-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #FF6B35;
}
.mini-map {
    height: 180px;
    border-radius: 16px;
    background:
        radial-gradient(circle at 30% 40%, rgba(255,107,53,0.35), transparent 25%),
        linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05));
    border: 1px solid rgba(255,255,255,0.1);
    position: relative;
    overflow: hidden;
}
.mini-map-pin {
    position: absolute;
    top: 42%;
    left: 48%;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #FF6B35;
    box-shadow: 0 0 0 6px rgba(255,107,53,0.25), 0 10px 20px rgba(0,0,0,0.35);
    transform: translate(-50%, -100%);
}
.mini-map-road {
    position: absolute;
    height: 2px;
    background: rgba(255,255,255,0.12);
    left: 12%;
    right: 12%;
}
.mini-map-road:nth-child(2) { top: 64%; }
.mini-map-road:nth-child(3) { top: 28%; transform: rotate(12deg); }
.mini-directions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    font-size: 12px;
}
.mini-dir-icon { color: #FF6B35; font-weight: 600; }
.mini-dir-dist { color: #bbb; }
.reel-theme-header .mini-title { color: #ff8c55; }
.mini-cards-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}
.mini-card-alt {
    aspect-ratio: 4/3;
    background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
    border-color: rgba(255,255,255,0.12);
}
.mini-theme-hint {
    font-size: 11px;
    color: #9a9a9a;
}
.reel-controls {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
}
.reel-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.25);
    cursor: pointer;
}
.reel-dot.is-active {
    background: #FF6B35;
    border-color: #FF6B35;
    transform: scale(1.1);
}
`;

with open(r'c:\Users\daksh\Downloads\GANPATI-MANDAL-LOCATOR-main\reel_payload2.js', 'w', encoding='utf-8') as f:
    f.write(payloadJS)
print('Wrote reel_payload2.js')
