import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";

const FPS = 30;
const DURATION = 900; // First 30 seconds only.
const W = 1080;
const H = 1920;

const LYRICS = [
  "सफेद साड़ी, माथे पे चंदन",
  "आंखों में शांति, चाल में बंधन",
  "स्टेज पे उतरी रोशनी ठहर गई",
  "घुंघरू बजे, मेरी हार्टबीट बढ़ गई",
  "हाथों की मुद्रा बोले पुरानी कथा",
  "हर भाव में छुपा कोई देव प्रथा",
  "मैं माइक पकड़े मॉडर्न सा लड़का",
  "पर तेरे आगे मेरा स्वैग भी झुकता",
] as const;

const weightOf = (text: string) => Math.max(20, text.replace(/\s/g, "").length);
const totalWeight = LYRICS.reduce((sum, text) => sum + weightOf(text), 0);
const durations = LYRICS.map((text) =>
  Math.round((weightOf(text) / totalWeight) * DURATION),
);
durations[durations.length - 1] +=
  DURATION - durations.reduce((sum, value) => sum + value, 0);

const starts = durations.reduce<number[]>((acc, duration, index) => {
  acc.push(index === 0 ? 0 : acc[index - 1] + durations[index - 1]);
  return acc;
}, []);

const clamp = (value: number) => Math.max(0, Math.min(1, value));

type Palette = {
  paper: string;
  pink: string;
  hotPink: string;
  ink: string;
  blush: string;
  shadow: string;
};

const P: Palette = {
  paper: "#fffaf8",
  pink: "#f7a8be",
  hotPink: "#df2f67",
  ink: "#57253a",
  blush: "#fde0e7",
  shadow: "#8a4961",
};

function Paper() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(223,47,103,.07) 0 1px, transparent 1.5px), radial-gradient(circle at 80% 70%, rgba(87,37,58,.06) 0 1px, transparent 1.4px)",
          backgroundSize: "13px 13px, 19px 19px",
          mixBlendMode: "multiply",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 35,
          border: "2px solid rgba(223,47,103,.18)",
          borderRadius: 28,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function DecorativeBirds() {
  return (
    <svg
      viewBox="0 0 1080 900"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "55%" }}
    >
      <g fill="none" stroke={P.shadow} strokeWidth="4" strokeLinecap="round" opacity=".42">
        <path d="M125 290 q24 -24 48 0 q24 -24 48 0" />
        <path d="M790 250 q18 -20 36 0 q18 -20 36 0" />
        <path d="M910 410 q15 -16 30 0 q15 -16 30 0" />
        <path d="M170 520 q18 -20 36 0 q18 -20 36 0" />
      </g>
    </svg>
  );
}

function Mountains({frame}: {frame: number}) {
  const drift = Math.sin(frame / 90) * 10;
  return (
    <svg
      viewBox="0 0 1080 760"
      style={{
        position: "absolute",
        left: -40,
        bottom: 170,
        width: "115%",
        height: 760,
        transform: `translateX(${drift}px)`,
      }}
    >
      <defs>
        <linearGradient id="mountainWash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9cfda" stopOpacity=".78" />
          <stop offset="100%" stopColor="#fbe9ed" stopOpacity=".1" />
        </linearGradient>
      </defs>
      <path
        d="M0 600 L165 360 L255 470 L395 230 L520 430 L650 285 L790 470 L905 330 L1080 560 V760 H0Z"
        fill="url(#mountainWash)"
      />
      <g fill="none" stroke={P.shadow} strokeWidth="4" opacity=".3">
        <path d="M0 600 L165 360 L255 470 L395 230 L520 430 L650 285 L790 470 L905 330 L1080 560" />
        <path d="M70 650 Q300 520 520 650 T1050 620" />
        <path d="M120 600 Q300 500 410 585 M650 565 Q760 485 890 560" />
        <path d="M210 460 l55 70 l58 -78 M392 322 l64 108 l60 -86 M650 380 l55 92 l44 -72" />
      </g>
    </svg>
  );
}

