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
const DURATION = 6120;
const W = 1080;
const H = 1920;

const LYRICS = [
  "सफेद साड़ी, माथे पे चंदन","आंखों में शांति, चाल में बंधन",
  "स्टेज पे उतरी रोशनी ठहर गई","घुंघरू बजे, मेरी हार्टबीट बढ़ गई",
  "हाथों की मुद्रा बोले पुरानी कथा","हर भाव में छुपा कोई देव प्रथा",
  "मैं माइक पकड़े मॉडर्न सा लड़का","पर तेरे आगे मेरा स्वैग भी झुकता",
  "तेरा डांस नहीं ये साधना है","हर स्टेप में सालों की आराधना है",
  "मैं राइम बनाऊं तू ताल रचे","तेरी एक नज़र से शब्द सजे",
  "कोलोसस सथम केक्कुदु एन नेन्जम थुल्लुदु","भरत नाट्यम पोन्नु नी एन कनवुला निकुदु",
  "उन कण्णु पेसुम मोझियिल एन வார्च्ताई तोலैन्जிடு","नी आडुम अंध नोडियिल एन कादल பिरांனிடுது",
  "टूरिल्स के लिए नहीं, इतिहास के लिए नाच","तेरे हर घूम में संस्कृति झलकी",
  "तेरे गुरु की मेहनत, तेरी तपस्या","तेरे पांव छुए जमीन, लगे आस्था",
  "मैं फास्ट लाइफ, तू स्लो सा सुकून","तेरे पास आके शोर भी हो जाए मून",
  "तू कम बोले पर भाव हजार","तेरी साइलेंस भी बोले लाइक सितार",
  "तेरे काजल में माइथोलॉजी","तेरे एक्सप्रेशंस होल साइकोलॉजी",
  "मैं लिखता बार्ड्स, तू रचती भावम","दोनों मिलके बचाते विरासत का नावात",
  "कोलोसस सथम केक्कुदु एन इधयम मेल्डावुदु","नी आडुकिर अझगुला एन उलकम स्लो आगुदु",
  "मुत्थुरैयिल कादल इरुक्कु उन सिरिप्पु मेजिकु","भरत नाट्यम पोन्नु नी एन வाळக்கையோட மியूसிக",
  "आजकल प्यार भी फास्ट फॉरवर्ड पर","तू है पॉज बटन ऑन रिकॉर्ड",
  "तेरे साथ बैठ के खामोशी भी गीत","तेरी मौजूदगी ही मेरी जीत",
  "ना तू ट्रेंड है, ना तू वायरल","तू टाइमलेस है, तू फाइनल",
  "जहां फिल्टर्स खत्म वहां से तू शुरू","तेरा आर्ट बोले मैं खुद में भरपूर",
  "तेरे पायल की एक झनकार में","मेरी सारी कविता आ जाए आकार में",
  "अगर दुनिया पूछे इंस्पिरेशन कौन","मैं कहूं वो, जो नाचती है मौन",
  "नी आडुकिर नाळ पोधुमे एन वाळக்கै पूरणமே","भरतनाट्यम अझगिनी एन कादल जीवने",
  "कोलोसस सथम पोलदान उन ஞாபகம் வரूदु","नी पक्कतुल इल्लन्नालुम एन मनसु तेदुते",
  "तेरा नाच, मेरा सुकून है","नी इल्ला वे नान इल्ला",
  "माइक बंद हो जाए, स्टेज खाली रहे","पर तेरे घुंघरू दिल में हमेशा बजे",
  "यह रैप खत्म, पर अहसास नहीं","भरतनाट्यम वाली लड़की",
  "तू सिर्फ इंस्पिरेशन नहीं","तू मेरी पूरी पोएट्री है",
] as const;

const weights = LYRICS.map((x) => Math.max(18, x.replace(/\s/g, "").length));
const totalWeight = weights.reduce((a, b) => a + b, 0);
const durations = weights.map((x) => Math.round((x / totalWeight) * DURATION));
durations[durations.length - 1] += DURATION - durations.reduce((a, b) => a + b, 0);
const starts = durations.reduce<number[]>((a, d, i) => {
  a.push(i === 0 ? 0 : a[i - 1] + durations[i - 1]);
  return a;
}, []);

