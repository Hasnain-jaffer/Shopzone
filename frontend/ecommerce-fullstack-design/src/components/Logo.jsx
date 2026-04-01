const Logo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

    {/* Icon */}
    <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
      <defs>
        <linearGradient id="bagG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        <linearGradient id="handleG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c6fff" />
          <stop offset="100%" stopColor="#5a3fa0" />
        </linearGradient>
      </defs>
      {/* Bag body */}
      <rect x="4" y="18" width="44" height="30" rx="9" fill="url(#bagG)" />
      {/* Handle - perfectly sits on top of bag */}
      <path
        d="M16 18 Q16 5 26 5 Q36 5 36 18"
        fill="none"
        stroke="url(#handleG)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Shine */}
      <rect x="10" y="24" width="12" height="4" rx="2" fill="white" fillOpacity="0.3" />
      {/* Detail lines */}
      <line x1="10" y1="34" x2="42" y2="34" stroke="white" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="10" y1="40" x2="32" y2="40" stroke="white" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
    </svg>

    {/* Text */}
    <div style={{ display: "flex", flexDirection: "column", gap: "3px", lineHeight: 1 }}>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 900,
          fontSize: "34px",
          letterSpacing: "-1.5px",
          color: "#0f0c29",
        }}>Shop</span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 900,
          fontSize: "34px",
          letterSpacing: "-1.5px",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>Zone</span>
      </div>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: "9px",
        letterSpacing: "4px",
        color: "#667eea",
        textTransform: "uppercase",
        opacity: 0.75,
      }}>Premium eCommerce</span>
    </div>

  </div>
);

export default Logo;