function Petals({frame, count = 24}: {frame: number; count?: number}) {
  return (
    <svg
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {Array.from({length: count}).map((_, i) => {
        const x = (i * 137) % 1080;
        const seed = (i * 211) % 1900;
        const y = ((seed + frame * (0.8 + (i % 4) * 0.16)) % 2000) - 40;
        const sway = Math.sin(frame / (17 + (i % 5) * 7) + i) * 30;
        const rotate = Math.sin(frame / 25 + i) * 35;
        return (
          <path
            key={i}
            d="M0 0 C10 -19 31 -24 43 0 C30 22 11 20 0 0Z"
            transform={`translate(${x + sway} ${y}) rotate(${rotate})`}
            fill={i % 3 === 0 ? P.hotPink : P.pink}
            opacity={0.22 + (i % 4) * 0.08}
          />
        );
      })}
    </svg>
  );
}

function HeroWoman({frame}: {frame: number}) {
  const hair = Math.sin(frame / 26) * 7;
  const faceY = Math.sin(frame / 55) * 3;
  return (
    <svg
      viewBox="0 0 720 1220"
      style={{
        position: "absolute",
        width: 790,
        height: 1330,
        right: -125,
        top: 290,
        overflow: "visible",
        transform: "rotate(-1deg)",
      }}
    >
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff1ee" />
          <stop offset="100%" stopColor="#f4d0cc" />
        </linearGradient>
        <linearGradient id="saree" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fffdfb" />
          <stop offset="100%" stopColor="#f5dce2" />
        </linearGradient>
      </defs>

      <g transform={`translate(0 ${faceY})`}>
        <path
          d="M105 515 Q25 170 265 55 Q515 -55 650 245 Q684 405 614 620 Q570 860 404 1015 Q170 950 105 690Z"
          fill="#6a2d49"
          opacity=".96"
        />
        <path
          d={`M150 550 Q90 335 230 170 Q370 20 510 160 Q590 245 555 490 Q520 650 386 720 Q230 700 150 550Z`}
          fill="url(#skin)"
          stroke={P.ink}
          strokeWidth="5"
        />
        <path
          d="M150 330 Q240 145 505 205 Q435 130 325 138 Q210 142 145 260Z"
          fill="#53243a"
        />
        <path d="M212 400 Q255 370 302 400" fill="none" stroke={P.ink} strokeWidth="10" strokeLinecap="round" />
        <path d="M365 397 Q410 368 457 400" fill="none" stroke={P.ink} strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="265" cy="418" rx="24" ry="12" fill="#3c1b2b" />
        <ellipse cx="425" cy="414" rx="24" ry="12" fill="#3c1b2b" />
        <path d="M352 410 Q336 475 352 494" fill="none" stroke="#a06e6e" strokeWidth="6" />
        <path d="M300 535 Q351 568 409 532" fill="none" stroke="#9e4962" strokeWidth="8" strokeLinecap="round" />
        <circle cx="351" cy="296" r="19" fill={P.hotPink} />
        <path d="M320 307 L383 307" stroke={P.hotPink} strokeWidth="7" />
        <circle cx="487" cy="474" r="20" fill={P.pink} opacity=".7" />

        <path
          d="M165 635 Q330 540 525 635 L650 1090 Q390 1200 95 1070Z"
          fill="url(#saree)"
          stroke="#d79aad"
          strokeWidth="7"
        />
        <path
          d="M110 1010 Q345 1115 620 1015"
          fill="none"
          stroke={P.hotPink}
          strokeWidth="16"
          opacity=".55"
        />
        <path
          d={`M510 210 Q${585 + hair} 340 565 680 Q500 925 410 1080`}
          fill="none"
          stroke="#7c3852"
          strokeWidth="54"
          strokeLinecap="round"
          opacity=".55"
        />
        <path
          d={`M250 120 Q100 ${470 + hair} 180 880`}
          fill="none"
          stroke="#6b2b48"
          strokeWidth="48"
          strokeLinecap="round"
          opacity=".72"
        />
        <path
          d={`M560 270 Q690 ${540 + hair} 535 1000`}
          fill="none"
          stroke="#7d3a55"
          strokeWidth="40"
          strokeLinecap="round"
          opacity=".6"
        />
        <path
          d="M118 690 Q55 815 98 945"
          fill="none"
          stroke="#69304a"
          strokeWidth="31"
          strokeLinecap="round"
          opacity=".78"
        />
      </g>
    </svg>
  );
}