const clamp = (x: number) => Math.max(0, Math.min(1, x));

type World =
  | "PORTRAIT"
  | "STAGE"
  | "DUALITY"
  | "SADHANA"
  | "HERITAGE"
  | "SLOWLOVE"
  | "MYTH"
  | "POETRY"
  | "PAUSE"
  | "TIMELESS"
  | "PAYAL"
  | "INSPIRATION"
  | "ABSENCE"
  | "FINALE";

const sceneOf = (i: number): World => {
  if (i < 2) return "PORTRAIT";
  if (i < 4) return "STAGE";
  if (i < 8) return "DUALITY";
  if (i < 12) return "SADHANA";
  if (i < 20) return "HERITAGE";
  if (i < 24) return "SLOWLOVE";
  if (i < 28) return "MYTH";
  if (i < 32) return "POETRY";
  if (i < 36) return "PAUSE";
  if (i < 40) return "TIMELESS";
  if (i < 44) return "PAYAL";
  if (i < 48) return "INSPIRATION";
  if (i < 52) return "ABSENCE";
  return "FINALE";
};

const COLORS: Record<World, { paper: string; ink: string; deep: string; blush: string }> = {
  PORTRAIT: { paper: "#fbf4f0", ink: "#c72e62", deep: "#4a2034", blush: "#f4c5d2" },
  STAGE: { paper: "#f8efe8", ink: "#b82f55", deep: "#321b27", blush: "#eab3c2" },
  DUALITY: { paper: "#f7f0e8", ink: "#a92d58", deep: "#1e1b20", blush: "#edc4cf" },
  SADHANA: { paper: "#f5ede4", ink: "#8c2947", deep: "#3a2420", blush: "#e2b6a4" },
  HERITAGE: { paper: "#f2e7d8", ink: "#7d4b36", deep: "#35251d", blush: "#d8b28f" },
  SLOWLOVE: { paper: "#f8f0ec", ink: "#9c4665", deep: "#32202a", blush: "#efcbd5" },
  MYTH: { paper: "#f7edf3", ink: "#6e365b", deep: "#281b2b", blush: "#dcb9d2" },
  POETRY: { paper: "#fbf4f0", ink: "#b93460", deep: "#432033", blush: "#f0b8cb" },
  PAUSE: { paper: "#faf7f3", ink: "#3c3a3c", deep: "#161416", blush: "#d8d2ce" },
  TIMELESS: { paper: "#f5eee7", ink: "#9a5b35", deep: "#32241e", blush: "#dfbfa3" },
  PAYAL: { paper: "#faf1e8", ink: "#ad4c62", deep: "#40232b", blush: "#edc2c9" },
  INSPIRATION: { paper: "#fbf3ef", ink: "#c43765", deep: "#452035", blush: "#f1bfd0" },
  ABSENCE: { paper: "#f4f1ee", ink: "#65565c", deep: "#252126", blush: "#d7c9cd" },
  FINALE: { paper: "#fbf1ef", ink: "#b52650", deep: "#3d1827", blush: "#f0b2c4" },
};

function Paper({opacity = 0.18}: {opacity?: number}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        backgroundImage:
          "radial-gradient(rgba(70,30,40,.28) .55px, transparent .65px), radial-gradient(rgba(180,60,90,.11) .7px, transparent .8px)",
        backgroundSize: "7px 7px, 17px 17px",
        mixBlendMode: "multiply",
      }}
    />
  );
}

