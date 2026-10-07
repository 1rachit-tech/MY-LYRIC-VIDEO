import {AbsoluteFill, Audio, interpolate, spring, useCurrentFrame} from "remotion";

type Props = {};

const AUDIO_URL =
  "https://raw.githubusercontent.com/1rachit-tech/MY-LYRIC-VIDEO/main/lyric-video/song.mp3";

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
  "उन कण्णु पेसुम मोझियिल एन वार्च्ताई तोलैन्जिडु",
  "नी आडुम अंध नोडियिल एन कादल पिरांनिडुदु",
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
  "भरत नाट्यम पोन्नु नी एन वाळक्कैयोड मियूसिक",
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
  "नी आडुकिर नाळ पोधुमे एन वाळक्कै पूरणमे",
  "भरतनाट्यम अझगिनी एन कादल जीवने",
  "कोलोसस सथम पोलदान उन ஞாபகம் வரूदु",
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

const DURATION_IN_FRAMES = 6120;
const FPS = 30;

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
  const progress = frame / DURATION_IN_FRAMES;
  const linePosition = progress * LYRICS.length;
  const activeIndex = Math.min(
    LYRICS.length - 1,
    Math.floor(linePosition),
  );
  const localProgress = linePosition - activeIndex;

  const enter = spring({
    frame: Math.min(20, frame % Math.max(1, Math.floor(DURATION_IN_FRAMES / LYRICS.length))),
    fps: FPS,
    config: {damping: 14, stiffness: 120, mass: 0.6},
  });

  const scale = interpolate(enter, [0, 1], [0.94, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const glow = interpolate(localProgress, [0, 0.5, 1], [0.15, 0.5, 0.18]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 35%, #3b1b52 0%, #160f24 42%, #05050a 100%)",
        color: "white",
        fontFamily: "Arial, Noto Sans Devanagari, sans-serif",
        overflow: "hidden",
      }}
    >
      <Audio src={AUDIO_URL} />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 32%)",
          opacity: glow,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06), transparent 28%, transparent 72%, rgba(255,210,120,0.05))",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 120,
          left: 70,
          right: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0.72,
          fontSize: 28,
          letterSpacing: 6,
        }}
      >
        <span>RACHIT RAM</span>
        <span>LYRIC VIDEO</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 60,
          right: 60,
          transform: `translateY(-50%) scale(${scale})`,
          opacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 66,
            lineHeight: 1.25,
            fontWeight: 800,
            letterSpacing: 0.5,
            textShadow:
              "0 0 18px rgba(255,255,255,0.18), 0 8px 40px rgba(0,0,0,0.55)",
          }}
        >
          {LYRICS[activeIndex]}
        </div>

        <div
          style={{
            width: 150,
            height: 5,
            margin: "34px auto 0",
            borderRadius: 999,
            background: "rgba(255,255,255,0.8)",
            transform: `scaleX(${interpolate(localProgress, [0, 1], [0.2, 1])})`,
            transformOrigin: "center",
          }}
        />

        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            opacity: 0.55,
            letterSpacing: 4,
          }}
        >
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(LYRICS.length).padStart(2, "0")}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 70,
          right: 70,
          height: 4,
          background: "rgba(255,255,255,0.16)",
          borderRadius: 10,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: "rgba(255,255,255,0.8)",
            borderRadius: 10,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