function HeroMan({frame}: {frame: number}) {
  const move = Math.sin(frame / 46) * 5;
  return (
    <svg
      viewBox="0 0 390 820"
      style={{
        position: "absolute",
        width: 390,
        height: 820,
        left: 40,
        top: 820,
        opacity: .9,
        transform: `translateX(${move}px)`,
      }}
    >
      <path
        d="M120 190 Q105 110 185 72 Q260 40 310 126 Q305 190 255 218 L170 218Z"
        fill="#4e2337"
      />
      <circle cx="205" cy="177" r="82" fill="#c99183" stroke={P.ink} strokeWidth="5" />
      <path d="M116 325 Q205 268 294 325 L325 650 Q205 720 85 650Z" fill="#fff" stroke="#c88fa3" strokeWidth="7" />
      <path d="M130 365 Q204 310 278 365" fill="none" stroke={P.hotPink} strokeWidth="11" opacity=".5" />
      <path d="M135 640 Q110 730 98 810 M270 640 Q300 730 312 810" stroke="#33202a" strokeWidth="33" strokeLinecap="round" />
      <path d="M85 360 L25 510 M310 360 L365 510" stroke="#c99183" strokeWidth="25" strokeLinecap="round" />
    </svg>
  );
}

function Dancer({frame}: {frame: number}) {
  const sway = Math.sin(frame / 17) * 7;
  const arm = Math.sin(frame / 13) * 20;
  return (
    <svg
      viewBox="0 0 500 1000"
      style={{
        position: "absolute",
        width: 520,
        height: 1040,
        left: 285,
        top: 390,
        transform: `translateX(${sway}px)`,
      }}
    >
      <circle cx="250" cy="130" r="60" fill="#f0d0c7" stroke={P.ink} strokeWidth="5" />
      <path d="M190 130 Q250 28 318 120 Q275 88 210 110Z" fill="#58253e" />
      <circle cx="250" cy="178" r="13" fill={P.hotPink} />
      <path d="M182 240 Q250 202 318 240 L395 580 Q250 690 105 580Z" fill="#fffdfb" stroke="#cc9aae" strokeWidth="7" />
      <path d="M110 555 Q250 660 390 555 L450 765 Q250 905 50 765Z" fill="#f8e2e6" stroke="#cc9aae" strokeWidth="7" />
      <path d={`M192 245 Q122 ${180 + arm} 58 340`} fill="none" stroke="#efcbc0" strokeWidth="29" strokeLinecap="round" />
      <path d={`M308 245 Q378 ${180 - arm} 442 340`} fill="none" stroke="#efcbc0" strokeWidth="29" strokeLinecap="round" />
      <circle cx="58" cy="340" r="21" fill="#efcbc0" />
      <circle cx="442" cy="340" r="21" fill="#efcbc0" />
      <path d="M165 748 Q125 865 92 978 M335 748 Q375 865 408 978" stroke="#efcbc0" strokeWidth="31" strokeLinecap="round" />
      <path d="M63 981 Q94 998 126 980 M374 980 Q406 998 438 981" stroke="#efcbc0" strokeWidth="19" strokeLinecap="round" />
      {Array.from({length: 11}).map((_, i) => (
        <circle
          key={i}
          cx={105 + i * 29}
          cy={635 + (i % 2) * 12}
          r="7"
          fill={P.hotPink}
          opacity=".88"
        />
      ))}
    </svg>
  );
}

function Mudra({frame}: {frame: number}) {
  const scale = 1 + Math.sin(frame / 9) * .035;
  return (
    <svg
      viewBox="0 0 520 520"
      style={{
        position: "absolute",
        width: 520,
        height: 520,
        left: 35,
        top: 365,
        transform: `scale(${scale}) rotate(-7deg)`,
        transformOrigin: "center",
      }}
    >
      <path
        d="M155 430 Q65 370 106 270 L139 154 Q150 116 183 135 L198 245 L220 85 Q230 42 270 66 L285 246 L312 112 Q322 73 348 98 L345 270 L376 173 Q388 147 414 170 L382 348 Q350 442 260 462Z"
        fill="#f2d2ca"
        stroke={P.ink}
        strokeWidth="7"
      />
      <path d="M187 280 Q260 315 340 280" fill="none" stroke={P.hotPink} strokeWidth="9" />
      <circle cx="268" cy="91" r="11" fill={P.hotPink} />
    </svg>
  );
}