function Petals({frame, color, count = 22}: {frame: number; color: string; count?: number}) {
  return (
    <svg viewBox="0 0 1080 1920" style={{position:"absolute", inset:0, width:"100%", height:"100%"}}>
      {Array.from({length: count}).map((_, i) => {
        const x = (i * 173) % 1100;
        const baseY = (i * 311) % 1950;
        const drift = Math.sin(frame / (25 + (i % 7) * 5) + i) * 34;
        const fall = (baseY + frame * (0.8 + (i % 4) * 0.18)) % 2050 - 60;
        const rot = Math.sin(frame / 30 + i) * 28;
        return (
          <g key={i} transform={`translate(${x + drift} ${fall}) rotate(${rot})`} opacity={0.28 + (i % 4) * .1}>
            <path d="M0 0 C16 -22 38 -18 48 0 C34 18 15 22 0 0Z" fill={color}/>
          </g>
        );
      })}
    </svg>
  );
}

function InkStroke({frame, color, y=980, reverse=false}: {frame:number;color:string;y?:number;reverse?:boolean}) {
  const p = interpolate((frame % 80), [0, 58, 80], [0, 1, 1], {extrapolateLeft:"clamp", extrapolateRight:"clamp"});
  return (
    <svg viewBox="0 0 1080 260" style={{position:"absolute", left:0, top:y, width:"100%", height:260}}>
      <path
        d={reverse ? "M70 150 C260 30 390 210 560 110 S850 35 1020 130" : "M50 125 C230 15 390 220 560 120 S850 35 1035 150"}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="1150"
        strokeDashoffset={1150 * (1-p)}
        opacity=".72"
      />
      <path d="M65 145 C300 85 500 165 1010 120" fill="none" stroke={color} strokeWidth="2" opacity=".3"/>
    </svg>
  );
}

function Face({frame, color, blush, close=false}: {frame:number;color:string;blush:string;close?:boolean}) {
  const blink = Math.sin(frame / 46) > .93;
  const hairShift = Math.sin(frame / 48) * 10;
  return (
    <svg viewBox="0 0 520 700" style={{width: close ? 650 : 520, height: close ? 875 : 700, overflow:"visible"}}>
      <g transform={`translate(${hairShift} 0)`}>
        <path d="M95 330 Q25 70 260 28 Q490 75 430 350 Q470 520 345 610 L150 590 Q52 500 95 330Z" fill="#4b2037" opacity=".94"/>
        <path d="M120 185 Q245 80 405 190 L420 420 Q335 545 240 565 Q130 515 100 400Z" fill="#f1d8d1" stroke="#6b3a4a" strokeWidth="5"/>
        <path d="M118 225 Q180 125 270 145 Q390 125 425 235 Q355 188 280 220 Q190 245 118 225Z" fill="#4b2037"/>
        <path d="M145 312 Q185 282 220 305" fill="none" stroke="#5b3343" strokeWidth="9" strokeLinecap="round"/>
        <path d="M315 305 Q355 282 395 312" fill="none" stroke="#5b3343" strokeWidth="9" strokeLinecap="round"/>
        {!blink && <><ellipse cx="190" cy="325" rx="22" ry="10" fill="#321b27"/><ellipse cx="350" cy="325" rx="22" ry="10" fill="#321b27"/></>}
        {blink && <><path d="M165 325 Q190 338 215 325" fill="none" stroke="#321b27" strokeWidth="7"/><path d="M325 325 Q350 338 375 325" fill="none" stroke="#321b27" strokeWidth="7"/></>}
        <path d="M257 310 Q242 370 258 386" fill="none" stroke="#9d716e" strokeWidth="6"/>
        <path d="M218 422 Q260 448 305 422" fill="none" stroke="#8b4b5a" strokeWidth="8" strokeLinecap="round"/>
        <circle cx="258" cy="245" r="17" fill={color}/>
        <path d="M230 255 L286 255" stroke={color} strokeWidth="7"/>
        <path d="M118 420 Q255 515 415 420 L440 635 Q255 745 80 635Z" fill="#f4eee7" stroke="#c9a9ad" strokeWidth="5"/>
        <path d="M100 590 Q255 700 430 590" fill="none" stroke={color} strokeWidth="12" opacity=".75"/>
        <path d="M90 585 Q255 690 425 585" fill="none" stroke="#ffffff" strokeWidth="5" opacity=".6"/>
        <circle cx="408" cy="500" r="14" fill={blush} opacity=".8"/>
        <path d="M90 300 Q55 450 100 565" fill="none" stroke="#6b3a4a" strokeWidth="24" strokeLinecap="round"/>
        <path d="M425 285 Q475 450 425 565" fill="none" stroke="#6b3a4a" strokeWidth="24" strokeLinecap="round"/>
      </g>
    </svg>
  );
}

