import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";

type Props = {};

const AUDIO_URL =
  "https://raw.githubusercontent.com/1rachit-tech/MY-LYRIC-VIDEO/main/lyric-video/song.mp3";

const FPS = 30;
const DURATION_IN_FRAMES = 6120; // 3:24

const LYRICS = [
  "सफेद साड़ी, माथे पे चंदन",
  "आंखों में शांति, चाल में बंधन",
  "स्टेज पे उतरी रोशनी ठहर गई",
  "घुंघरू बजे, मेरी हार्टबीट बढ़ गई",
  "हाथों की मुद्रा बोले पुरानी कथा",
  "हर भाव में छुपा कोई देव प्रथा",
  "मैं माइक पकड़े मॉडर्न सा लड़का",
  "पर तेरे आगे मेरा स्वैग भी झुकता",
  "तेरा डांस नहीं ये साधना है",
  "हर स्टेप में सालों की आराधना है",
  "मैं राइम बनाऊं तू ताल रचे",
  "तेरी एक नज़र से शब्द सजे",
  "कोलोसस सथम केक्कुदु एन नेन्जम थुल्लुदु",
  "भरत नाट्यम पोन्नु नी एन कनवुला निकुदु",
  "उन कण्णु पेसुम मोझியिल एन वार्च्ताई तोलैन्जிடு",
  "नी आडुम अंध नोडियिल एन कादल பిరांனிடுதु",
  "टूरिल्स के लिए नहीं, इतिहास के लिए नाच",
  "तेरे हर घूम में संस्कृति झलकी",
  "तेरे गुरु की मेहनत, तेरी तपस्या",
  "तेरे पांव छुए जमीन, लगे आस्था",
  "मैं फास्ट लाइफ, तू स्लो सा सुकून",
  "तेरे पास आके शोर भी हो जाए मून",
  "तू कम बोले पर भाव हजार",
  "तेरी साइलेंस भी बोले लाइक सितार",
  "तेरे काजल में माइथोलॉजी",
  "तेरे एक्सप्रेशंस होल साइकोलॉजी",
  "मैं लिखता बार्ड्स, तू रचती भावम",
  "दोनों मिलके बचाते विरासत का नावात",
  "कोलोसस सथम केक्कुदु एन इधयम मेल्डावुदु",
  "नी आडुकिर अझगुला एन उलकम स्लो आगुदु",
  "मुत्थुरैयिल कादल इरुक्कु उन सिरिप्पु मेजिकु",
  "भरत नाट्यम पोन्नु नी एन वाळக்கैयोड மியूसிக",
  "आजकल प्यार भी फास्ट फॉरवर्ड पर",
  "तू है पॉज बटन ऑन रिकॉर्ड",
  "तेरे साथ बैठ के खामोशी भी गीत",
  "तेरी मौजूदगी ही मेरी जीत",
  "ना तू ट्रेंड है, ना तू वायरल",
  "तू टाइमलेस है, तू फाइनल",
  "जहां फिल्टर्स खत्म वहां से तू शुरू",
  "तेरा आर्ट बोले मैं खुद में भरपूर",
  "तेरे पायल की एक झनकार में",
  "मेरी सारी कविता आ जाए आकार में",
  "अगर दुनिया पूछे इंस्पिरेशन कौन",
  "मैं कहूं वो, जो नाचती है मौन",
  "नी आडुकिर नाळ पोधुमे एन वाळक्कै पूरणமே",
  "भरतनाट्यम अझगिनी एन कादल जीवने",
  "कोलोसस सथम पोलदान उन ஞாபகம் வரूदு",
  "नी पक्कतुल इल्लन्नालुम एन मनसु तेदुते",
  "तेरा नाच, मेरा सुकून है",
  "नी इल्ला वे नान इल्ला",
  "माइक बंद हो जाए, स्टेज खाली रहे",
  "पर तेरे घुंघरू दिल में हमेशा बजे",
  "यह रैप खत्म, पर अहसास नहीं",
  "भरतनाट्यम वाली लड़की",
  "तू सिर्फ इंस्पिरेशन नहीं",
  "तू मेरी पूरी पोएट्री है",
] as const;

// Line duration is weighted by lyric length instead of giving every line the same duration.
// This is a much closer first-pass sync than the previous equal-duration version.
const weights = LYRICS.map((line) => Math.max(18, line.length));
const weightTotal = weights.reduce((sum, value) => sum + value, 0);
const lineDurations = weights.map((weight) =>
  Math.round((weight / weightTotal) * DURATION_IN_FRAMES),
);

// Force the durations to add up to the exact 3:24 composition length.
lineDurations[lineDurations.length - 1] +=
  DURATION_IN_FRAMES - lineDurations.reduce((sum, value) => sum + value, 0);

const lineStarts = lineDurations.reduce<number[]>(
  (starts, duration, index) => {
    starts.push(index === 0 ? 0 : starts[index - 1] + lineDurations[index - 1]);
    return starts;
  },
  [],
);