function Ghungroo({frame}: {frame: number}) {
  const sway = Math.sin(frame / 7) * 4;
  return (
    <svg
      viewBox="0 0 760 340"
      style={{
        position: "absolute",
        width: 760,
        height: 340,
        left: 165,
        bottom: 420,
        transform: `rotate(${sway}deg)`,
      }}
    >
      <path d="M45 145 Q380 48 715 145" fill="none" stroke="#9a7058" strokeWidth="17" />
      {Array.from({length: 13}).map((_, i) => (
        <g key={i} transform={`translate(${58 + i * 54} ${145 + Math.sin(frame / 6 + i) * 7})`}>
          <circle cy="55" r="29" fill={P.hotPink} />
          <circle cy="55" r="10" fill="#fff5ea" />
          <path d="M0 27 V86" stroke="#63344a" strokeWidth="4" />
        </g>
      ))}
    </svg>
  );
}

function Spotlight() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "6%",
          top: "11%",
          width: "88%",
          height: "72%",
          borderRadius: "50% 50% 0 0",
          border: `5px solid rgba(223,47,103,.18)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 220,
          width: "100%",
          height: 1180,
          background:
            "radial-gradient(ellipse at 50% 25%, rgba(255,255,255,.98), rgba(255,235,240,.52) 35%, transparent 72%)",
        }}
      />
    </>
  );
}

function BrushTitle({frame}: {frame: number}) {
  const p = spring({
    frame: Math.min(frame, 28),
    fps: FPS,
    config: {damping: 16, stiffness: 120, mass: .65},
  });
  const y = interpolate(p, [0, 1], [75, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 55,
        top: 55,
        opacity: p,
        transform: `translateY(${y}px) rotate(-3deg)`,
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: 7,
          color: P.hotPink,
          marginLeft: 240,
        }}
      >
        RACHIT RAM PRESENTS
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: "'Brush Script MT','Segoe Script','URW Chancery L',cursive",
          fontSize: 166,
          lineHeight: .86,
          fontWeight: 700,
          fontStyle: "italic",
          color: P.hotPink,
          textShadow: "0 3px 0 rgba(87,37,58,.08)",
        }}
      >
        Soneya
      </div>
      <div
        style={{
          width: 540,
          height: 16,
          marginLeft: 110,
          marginTop: 10,
          background: P.hotPink,
          borderRadius: 999,
          transform: "skewX(-28deg) rotate(-2deg)",
          opacity: .88,
        }}
      />
      <div
        style={{
          marginTop: 20,
          marginLeft: 115,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 5,
          color: P.hotPink,
        }}
      >
        EK DIL, EK YAAD, EK HUMSAFAR...
      </div>
    </div>
  );
}

function Lyric({text,index,frame}: {text: string; index: number; frame: number}) {
  const globalStart = starts[index];
  const local = Math.max(0, frame - globalStart);
  const duration = durations[index];
  const inP = spring({
    frame: Math.min(local, 20),
    fps: FPS,
    config: {damping: 18, stiffness: 135, mass: .58},
  });
  const outP = interpolate(
    local,
    [Math.max(0, duration - 18), duration],
    [1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const opacity = clamp(inP) * outP;
  const isLeft = index % 2 === 0;
  const big = index >= 6;
  return (
    <div
      style={{
        position: "absolute",
        left: isLeft ? 70 : 120,
        right: isLeft ? 120 : 70,
        bottom: 205,
        opacity,
        transform: `translateY(${interpolate(inP, [0, 1], [65, 0])}px)`,
        textAlign: isLeft ? "left" : "right",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "10px 20px 12px",
          background: "rgba(255,250,248,.78)",
          borderLeft: `4px solid ${P.hotPink}`,
          boxShadow: "0 10px 30px rgba(87,37,58,.08)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            fontSize: big ? 62 : 54,
            lineHeight: 1.18,
            fontWeight: 850,
            letterSpacing: -1.2,
            color: P.ink,
            maxWidth: 860,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

function LineProgress({index, frame}: {index: number; frame: number}) {
  const local = frame - starts[index];
  const p = clamp(local / durations[index]);
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom: 116,
        height: 3,
        background: "rgba(87,37,58,.12)",
      }}
    >
      <div
        style={{
          width: `${p * 100}%`,
          height: "100%",
          background: P.hotPink,
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

function Scene({index,frame}: {index: number; frame: number}) {
  const local = frame - starts[index];
  const fade = interpolate(
    local,
    [0, 10, Math.max(12, durations[index] - 10), durations[index]],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  if (index === 0) {
    return (
      <div style={{position: "absolute", inset: 0, opacity: fade}}>
        <DecorativeBirds />
        <Mountains frame={frame} />
        <BrushTitle frame={frame} />
        <HeroWoman frame={frame} />
        <HeroMan frame={frame} />
        <Petals frame={frame} count={18} />
      </div>
    );
  }

  if (index === 1) {
    return (
      <div style={{position: "absolute", inset: 0, opacity: fade}}>
        <DecorativeBirds />
        <Mountains frame={frame} />
        <div
          style={{
            position: "absolute",
            left: 85,
            top: 180,
            fontSize: 32,
            letterSpacing: 8,
            fontWeight: 800,
            color: P.hotPink,
          }}
        >
          सफेद साड़ी • चंदन
        </div>
        <HeroWoman frame={frame} />
        <HeroMan frame={frame} />
        <Petals frame={frame} count={28} />
      </div>
    );
  }

  if (index === 2) {
    return (
      <div style={{position: "absolute", inset: 0, opacity: fade}}>
        <Spotlight />
        <Dancer frame={frame} />
        <div
          style={{
            position: "absolute",
            top: 215,
            left: 72,
            fontSize: 118,
            lineHeight: .9,
            fontWeight: 900,
            color: P.hotPink,
            opacity: .11,
          }}
        >
          LIGHT
        </div>
        <div
          style={{
            position: "absolute",
            top: 298,
            left: 110,
            fontSize: 42,
            letterSpacing: 8,
            fontWeight: 800,
            color: P.ink,
          }}
        >
          स्टेज • रोशनी • ठहराव
        </div>
        <Petals frame={frame} count={12} />
      </div>
    );
  }

  if (index === 3) {
    return (
      <div style={{position: "absolute", inset: 0, opacity: fade}}>
        <Spotlight />
        <div
          style={{
            position: "absolute",
            top: 195,
            left: 85,
            fontSize: 156,
            fontWeight: 900,
            color: P.hotPink,
            opacity: .12,
          }}
        >
          HEARTBEAT
        </div>
        <Dancer frame={frame} />
        <Ghungroo frame={frame} />
        <div
          style={{
            position: "absolute",
            left: 85,
            bottom: 710,
            width: 420,
            height: 4,
            background: P.hotPink,
            transform: `scaleX(${1 + Math.sin(frame / 4) * .18})`,
            transformOrigin: "left",
          }}
        />
      </div>
    );
  }

  if (index === 4) {
    return (
      <div style={{position: "absolute", inset: 0, opacity: fade}}>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 140,
            fontSize: 170,
            fontWeight: 900,
            color: P.hotPink,
            opacity: .1,
          }}
        >
          MUDRA
        </div>
        <Mudra frame={frame} />
        <div
          style={{
            position: "absolute",
            right: 58,
            top: 300,
            width: 3,
            height: 720,
            background: P.hotPink,
            opacity: .22,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 100,
            top: 405,
            writingMode: "vertical-rl",
            fontSize: 28,
            letterSpacing: 7,
            color: P.ink,
            fontWeight: 700,
          }}
        >
          पुरानी कथा • भाव • संकेत
        </div>
        <HeroWoman frame={frame} />
        <Petals frame={frame} count={16} />
      </div>
    );
  }

  if (index === 5) {
    return (
      <div style={{position: "absolute", inset: 0, opacity: fade}}>
        <div
          style={{
            position: "absolute",
            inset: 120,
            borderRadius: "50%",
            border: `2px solid ${P.hotPink}`,
            opacity: .16,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 78,
            right: 78,
            textAlign: "center",
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: 6,
            color: P.hotPink,
          }}
        >
          भाव ही कहानी है
        </div>
        <Dancer frame={frame} />
        <div
          style={{
            position: "absolute",
            left: 68,
            bottom: 470,
            fontSize: 180,
            fontWeight: 900,
            color: P.ink,
            opacity: .07,
          }}
        >
          भाव
        </div>
        <Petals frame={frame} count={20} />
      </div>
    );
  }

  if (index === 6) {
    return (
      <div style={{position: "absolute", inset: 0, opacity: fade}}>
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 190,
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: 7,
            color: P.hotPink,
          }}
        >
          MODERN BOY / OLD SOUL
        </div>
        <HeroMan frame={frame} />
        <div
          style={{
            position: "absolute",
            left: 430,
            top: 465,
            width: 520,
            height: 320,
            border: `4px solid ${P.hotPink}`,
            transform: "rotate(-6deg)",
            opacity: .35,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 520,
            fontFamily: "Georgia,serif",
            fontStyle: "italic",
            fontSize: 94,
            color: P.hotPink,
          }}
        >
          rhyme
        </div>
        <div
          style={{
            position: "absolute",
            right: 92,
            top: 890,
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: 5,
            color: P.ink,
          }}
        >
          MIC → RAP → YOU
        </div>
        <Petals frame={frame} count={14} />
      </div>
    );
  }

  return (
    <div style={{position: "absolute", inset: 0, opacity: fade}}>
      <HeroMan frame={frame} />
      <Dancer frame={frame} />
      <div
        style={{
          position: "absolute",
          left: 85,
          top: 185,
          fontSize: 160,
          lineHeight: .9,
          fontWeight: 900,
          color: P.hotPink,
          opacity: .11,
        }}
      >
        SWAG
      </div>
      <div
        style={{
          position: "absolute",
          right: 82,
          top: 290,
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: `5px solid ${P.hotPink}`,
          opacity: .3,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 130,
          top: 400,
          fontSize: 45,
          fontWeight: 900,
          color: P.hotPink,
          transform: `rotate(-8deg) scale(${1 + Math.sin(frame / 11) * .03})`,
        }}
      >
        झुकता है
      </div>
      <Petals frame={frame} count={24} />
    </div>
  );
}

function Main() {
  const frame = useCurrentFrame();
  const index = Math.max(
    0,
    starts.findIndex(
      (start, i) => frame >= start && frame < start + durations[i],
    ),
  );

  return (
    <AbsoluteFill
      style={{
        background: P.paper,
        overflow: "hidden",
        fontFamily:
          "'Noto Sans Devanagari','Noto Sans Tamil','Arial',sans-serif",
      }}
    >
      <Audio src="https://raw.githubusercontent.com/1rachit-tech/MY-LYRIC-VIDEO/main/lyric-video/song.mp3" />
      <Paper />

      <div
        style={{
          position: "absolute",
          inset: -50,
          transform: `translate(${Math.sin(frame / 78) * 8}px,${Math.sin(
            frame / 91,
          ) * 7}px)`,
        }}
      >
        <Scene index={index} frame={frame} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 66,
          right: 66,
          top: 62,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: 4,
          color: P.ink,
          opacity: .56,
        }}
      >
        <span>RACHIT RAM MUSIC</span>
        <span>VISUAL LYRIC FILM — 01</span>
      </div>

      <Lyric text={LYRICS[index]} index={index} frame={frame} />
      <LineProgress index={index} frame={frame} />

      <div
        style={{
          position: "absolute",
          left: 70,
          bottom: 72,
          fontSize: 13,
          letterSpacing: 4,
          color: P.ink,
          opacity: .45,
        }}
      >
        {String(index + 1).padStart(2, "0")} / 08 — FIRST 30 SEC
      </div>
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: 72,
          fontSize: 13,
          letterSpacing: 3,
          color: P.hotPink,
          opacity: .68,
        }}
      >
        BHARATANATYAM × MODERN POETRY
      </div>
    </AbsoluteFill>
  );
}

export const MyComposition = () => (
  <Composition
    id="MyComp"
    component={Main}
    durationInFrames={DURATION}
    fps={FPS}
    width={W}
    height={H}
  />
);