function Dancer({frame, color}: {frame:number;color:string}) {
  const sway = Math.sin(frame/32)*8;
  const arm = Math.sin(frame/19)*16;
  return (
    <svg viewBox="0 0 520 1000" style={{width:520,height:1000,overflow:"visible"}}>
      <g transform={`translate(${sway} 0)`}>
        <circle cx="260" cy="125" r="62" fill="#f0d3c7" stroke="#663747" strokeWidth="5"/>
        <path d="M195 130 Q255 25 325 125 L345 85 Q260 10 185 85Z" fill="#4a2037"/>
        <circle cx="260" cy="175" r="14" fill={color}/>
        <path d="M185 230 Q260 190 335 230 L410 560 Q260 650 110 560Z" fill="#f6f0e8" stroke="#a76b78" strokeWidth="6"/>
        <path d="M110 545 Q260 630 410 545 L465 760 Q260 875 55 760Z" fill="#eee2d7" stroke="#a76b78" strokeWidth="6"/>
        <path d={`M190 250 Q125 ${190+arm} 72 345`} fill="none" stroke="#efd0c4" strokeWidth="27" strokeLinecap="round"/>
        <path d={`M330 250 Q395 ${190-arm} 448 345`} fill="none" stroke="#efd0c4" strokeWidth="27" strokeLinecap="round"/>
        <circle cx="70" cy="345" r="21" fill="#efd0c4"/><circle cx="450" cy="345" r="21" fill="#efd0c4"/>
        <path d="M170 740 Q125 855 105 970" fill="none" stroke="#efd0c4" strokeWidth="30" strokeLinecap="round"/>
        <path d="M350 740 Q395 855 415 970" fill="none" stroke="#efd0c4" strokeWidth="30" strokeLinecap="round"/>
        <path d="M70 968 Q105 990 140 972" fill="none" stroke="#efd0c4" strokeWidth="18" strokeLinecap="round"/>
        <path d="M380 972 Q415 990 450 968" fill="none" stroke="#efd0c4" strokeWidth="18" strokeLinecap="round"/>
        {Array.from({length:8}).map((_,i)=><circle key={i} cx={125+i*39} cy={650+(i%2)*10} r="7" fill={color}/>)}
      </g>
    </svg>
  );
}

function Boy({frame, color}: {frame:number;color:string}) {
  const sway = Math.sin(frame/42)*5;
  return (
    <svg viewBox="0 0 420 720" style={{width:420,height:720}}>
      <g transform={`translate(${sway} 0)`}>
        <circle cx="210" cy="105" r="54" fill="#c98f78" stroke="#432532" strokeWidth="5"/>
        <path d="M155 110 Q205 25 270 105 L252 65 Q200 35 158 72Z" fill="#252028"/>
        <path d="M165 175 Q210 145 255 175 L300 500 Q210 555 120 500Z" fill="#24212a"/>
        <path d="M145 220 L70 365 M275 220 L335 365" stroke="#c98f78" strokeWidth="22" strokeLinecap="round"/>
        <circle cx="64" cy="372" r="18" fill="#c98f78"/>
        <rect x="52" y="350" width="28" height="88" rx="14" fill="#17151b"/>
        <path d="M150 500 L125 675 M270 500 L295 675" stroke="#25212b" strokeWidth="27" strokeLinecap="round"/>
        <path d="M120 680 L165 680 M275 680 L320 680" stroke="#17151b" strokeWidth="20" strokeLinecap="round"/>
        <path d="M66 360 Q105 315 150 300" fill="none" stroke={color} strokeWidth="4" opacity=".8"/>
      </g>
    </svg>
  );
}

