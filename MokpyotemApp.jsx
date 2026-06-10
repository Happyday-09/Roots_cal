import { useState } from "react";

// ─── Design tokens ───────────────────────────────────────────────
const G = { main: "#22C55E", light: "#DCFCE7", mid: "#86EFAC", dark: "#16A34A", text: "#166534" };

// ─── Shared components ───────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", style = {} }) {
  const base = {
    padding: "12px 24px", borderRadius: 10, fontSize: 14,
    fontWeight: 700, cursor: "pointer", border: "none",
    transition: "opacity 0.15s",
  };
  const variants = {
    primary: { background: G.main, color: "#fff" },
    outline: { background: "#fff", color: "#374151", border: "1.5px solid #D1D5DB" },
    ghost: { background: "transparent", color: G.dark, border: "none" },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "28px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.05)", ...style,
    }}>{children}</div>
  );
}

function StepBar({ current }) {
  const steps = ["목표 설정", "지출 업로드", "분석 중", "결과 확인"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: i < current ? G.main : i === current ? G.main : "#E5E7EB",
              color: i <= current ? "#fff" : "#9CA3AF",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
            }}>
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 11, color: i <= current ? G.main : "#9CA3AF", fontWeight: i <= current ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 56, height: 2, background: i < current ? G.main : "#E5E7EB", margin: "0 6px", marginBottom: 20 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────
function Navbar({ page, navigate }) {
  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <button onClick={() => navigate("main")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 20, fontWeight: 800, color: "#111827" }}>
            <span style={{ width: 32, height: 32, background: G.main, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>📈</span>
            목표템
          </button>
          <div style={{ display: "flex", gap: 4 }}>
            {["홈", "서비스 소개", "이용 방법", "고객센터"].map((label) => (
              <button key={label} onClick={() => navigate("main")} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 14, color: label === "홈" && page === "main" ? G.main : "#374151",
                fontWeight: label === "홈" && page === "main" ? 700 : 400,
                padding: "8px 12px",
                borderBottom: label === "홈" && page === "main" ? `2px solid ${G.main}` : "2px solid transparent",
              }}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="outline" style={{ padding: "8px 20px", fontSize: 13 }}>로그인</Btn>
          <Btn onClick={() => navigate("goal")} style={{ padding: "8px 20px", fontSize: 13 }}>회원가입</Btn>
        </div>
      </div>
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
const features = [
  { icon: "🥧", title: "지출 분석", desc: "지출 내역을 분석해\n소비 패턴을 파악해요." },
  { icon: "📅", title: "목표 예측", desc: "목표 금액 달성까지\n걸리는 기간을 알려줘요." },
  { icon: "💡", title: "절약 추천", desc: "지출을 줄일 수 있는\n맞춤 팁을 제공해요." },
  { icon: "📊", title: "시각화", desc: "그래프와 표로 쉽고\n직관적으로 보여줘요." },
];

function MainPage({ navigate }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: "#fff", padding: "0 24px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 64, gap: 48 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 46, fontWeight: 800, color: "#111827", lineHeight: 1.25, margin: "0 0 18px" }}>
              얼마나 모으면<br />
              <span style={{ color: G.main }}>갖고 싶은 걸</span> 살 수 있을까?
            </h1>
            <p style={{ fontSize: 16, color: "#6B7280", lineHeight: 1.8, margin: "0 0 32px" }}>
              지출 내역을 분석해서 목표 달성 기간을 예측하고<br />
              절약 방법을 추천해드려요.
            </p>
            <Btn onClick={() => navigate("goal")} style={{ fontSize: 16, padding: "14px 32px" }}>분석 시작하기 →</Btn>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 340, height: 280 }}>
              <div style={{ width: 210, height: 210, background: G.light, borderRadius: "50%", position: "absolute", top: 35, left: 65, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 88 }}>🐷</div>
              <div style={{ position: "absolute", top: 0, right: 10, width: 110, height: 140, background: "#fff", borderRadius: 16, border: `2px solid ${G.main}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7, boxShadow: "0 4px 24px rgba(34,197,94,0.18)" }}>
                <div style={{ fontSize: 30 }}>📋</div>
                {[60, 50, 55].map((w, i) => (
                  <div key={i} style={{ width: w, height: 6, background: [G.light, "#BBF7D0", G.mid][i], borderRadius: 3 }} />
                ))}
              </div>
              <div style={{ position: "absolute", bottom: 8, right: 36, width: 48, height: 48, background: "#FCD34D", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>₩</div>
              {[{ top: 0, left: 200 }, { top: 130, left: 20 }, { top: 60, left: 320 }].map((pos, i) => (
                <div key={i} style={{ position: "absolute", ...pos, color: G.main, fontSize: [14, 10, 12][i], opacity: 0.7 }}>✦</div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ maxWidth: 1100, margin: "52px auto 0", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 18, padding: "30px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 38, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 10px" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flow */}
      <div style={{ background: "#F9FAFB", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 30, fontWeight: 800, color: "#111827", marginBottom: 52 }}>이렇게 사용해요</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {[
              { icon: "🏠", label: "메인 페이지" },
              { icon: "👤", label: "로그인/회원가입" },
              { icon: "🎯", label: "목표 설정" },
              { icon: "📄", label: "지출 내역 업로드" },
              { icon: "📊", label: "분석 결과" },
              { icon: "👤", label: "마이페이지" },
            ].map((step, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 68, height: 68, background: G.light, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{step.icon}</div>
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: 500, textAlign: "center" }}>{step.label}</span>
                </div>
                {i < arr.length - 1 && <span style={{ fontSize: 20, color: "#9CA3AF", marginBottom: 26 }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ background: G.main, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 14px" }}>지금 바로 목표를 설정해보세요</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", margin: "0 0 32px" }}>지출 내역 파일 하나로 목표 달성 기간을 예측할 수 있어요.</p>
        <button onClick={() => navigate("goal")} style={{ padding: "15px 40px", borderRadius: 12, background: "#fff", color: G.main, fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer" }}>무료로 시작하기</button>
      </div>

      <footer style={{ background: "#111827", padding: "28px 24px", color: "#9CA3AF", fontSize: 13, textAlign: "center" }}>
        © 2024 목표템. All rights reserved.
      </footer>
    </div>
  );
}

// ─── Goal Set Page ────────────────────────────────────────────────
function GoalSetPage({ navigate }) {
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("300,000");
  const [period, setPeriod] = useState("3개월");

  const fmt = (v) => v.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleNext = () => {
    if (!itemName.trim()) return alert("물건 이름을 입력해주세요.");
    navigate("upload", { itemName, amount: parseInt(amount.replace(/,/g, "")) || 300000, period });
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "#F3F4F6", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 24px" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <StepBar current={0} />
        <Card>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 32px" }}>목표하는 물건을 입력해주세요</h2>
          {[
            { label: "물건 이름", type: "text", value: itemName, onChange: (v) => setItemName(v), placeholder: "예) 게이밍 헤드셋" },
          ].map((f) => (
            <div key={f.label} style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box", color: "#111827" }}
                onFocus={(e) => e.target.style.borderColor = G.main}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>
          ))}
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>목표 금액</label>
            <div style={{ position: "relative" }}>
              <input type="text" value={amount} onChange={(e) => setAmount(fmt(e.target.value))}
                style={{ width: "100%", padding: "12px 48px 12px 16px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box", color: "#111827" }}
                onFocus={(e) => e.target.style.borderColor = G.main}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              />
              <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: "#6B7280" }}>원</span>
            </div>
          </div>
          <div style={{ marginBottom: 36 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 8 }}>원하는 기간</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}
              style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 15, outline: "none", background: "#fff", color: "#111827", cursor: "pointer" }}>
              {["1개월", "2개월", "3개월", "4개월", "5개월", "6개월", "12개월"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <Btn onClick={handleNext} style={{ width: "100%", padding: "15px", fontSize: 16 }}>다음</Btn>
        </Card>
      </div>
    </div>
  );
}

// ─── Upload Page ──────────────────────────────────────────────────
function UploadPage({ navigate, goalData }) {
  const [tab, setTab] = useState("file");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => navigate("result", goalData), 2000);
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "#F3F4F6", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 24px" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <StepBar current={1} />
        <Card>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 28px" }}>지출 내역을 입력해주세요</h2>
          <div style={{ display: "flex", marginBottom: 28, border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden" }}>
            {[["file", "파일 업로드"], ["direct", "직접 입력"]].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "12px", background: tab === t ? G.main : "#fff", color: tab === t ? "#fff" : "#374151", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>{label}</button>
            ))}
          </div>

          {tab === "file" ? (
            <div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
                onClick={() => document.getElementById("fi").click()}
                style={{ border: `2px dashed ${file || dragging ? G.main : "#D1D5DB"}`, borderRadius: 14, padding: "52px 24px", textAlign: "center", cursor: "pointer", background: file || dragging ? "#F0FDF4" : "#FAFAFA", transition: "all 0.2s" }}
              >
                <div style={{ fontSize: 42, marginBottom: 12 }}>{file ? "✅" : "📄"}</div>
                {file
                  ? <><p style={{ fontSize: 15, fontWeight: 600, color: G.main, margin: "0 0 4px" }}>{file.name}</p><p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>파일이 선택되었습니다</p></>
                  : <><p style={{ fontSize: 15, color: "#374151", margin: "0 0 6px", fontWeight: 500 }}>파일을 드래그하거나 클릭하여 업로드</p><p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>CSV, 엑셀 파일만 가능</p></>
                }
                <input id="fi" type="file" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }} />
              </div>
              <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10 }}>※ 카드사나 은행에서 다운로드한 내역 파일을 사용해주세요.</p>
            </div>
          ) : (
            <textarea placeholder={"날짜, 금액, 카테고리 형식으로 입력해주세요\n예) 2024-01-01, 12000, 카페"} rows={8}
              style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", color: "#111827", lineHeight: 1.6 }} />
          )}

          {analyzing && (
            <div style={{ textAlign: "center", padding: "16px 0", color: G.main, fontWeight: 700, fontSize: 15 }}>⏳ 분석 중...</div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <Btn onClick={() => navigate("goal")} variant="outline" style={{ flex: 1, padding: "14px" }}>이전</Btn>
            <Btn onClick={handleAnalyze} style={{ flex: 2, padding: "14px", background: analyzing ? G.mid : G.main, cursor: analyzing ? "not-allowed" : "pointer" }}>분석 시작</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Result Page ──────────────────────────────────────────────────
const spending = [
  { label: "식비", pct: 40, color: G.main, amount: 120000 },
  { label: "카페/간식", pct: 20, color: "#86EFAC", amount: 60000 },
  { label: "교통", pct: 15, color: "#FCD34D", amount: 45000 },
  { label: "쇼핑", pct: 15, color: "#F87171", amount: 45000 },
  { label: "기타", pct: 10, color: "#93C5FD", amount: 30000 },
];
const tips = [
  { icon: "🍜", text: "배달비를 월 5만원 줄이면 3개월 내 목표 달성 가능!" },
  { icon: "☕", text: "카페 이용을 주 2회 줄이면 월 2만원 절약 가능!" },
  { icon: "📦", text: "불필요한 구독 서비스를 점검해보세요! 월 1만원 이상 절약 가능!" },
];

function DonutChart() {
  const cx = 80, cy = 80, r = 58;
  let offset = 0;
  const polar = (angle) => {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arc = (startPct, endPct) => {
    const s = polar(startPct * 3.6), e = polar(endPct * 3.6);
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${endPct - startPct > 50 ? 1 : 0} 1 ${e.x} ${e.y}`;
  };
  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {spending.map((s, i) => {
        const start = offset; offset += s.pct;
        return <path key={i} d={arc(start, start + s.pct)} fill="none" stroke={s.color} strokeWidth={22} />;
      })}
      <circle cx={cx} cy={cy} r={46} fill="#fff" />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize={11} fill="#9CA3AF">총 지출</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fontSize={15} fontWeight="700" fill="#111827">30만원</text>
    </svg>
  );
}

function ResultPage({ navigate, goalData }) {
  const goal = goalData || { itemName: "게이밍 헤드셋", amount: 300000, period: "5개월" };
  const saved = Math.round(goal.amount * 0.4);
  const pct = Math.round((saved / goal.amount) * 100);

  return (
    <div style={{ background: "#F3F4F6", minHeight: "calc(100vh - 64px)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <Card style={{ marginBottom: 20, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>📈 목표템</span>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Btn variant="ghost" onClick={() => navigate("main")} style={{ padding: "6px 12px", fontSize: 13 }}>홈</Btn>
            <Btn variant="ghost" onClick={() => navigate("mypage")} style={{ padding: "6px 12px", fontSize: 13, color: G.main, fontWeight: 700 }}>마이페이지</Btn>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
          </div>
        </Card>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Goal Card */}
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>목표 달성 예측</h3>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>목표 금액</span>
              <p style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "4px 0" }}>{goal.amount.toLocaleString()}원</p>
            </div>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>현재 모은 금액</span>
              <p style={{ fontSize: 18, fontWeight: 600, color: "#374151", margin: "4px 0" }}>{saved.toLocaleString()}원 ({pct}%)</p>
            </div>
            <div style={{ height: 10, background: "#E5E7EB", borderRadius: 999, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: G.main, borderRadius: 999, transition: "width 1s ease" }} />
            </div>
            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 20 }}>
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>목표 달성 예상 기간</span>
              <p style={{ fontSize: 52, fontWeight: 900, color: G.main, margin: "4px 0" }}>5개월</p>
              <p style={{ fontSize: 13, color: "#6B7280" }}>현재 소비 패턴으로는 5개월 후 목표를 달성할 수 있어요!</p>
            </div>
          </Card>

          {/* Chart Card */}
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>소비 패턴 (월 평균)</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <DonutChart />
              <div style={{ flex: 1 }}>
                {spending.map((s) => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontSize: 13, color: "#374151" }}>{s.label} {s.pct}%</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>{s.amount.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Tips Card */}
          <Card style={{ gridColumn: "1 / -1" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>AI 절약 추천</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {tips.map((tip, i) => (
                <div key={i} style={{ background: "#F0FDF4", borderRadius: 14, padding: "20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 30 }}>{tip.icon}</span>
                  <p style={{ fontSize: 14, color: G.text, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{tip.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <Btn variant="outline" onClick={() => navigate("goal")} style={{ padding: "13px 28px" }}>새 목표 설정</Btn>
          <Btn onClick={() => navigate("mypage")} style={{ padding: "13px 28px" }}>마이페이지로 →</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── My Page ──────────────────────────────────────────────────────
const menuItems = [
  { icon: "📊", label: "대시보드" },
  { icon: "🎯", label: "목표 관리" },
  { icon: "📄", label: "지출 내역" },
  { icon: "📈", label: "분석 결과" },
  { icon: "⚙️", label: "설정" },
];
const historyData = [
  { date: "2024.06.01 분석", result: "5개월 예상" },
  { date: "2024.05.01 분석", result: "6개월 예상" },
  { date: "2024.04.01 분석", result: "7개월 예상" },
];

function MyPage({ navigate, goalData }) {
  const [activeMenu, setActiveMenu] = useState("목표 관리");
  const goal = goalData || { itemName: "게이밍 헤드셋", amount: 300000, period: "5개월" };

  return (
    <div style={{ background: "#F3F4F6", minHeight: "calc(100vh - 64px)", padding: "36px 24px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "230px 1fr", gap: 24 }}>
        {/* Sidebar */}
        <Card style={{ padding: "28px 16px", height: "fit-content" }}>
          <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #E5E7EB" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: G.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 12px" }}>👤</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>홍길동</p>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0" }}>hong@example.com</p>
          </div>
          {menuItems.map((m) => (
            <button key={m.label} onClick={() => setActiveMenu(m.label)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
              borderRadius: 10, background: activeMenu === m.label ? "#F0FDF4" : "transparent",
              border: "none", cursor: "pointer", color: activeMenu === m.label ? G.dark : "#374151",
              fontSize: 14, fontWeight: activeMenu === m.label ? 700 : 400, marginBottom: 4, textAlign: "left",
            }}><span>{m.icon}</span>{m.label}</button>
          ))}
        </Card>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>나의 목표</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px", background: "#F9FAFB", borderRadius: 14, border: "1px solid #E5E7EB" }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: "#1F2937", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🎧</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>{goal.itemName}</p>
                <p style={{ fontSize: 15, color: "#374151", margin: "0 0 12px" }}>{goal.amount.toLocaleString()}원</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>달성 예상 기간: 5개월</span>
                  <span style={{ fontSize: 12, color: G.main, fontWeight: 700 }}>40%</span>
                </div>
                <div style={{ height: 8, background: "#E5E7EB", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "40%", background: G.main, borderRadius: 999 }} />
                </div>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: "6px 0 0" }}>{Math.round(goal.amount * 0.4).toLocaleString()}원 / {goal.amount.toLocaleString()}원</p>
              </div>
            </div>
            <Btn onClick={() => navigate("goal")} style={{ marginTop: 16, padding: "10px 20px", fontSize: 13 }}>+ 새 목표 추가</Btn>
          </Card>

          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>최근 분석 결과</h3>
            {historyData.map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB", marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: "#374151" }}>{h.date}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>→</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: G.main }}>{h.result}</span>
                </div>
              </div>
            ))}
            <Btn variant="outline" onClick={() => navigate("result")} style={{ width: "100%", padding: "12px", marginTop: 6 }}>전체 보기</Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("main");
  const [goalData, setGoalData] = useState(null);

  const navigate = (p, data) => {
    if (data) setGoalData(data);
    setPage(p);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" }}>
      <Navbar page={page} navigate={navigate} />
      {page === "main" && <MainPage navigate={navigate} />}
      {page === "goal" && <GoalSetPage navigate={navigate} />}
      {page === "upload" && <UploadPage navigate={navigate} goalData={goalData} />}
      {page === "result" && <ResultPage navigate={navigate} goalData={goalData} />}
      {page === "mypage" && <MyPage navigate={navigate} goalData={goalData} />}
    </div>
  );
}