const getSection = (index: number) => {
  if (index < 12) return "INTRO • CLASSICAL";
  if (index < 28) return "VERSE • CULTURE";
  if (index < 44) return "CHORUS • LOVE";
  return "OUTRO • TIMELESS";
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

export const MyComponent: React.FC<Props> = () => {
  const frame = useCurrentFrame();

  let activeIndex = lineStarts.findIndex(
    (start, index) =>
      frame >= start &&
      frame < start + lineDurations[index],
  );

  if (activeIndex === -1) activeIndex = LYRICS.length - 1;

  const start = lineStarts[activeIndex];
  const duration = lineDurations[activeIndex];
  const localFrame = frame - start;
  const local = clamp01(localFrame / Math.max(1, duration));
  const progress = frame / DURATION_IN_FRAMES;

  const intro = spring({
    frame: Math.min(localFrame, 24),
    fps: FPS,
    config: { damping: 13, stiffness: 120, mass: 0.55 },
  });

  const exit = interpolate(
    localFrame,
    [Math.max(0, duration - 18), duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const textOpacity = Math.min(1, intro) * exit;
  const textY = interpolate(intro, [0, 1], [45, 0]);
  const hue = 265 + Math.sin(frame / 180) * 28;
  const pulse = 1 + Math.sin(frame / 10) * 0.008;

  const words = LYRICS[activeIndex].split(" ");
  const previous = activeIndex > 0 ? LYRICS[activeIndex - 1] : "";
  const next =
    activeIndex < LYRICS.length - 1 ? LYRICS[activeIndex + 1] : "";

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, hsl(${hue} 55% 24%) 0%, #100b19 45%, #030308 100%)`,
        color: "white",
        fontFamily: "Arial, Noto Sans Devanagari, Noto Sans Tamil, sans-serif",
        overflow: "hidden",
      }}
    >
      <Audio src={AUDIO_URL} />

      {/* Moving cinematic light */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: -300 + Math.sin(frame / 95) * 180,
          top: 260 + Math.cos(frame / 120) * 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,190,120,0.16), transparent 65%)",
          filter: "blur(20px)",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 83 + 120) % 100;
        const y =
          (i * 37 + frame * (0.035 + (i % 3) * 0.012)) % 115;
        const size = 3 + (i % 3) * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y - 8}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "rgba(255,220,170,0.65)",
              boxShadow: "0 0 14px rgba(255,210,150,0.55)",
              opacity: 0.25 + (i % 4) * 0.12,
            }}
          />
        );
      })}

      {/* Top branding */}
      <div
        style={{
          position: "absolute",
          top: 88,
          left: 65,
          right: 65,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: 7,
            opacity: 0.82,
          }}
        >
          RACHIT RAM
        </div>
        <div
          style={{
            fontSize: 18,
            letterSpacing: 3,
            opacity: 0.52,
          }}
        >
          {getSection(activeIndex)}
        </div>
      </div>

      {/* Decorative rings */}
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
          left: 180,
          top: 585,
          transform: `rotate(${frame * 0.08}deg) scale(${1 + Math.sin(frame / 80) * 0.02})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 560,
          height: 560,
          borderRadius: "50%",
          border: "1px solid rgba(255,210,150,0.08)",
          left: 260,
          top: 665,
          transform: `rotate(-${frame * 0.12}deg)`,
        }}
      />

      {/* Previous lyric */}
      <div
        style={{
          position: "absolute",
          top: 570,
          left: 80,
          right: 80,
          textAlign: "center",
          fontSize: 27,
          lineHeight: 1.35,
          opacity: 0.13,
          transform: "scale(0.96)",
        }}
      >
        {previous}
      </div>

      {/* Main kinetic lyric */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 55,
          right: 55,
          transform: `translateY(-50%) translateY(${textY}px) scale(${pulse})`,
          opacity: textOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 16px",
            fontSize: 68,
            lineHeight: 1.34,
            fontWeight: 800,
            textShadow:
              "0 0 22px rgba(255,255,255,0.2), 0 12px 45px rgba(0,0,0,0.65)",
          }}
        >
          {words.map((word, index) => {
            const wordStart = index * 5;
            const wordSpring = spring({
              frame: Math.max(0, localFrame - wordStart),
              fps: FPS,
              config: { damping: 12, stiffness: 150, mass: 0.42 },
            });
            const wordOpacity = interpolate(
              wordSpring,
              [0, 1],
              [0.18, 1],
            );
            const wordY = interpolate(wordSpring, [0, 1], [24, 0]);
            return (
              <span
                key={`${activeIndex}-${index}`}
                style={{
                  display: "inline-block",
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Animated underline */}
        <div
          style={{
            width: 210,
            height: 5,
            margin: "38px auto 0",
            borderRadius: 99,
            background:
              "linear-gradient(90deg, transparent, rgba(255,220,160,0.95), transparent)",
            transform: `scaleX(${interpolate(local, [0, 0.25, 1], [0.25, 1, 0.7])})`,
          }}
        />

        <div
          style={{
            marginTop: 24,
            fontSize: 20,
            letterSpacing: 5,
            opacity: 0.52,
          }}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(LYRICS.length).padStart(2, "0")}
        </div>
      </div>

      {/* Next lyric */}
      <div
        style={{
          position: "absolute",
          bottom: 420,
          left: 80,
          right: 80,
          textAlign: "center",
          fontSize: 27,
          lineHeight: 1.35,
          opacity: 0.12,
        }}
      >
        {next}
      </div>

      {/* Timeline progress */}
      <div
        style={{
          position: "absolute",
          left: 65,
          right: 65,
          bottom: 105,
          height: 5,
          background: "rgba(255,255,255,0.13)",
          borderRadius: 99,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 99,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,215,155,0.95))",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 55,
          left: 65,
          right: 65,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 17,
          letterSpacing: 3,
          opacity: 0.42,
        }}
      >
        <span>BHARATANATYAM • LOVE RAP</span>
        <span>ORIGINAL LYRIC VIDEO</span>
      </div>
    </AbsoluteFill>
  );
};