function Mudra({frame, color}: {frame:number;color:string}) {
  const pulse = 1 + Math.sin(frame/15)*.035;
  return (
    <svg viewBox="0 0 500 500" style={{width:500,height:500,transform:`scale(${pulse})`}}>
      <path d="M150 410 Q80 360 115 270 L145 170 Q160 130 190 150 L205 250 L225 95 Q235 55 270 75 L285 250 L310 125 Q325 90 350 110 L345 275 L370 190 Q390 160 410 185 L380 340 Q350 430 260 450Z" fill="#efd0c5" stroke="#6a3a49" strokeWidth="6"/>
      <path d="M185 270 Q250 305 340 270" fill="none" stroke={color} strokeWidth="8"/>
      <circle cx="265" cy="95" r="10" fill={color}/>
    </svg>
  );
}

function Ghungroo({frame, color}: {frame:number;color:string}) {
  return (
    <svg viewBox="0 0 760 300" style={{width:760,height:300}}>
      <path d="M55 135 Q380 35 705 135" fill="none" stroke="#8d6b50" strokeWidth="17"/>
      {Array.from({length:13}).map((_,i)=>{
        const x=65+i*53;
        const y=135+Math.sin(frame/8+i)*10;
        return <g key={i} transform={`translate(${x} ${y})`}><circle cy="50" r="28" fill={color}/><circle cy="50" r="9" fill="#fff3d7"/><path d="M0 25 L0 76" stroke="#6b3f4a" strokeWidth="4"/></g>
      })}
    </svg>
  );
}

function Lotus({frame,color}:{frame:number;color:string}) {
  const r=1+Math.sin(frame/40)*.03;
  return (
    <svg viewBox="0 0 500 300" style={{width:500,height:300,transform:`scale(${r})`}}>
      {[-2,-1,0,1,2].map(i=><path key={i} d={`M250 250 Q${180+i*45} ${90-Math.abs(i)*18} 250 40 Q${320-i*45} ${90-Math.abs(i)*18} 250 250Z`} fill={color} opacity={.18+(.1*(2-Math.abs(i)))} stroke={color} strokeWidth="4"/> )}
    </svg>
  );
}

function WordArt({text,color,size=74,align:"left"}:{text:string;color:string;size?:number;align?:"left"|"center"|"right"}) {
  return <div style={{fontFamily:"Noto Sans Devanagari, Noto Sans Tamil, Arial, sans-serif",fontSize:size,fontWeight:800,lineHeight:1.18,letterSpacing:-1.8,textAlign:align,color}}>{text}</div>;
}

function Caption({text,color,deep,frame,align="left",size=54}:{text:string;color:string;deep:string;frame:number;align?:"left"|"center"|"right";size?:number}) {
  const p=spring({frame:Math.min(frame,22),fps:FPS,config:{damping:18,stiffness:120,mass:.65}});
  return (
    <div style={{position:"absolute",left:72,right:72,bottom:310,opacity:p,transform:`translateY(${interpolate(p,[0,1],[48,0])}px)`,textAlign:align}}>
      <div style={{fontSize:15,letterSpacing:5,textTransform:"uppercase",color,opacity:.8,marginBottom:18}}>RACHIT RAM — VISUAL POETRY</div>
      <div style={{fontSize:size,fontWeight:800,lineHeight:1.18,color:deep}}>{text}</div>
    </div>
  );
}

function World({world,frame,c}: {world:World;frame:number;c:{paper:string;ink:string;deep:string;blush:string}}) {
  const drift=Math.sin(frame/65)*24;
  if(world==="PORTRAIT") return <>
    <div style={{position:"absolute",right:-45,top:285,transform:`translateX(${drift}px) rotate(-3deg)`,transformOrigin:"bottom"}}><Face frame={frame} color={c.ink} blush={c.blush}/></div>
    <div style={{position:"absolute",left:45,top:820,opacity:.55,transform:"scale(.82)"}}><Boy frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",left:60,top:215,fontSize:160,fontFamily:"Georgia,serif",fontStyle:"italic",color:c.ink,opacity:.13}}>Son</div>
    <Petals frame={frame} color={c.ink}/>
  </>;
  if(world==="STAGE") return <>
    <div style={{position:"absolute",left:80,top:235,width:920,height:1100,borderRadius:"50% 50% 0 0",border:`7px solid ${c.ink}`,opacity:.24}}/>
    <div style={{position:"absolute",left:280,top:365,transform:`translateY(${Math.sin(frame/17)*7}px)`}}><Dancer frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 34%, rgba(255,255,255,.8), transparent 38%)",opacity:.7}}/>
    <div style={{position:"absolute",left:130,top:1320}}><Ghungroo frame={frame} color={c.ink}/></div>
  </>;
  if(world==="DUALITY") return <>
    <div style={{position:"absolute",left:35,top:330,opacity:.78,transform:"scale(.76)"}}><Dancer frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",right:35,top:600,opacity:.82,transform:"scale(.78)"}}><Boy frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",left:70,top:420,fontSize:180,fontWeight:900,color:c.ink,opacity:.09,writingMode:"vertical-rl"}}>TRADITION</div>
    <div style={{position:"absolute",right:65,top:430,fontSize:170,fontWeight:900,color:c.deep,opacity:.08,writingMode:"vertical-rl"}}>MODERN</div>
    <InkStroke frame={frame} color={c.ink} y={1230}/>
  </>;
  if(world==="SADHANA") return <>
    <div style={{position:"absolute",left:70,top:280,opacity:.35}}><Mudra frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",right:-40,top:230,transform:"scale(.72)",opacity:.92}}><Dancer frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",left:80,top:1060,fontSize:250,fontWeight:900,color:c.ink,opacity:.07}}>ताल</div>
    <InkStroke frame={frame} color={c.ink} y={1250} reverse/>
  </>;
  if(world==="HERITAGE") return <>
    <div style={{position:"absolute",left:95,top:250,width:890,height:1000,border:`8px solid ${c.ink}`,borderBottom:0,borderRadius:"470px 470px 0 0",opacity:.22}}/>
    <div style={{position:"absolute",left:285,top:365,transform:"scale(.7)",opacity:.92}}><Dancer frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",left:95,top:1280}}><Lotus frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",right:90,top:1320,fontSize:24,letterSpacing:5,color:c.ink,opacity:.65,writingMode:"vertical-rl"}}>GURU • TAPASYA • PARAMPARA</div>
  </>;
  if(world==="SLOWLOVE") return <>
    <div style={{position:"absolute",left:70,top:370,fontSize:240,fontWeight:900,color:c.ink,opacity:.06}}>FAST</div>
    <div style={{position:"absolute",right:80,top:390,fontSize:230,fontWeight:900,color:c.deep,opacity:.08}}>SLOW</div>
    <div style={{position:"absolute",left:275,top:520,transform:"scale(.65)",opacity:.9}}><Dancer frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",right:80,top:720,transform:"scale(.48)",opacity:.65}}><Boy frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",left:100,top:1230,width:880,height:8,background:c.ink,opacity:.25}}/>
    <div style={{position:"absolute",left:510,top:1180,width:8,height:110,background:c.ink,opacity:.65}}/>
  </>;
  if(world==="MYTH") return <>
    <div style={{position:"absolute",left:95,top:250,transform:"scale(1.15)",opacity:.78}}><Face frame={frame} color={c.ink} blush={c.blush} close/></div>
    <div style={{position:"absolute",right:65,top:330,fontSize:190,fontWeight:900,color:c.ink,opacity:.08,writingMode:"vertical-rl"}}>भावम</div>
    <div style={{position:"absolute",left:65,top:1200,fontSize:220,fontWeight:900,color:c.ink,opacity:.08}}>ॐ</div>
    <InkStroke frame={frame} color={c.ink} y={1330}/>
  </>;
  if(world==="POETRY") return <>
    <div style={{position:"absolute",right:-40,top:300,transform:"scale(.9)",opacity:.86}}><Face frame={frame} color={c.ink} blush={c.blush}/></div>
    <div style={{position:"absolute",left:80,top:440,fontSize:230,fontFamily:"Georgia,serif",fontStyle:"italic",color:c.ink,opacity:.1}}>LOVE</div>
    <div style={{position:"absolute",left:80,top:1110,transform:"scale(.75)"}}><Boy frame={frame} color={c.ink}/></div>
    <InkStroke frame={frame} color={c.ink} y={1220}/>
  </>;
  if(world==="PAUSE") return <>
    <div style={{position:"absolute",left:100,top:310,right:100,height:2,background:c.deep,opacity:.18}}/>
    <div style={{position:"absolute",left:120,top:420,fontSize:210,fontWeight:900,color:c.deep,opacity:.1}}>▶</div>
    <div style={{position:"absolute",left:160,top:720,fontSize:210,fontWeight:900,color:c.ink,opacity:.9,letterSpacing:-12}}>PAUSE</div>
    <div style={{position:"absolute",left:130,top:1050,right:130,height:2,background:c.deep,opacity:.2}}/>
    <div style={{position:"absolute",left:230,top:1120,transform:"scale(.52)",opacity:.48}}><Dancer frame={frame} color={c.ink}/></div>
  </>;
  if(world==="TIMELESS") return <>
    <div style={{position:"absolute",left:55,top:290,fontSize:240,fontWeight:900,color:c.ink,opacity:.07}}>TREND</div>
    <div style={{position:"absolute",right:60,top:430,fontSize:240,fontWeight:900,color:c.deep,opacity:.08}}>VIRAL</div>
    <div style={{position:"absolute",left:180,top:580,transform:"scale(.72)",opacity:.88}}><Face frame={frame} color={c.ink} blush={c.blush}/></div>
    <div style={{position:"absolute",left:80,top:1380,width:920,height:5,background:c.ink,opacity:.5}}/>
    <div style={{position:"absolute",left:75,top:1415,fontSize:22,letterSpacing:8,color:c.ink}}>TIMELESS — NOT TRENDING</div>
  </>;
  if(world==="PAYAL") return <>
    <div style={{position:"absolute",left:150,top:320,transform:"rotate(-9deg)",opacity:.95}}><Ghungroo frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",left:190,top:650,fontSize:170,fontFamily:"Georgia,serif",fontStyle:"italic",color:c.ink,opacity:.12}}>poetry</div>
    <InkStroke frame={frame} color={c.ink} y={940}/>
    <div style={{position:"absolute",right:10,top:930,transform:"scale(.52)",opacity:.62}}><Dancer frame={frame} color={c.ink}/></div>
  </>;
  if(world==="INSPIRATION") return <>
    <div style={{position:"absolute",left:80,top:270,fontSize:32,letterSpacing:8,color:c.ink,opacity:.72}}>WHO IS YOUR INSPIRATION?</div>
    <div style={{position:"absolute",left:190,top:560,transform:"scale(.76)",opacity:.92}}><Dancer frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",right:65,top:980,fontSize:190,fontWeight:900,color:c.ink,opacity:.08,writingMode:"vertical-rl"}}>मौन</div>
    <Petals frame={frame} color={c.ink} count={16}/>
  </>;
  if(world==="ABSENCE") return <>
    <div style={{position:"absolute",left:100,top:340,width:880,height:820,border:`2px solid ${c.ink}`,opacity:.22}}/>
    <div style={{position:"absolute",left:410,top:590,opacity:.2,transform:"scale(.42)"}}><Dancer frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",left:120,top:1240}}><Ghungroo frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",left:100,top:1500,width:880,height:1,background:c.ink,opacity:.2}}/>
  </>;
  return <>
    <div style={{position:"absolute",right:-40,top:220,transform:"scale(1.05)",opacity:.9}}><Face frame={frame} color={c.ink} blush={c.blush}/></div>
    <div style={{position:"absolute",left:60,top:870,transform:"scale(.52)",opacity:.7}}><Boy frame={frame} color={c.ink}/></div>
    <div style={{position:"absolute",left:125,top:1230}}><Ghungroo frame={frame} color={c.ink}/></div>
    <Petals frame={frame} color={c.ink} count={28}/>
  </>;
}

function Main() {
  const frame=useCurrentFrame();
  const idx=Math.max(0, starts.findIndex((s,i)=>frame>=s && frame<s+durations[i]));
  const local=frame-starts[idx];
  const dur=durations[idx];
  const t=clamp(local/dur);
  const world=sceneOf(idx);
  const c=COLORS[world];

  const intro=spring({frame:Math.min(local,24),fps:FPS,config:{damping:18,stiffness:110,mass:.65}});
  const exit=interpolate(local,[Math.max(0,dur-18),dur],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const phraseOpacity=clamp(intro)*exit;
  const cameraX=Math.sin(frame/80)*10;
  const cameraY=Math.sin(frame/97)*8;
  const captionSize=idx<4?62:idx>=52?68:54;
  const heroWords = [
    [0,"सफेद साड़ी"],[1,"आंखों में शांति"],[2,"रोशनी ठहर गई"],[3,"घुंघरू"],[4,"मुद्रा"],[7,"स्वैग भी झुकता"],
    [8,"साधना"],[9,"आराधना"],[12,"என் நெஞ்சம்"],[15,"காதல்"],[16,"इतिहास"],[20,"फास्ट लाइफ"],[21,"स्लो सा सुकून"],
    [24,"माइथोलॉजी"],[25,"साइकोलॉजी"],[28,"இधயம்"],[33,"पॉज"],[35,"मौजूदगी"],[37,"टाइमलेस"],[40,"पायल"],
    [43,"नाचती है मौन"],[47,"पूरी"],[49,"मनसु"],[51,"घुंघरू"],[55,"पूरी पोएट्री"]
  ] as Array<[number,string]>;
  const hero=heroWords.find(([i])=>i===idx)?.[1];

  return (
    <AbsoluteFill style={{background:c.paper,overflow:"hidden",fontFamily:"Noto Sans Devanagari, Noto Sans Tamil, Arial, sans-serif"}}>
      <Audio src="https://raw.githubusercontent.com/1rachit-tech/MY-LYRIC-VIDEO/main/lyric-video/song.mp3"/>
      <div style={{position:"absolute",inset:-30,transform:`translate(${cameraX}px,${cameraY}px)`,transformOrigin:"center"}}><World world={world} frame={frame} c={c}/></div>
      <Paper opacity={world==="PAUSE" ? .10 : .22}/>

      <div style={{position:"absolute",top:62,left:66,right:66,display:"flex",justifyContent:"space-between",alignItems:"center",color:c.ink,opacity:.78,fontSize:16,letterSpacing:4}}>
        <span>RACHIT RAM MUSIC</span>
        <span>BHARATANATYAM × POETRY</span>
      </div>

      {hero && (
        <div style={{position:"absolute",left:70,top:250,color:c.ink,opacity:.12,fontSize:175,fontWeight:900,letterSpacing:-8,maxWidth:900}}>
          {hero}
        </div>
      )}

      <div style={{position:"absolute",left:0,right:0,bottom:0,height:650,background:`linear-gradient(transparent, ${c.paper} 22%, ${c.paper} 100%)`}}/>
      <Caption text={LYRICS[idx]} color={c.ink} deep={c.deep} frame={local} align={idx%5===0?"left":"center"} size={captionSize}/>

      <div style={{position:"absolute",left:72,right:72,bottom:214,height:2,background:c.ink,opacity:.16}}>
        <div style={{width:`${t*100}%`,height:"100%",background:c.ink,opacity:.75}}/>
      </div>

      <div style={{position:"absolute",left:72,right:72,bottom:154,display:"flex",justifyContent:"space-between",fontSize:13,letterSpacing:4,color:c.ink,opacity:.55}}>
        <span>{String(idx+1).padStart(2,"0")} / 56</span>
        <span>{world}</span>
      </div>

      {idx>0 && (
        <div style={{position:"absolute",left:72,right:72,bottom:96,textAlign:"center",fontSize:18,color:c.deep,opacity:.24}}>
          {LYRICS[idx-1]}
        </div>
      )}
    </AbsoluteFill>
  );
}

export const MyComposition=()=>(
  <Composition id="MyComp" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H}/>
);
