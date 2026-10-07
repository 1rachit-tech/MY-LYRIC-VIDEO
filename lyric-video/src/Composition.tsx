import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  interpolate,
  spring,
  staticFile,
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
  "उन कण्णु पेसुम मोझियिल एन वार्च्ताई तोलैन्जிடு","नी आडुम अंध नोडियिल एन कादल பిరांனிடுது",
  "टूरिल्स के लिए नहीं, इतिहास के लिए नाच","तेरे हर घूम में संस्कृति झलकी",
  "तेरे गुरु की मेहनत, तेरी तपस्या","तेरे पांव छुए जमीन, लगे आस्था",
  "मैं फास्ट लाइफ, तू स्लो सा सुकून","तेरे पास आके शोर भी हो जाए मून",
  "तू कम बोले पर भाव हजार","तेरी साइलेंस भी बोले लाइक सितार",
  "तेरे काजल में माइथोलॉजी","तेरे एक्सप्रेशंस होल साइकोलॉजी",
  "मैं लिखता बार्ड्स, तू रचती भावम","दोनों मिलके बचाते विरासत का नावात",
  "कोलोसस सथम केक्कुदु एन इधयम मेल्डावुदु","नी आडुकिर अझगुला एन उलकम स्लो आगुदु",
  "मुत्थुरैयिल कादल इरुक्कु उन सिरिप्पु मेजिकु","भरत नाट्यम पोन्नु नी एन वाळக்கैयोड மியूसிக",
  "आजकल प्यार भी फास्ट फॉरवर्ड पर","तू है पॉज बटन ऑन रिकॉर्ड",
  "तेरे साथ बैठ के खामोशी भी गीत","तेरी मौजूदगी ही मेरी जीत",
  "ना तू ट्रेंड है, ना तू वायरल","तू टाइमलेस है, तू फाइनल",
  "जहां फिल्टर्स खत्म वहां से तू शुरू","तेरा आर्ट बोले मैं खुद में भरपूर",
  "तेरे पायल की एक झनकार में","मेरी सारी कविता आ जाए आकार में",
  "अगर दुनिया पूछे इंस्पिरेशन कौन","मैं कहूं वो, जो नाचती है मौन",
  "नी आडुकिर नाळ पोधुमे एन वाळक्कै पूरणமே","भरतनाट्यम अझगिनी एन कादल जीवने",
  "कोलोसस सथम पोलदान उन ஞாபகம் வரूदु","नी पक्कतुल इल्लन्नालुम एन मनसु तेदुते",
  "तेरा नाच, मेरा सुकून है","नी इल्ला वे नान इल्ला",
  "माइक बंद हो जाए, स्टेज खाली रहे","पर तेरे घुंघरू दिल में हमेशा बजे",
  "यह रैप खत्म, पर अहसास नहीं","भरतनाट्यम वाली लड़की",
  "तू सिर्फ इंस्पिरेशन नहीं","तू मेरी पूरी पोएट्री है",
] as const;

const weights = LYRICS.map((x) => Math.max(16, x.replace(/\s/g,"").length));
const totalWeight = weights.reduce((a,b)=>a+b,0);
const durations = weights.map((x)=>Math.round(x/totalWeight*DURATION));
durations[durations.length-1] += DURATION-durations.reduce((a,b)=>a+b,0);
const starts = durations.reduce<number[]>((a,d,i)=>{
  a.push(i===0?0:a[i-1]+durations[i-1]); return a;
},[]);

const clamp = (x:number)=>Math.max(0,Math.min(1,x));
const sceneOf=(i:number)=>{
  if(i<4) return "DAWN_STAGE";
  if(i<8) return "TRADITION_VS_MODERN";
  if(i<12) return "INK_AND_RHYTHM";
  if(i<16) return "TEMPLE_DREAM";
  if(i<20) return "HERITAGE";
  if(i<24) return "SLOW_WORLD";
  if(i<28) return "MYTHOLOGY";
  if(i<32) return "HEART_RECORD";
  if(i<36) return "PAUSE";
  if(i<40) return "TIMELESS";
  if(i<44) return "PAYAL";
  if(i<48) return "INSPIRATION";
  if(i<52) return "ABSENCE";
  return "FINALE";
};

const palette:Record<string,[string,string,string]>={
 DAWN_STAGE:["#120e13","#c69b63","#fff4dc"],
 TRADITION_VS_MODERN:["#07090d","#d7ad70","#f6efe2"],
 INK_AND_RHYTHM:["#11100e","#b85d38","#fff6e6"],
 TEMPLE_DREAM:["#08070b","#d7a45b","#f8e9cf"],
 HERITAGE:["#16120c","#a8793d","#f5ead5"],
 SLOW_WORLD:["#07090b","#d9b36b","#f4efe6"],
 MYTHOLOGY:["#0a0810","#9c6bd1","#f7efff"],
 HEART_RECORD:["#12090d","#c95858","#fff0e7"],
 PAUSE:["#050608","#aeb4bf","#f4f4f0"],
 TIMELESS:["#090909","#d6b06e","#fff9ee"],
 PAYAL:["#0a0807","#e0b765","#fff7e4"],
 INSPIRATION:["#090b0d","#d49c58","#fff1db"],
 ABSENCE:["#030406","#8d9aaa","#e7edf5"],
 FINALE:["#19070a","#b53d42","#fff1e6"],
};

function Dancer({frame,accent}:{frame:number;accent:string}){
 const sway=Math.sin(frame/22)*7;
 const arm=Math.sin(frame/18)*10;
 return <svg viewBox="0 0 420 720" style={{width:430,height:720,overflow:"visible"}}>
   <defs><linearGradient id="dress" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf7"/><stop offset=".7" stopColor="#d9d0c5"/><stop offset="1" stopColor="#8c7d73"/></linearGradient></defs>
   <g transform={`translate(${sway},0)`}>
    <circle cx="210" cy="105" r="52" fill="#d7a98b"/>
    <path d="M162 105 Q210 42 260 105 L250 75 Q205 32 168 72Z" fill="#191512"/>
    <circle cx="210" cy="106" r="6" fill={accent}/><circle cx="235" cy="106" r="6" fill={accent}/>
    <path d="M170 162 Q210 135 250 162 L300 370 Q210 450 120 370Z" fill="url(#dress)" stroke="#fff" strokeWidth="3"/>
    <path d="M120 370 Q210 430 300 370 L350 540 Q210 620 70 540Z" fill="url(#dress)" opacity=".95"/>
    <path d={`M170 190 Q95 ${150+arm} 48 240`} fill="none" stroke="#d7a98b" strokeWidth="20" strokeLinecap="round"/>
    <path d={`M250 190 Q325 ${155-arm} 372 240`} fill="none" stroke="#d7a98b" strokeWidth="20" strokeLinecap="round"/>
    <circle cx="48" cy="240" r="15" fill="#d7a98b"/><circle cx="372" cy="240" r="15" fill="#d7a98b"/>
    <path d="M155 520 L112 675" stroke="#d7a98b" strokeWidth="22" strokeLinecap="round"/>
    <path d="M265 520 L310 675" stroke="#d7a98b" strokeWidth="22" strokeLinecap="round"/>
    <path d="M92 675 Q110 690 135 678" fill="none" stroke="#d7a98b" strokeWidth="13"/>
    <path d="M290 678 Q315 690 340 675" fill="none" stroke="#d7a98b" strokeWidth="13"/>
    {Array.from({length:6}).map((_,i)=><circle key={i} cx={90+i*52} cy={545+(i%2)*10} r="5" fill={accent} opacity=".75"/>)}
   </g>
 </svg>
}

function Arch({accent,frame}:{accent:string;frame:number}){
 const rot=Math.sin(frame/70)*1.5;
 return <svg viewBox="0 0 700 850" style={{width:760,height:900,transform:`rotate(${rot}deg)`}}>
  <path d="M70 820 V330 Q350 45 630 330 V820" fill="none" stroke={accent} strokeWidth="18"/>
  <path d="M130 820 V350 Q350 120 570 350 V820" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="3"/>
  <path d="M210 820 V400 Q350 240 490 400 V820" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2"/>
  <circle cx="350" cy="330" r="95" fill="none" stroke={accent} strokeWidth="3" opacity=".45"/>
 </svg>
}

function Ghungroo({frame,accent}:{frame:number;accent:string}){
 return <svg viewBox="0 0 600 250" style={{width:620,height:260}}>
  <path d="M40 120 Q300 40 560 120" fill="none" stroke="#d8c8a7" strokeWidth="18"/>
  {Array.from({length:11}).map((_,i)=>{
   const x=55+i*49; const y=120+Math.sin(frame/9+i)*12;
   return <g key={i}><circle cx={x} cy={y+42} r="22" fill={accent}/><circle cx={x} cy={y+42} r="8" fill="#fff1bd"/></g>
  })}
 </svg>
}

function InkLine({frame,accent}:{frame:number;accent:string}){
 const p=interpolate(frame%100,[0,70,100],[0,1,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <svg viewBox="0 0 1000 220" style={{position:"absolute",width:"100%",height:220,left:0,top:900}}>
   <path d="M30 110 C220 10 330 200 500 105 S780 20 970 120" fill="none" stroke={accent} strokeWidth="7" strokeDasharray="1000" strokeDashoffset={1000*p}/>
 </svg>
}

function Grain({opacity=.12}:{opacity?:number}){
 return <div style={{position:"absolute",inset:0,opacity,backgroundImage:"radial-gradient(rgba(255,255,255,.7) .6px,transparent .7px)",backgroundSize:"5px 5px",mixBlendMode:"screen"}}/>
}

function Main(){
 const frame=useCurrentFrame();
 const idx=Math.max(0,starts.findIndex((s,i)=>frame>=s && frame<s+durations[i]));
 const start=starts[idx]; const dur=durations[idx]; const local=frame-start;
 const t=clamp(local/dur);
 const scene=sceneOf(idx); const [bg,accent,fg]=palette[scene];
 const inP=spring({frame:Math.min(local,24),fps:FPS,config:{damping:18,stiffness:110,mass:.7}});
 const outP=interpolate(local,[Math.max(0,dur-18),dur],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const opacity=clamp(inP)*outP;
 const prev=idx>0?LYRICS[idx-1]:""; const next=idx<LYRICS.length-1?LYRICS[idx+1]:"";
 const words=LYRICS[idx].split(" ");
 const dominant=idx%3===0 || [2,3,8,11,16,20,24,29,33,37,41,45,49,53,55].includes(idx);
 const x=interpolate(Math.sin(frame/90),[-1,1],[-45,45]);
 const scale=1+Math.sin(frame/17)*.008;

 return <AbsoluteFill style={{background:bg,color:fg,fontFamily:"Noto Sans Devanagari, Noto Sans Tamil, Arial, sans-serif",overflow:"hidden"}}>
   <Audio src={staticFile("song.mp3")}/>
   <div style={{position:"absolute",inset:-120,background:`radial-gradient(circle at ${50+x/3}% 40%, ${accent}26 0%, transparent 42%), radial-gradient(circle at 80% 90%, ${accent}16, transparent 35%)`}}/>
   <Grain opacity={scene==="PAUSE"?.07:.13}/>
   <div style={{position:"absolute",inset:0,background:"linear-gradient(115deg,transparent 0%,rgba(255,255,255,.035) 48%,transparent 52%)",transform:`translateX(${Math.sin(frame/55)*180}px)`}}/>
   
   <div style={{position:"absolute",top:72,left:70,right:70,display:"flex",justifyContent:"space-between",fontSize:18,letterSpacing:5,opacity:.65}}>
     <span>RACHIT RAM / VISUAL POETRY</span><span>0{idx+1} — {scene.replace("_"," ")}</span>
   </div>

   {(scene==="DAWN_STAGE"||scene==="TEMPLE_DREAM"||scene==="HERITAGE") && <div style={{position:"absolute",left:160,top:260,opacity:.34,transform:`translateX(${x}px) scale(.9)`}}><Arch accent={accent} frame={frame}/></div>}
   {(scene==="DAWN_STAGE"||scene==="HERITAGE"||scene==="PAYAL") && <div style={{position:"absolute",left:325,top:430,opacity:.9,transform:`translateY(${Math.sin(frame/14)*8}px) scale(.82)`}}><Dancer frame={frame} accent={accent}/></div>}
   {(scene==="DAWN_STAGE"||scene==="PAYAL") && <div style={{position:"absolute",left:240,top:1140,opacity:.85}}><Ghungroo frame={frame} accent={accent}/></div>}
   {(scene==="INK_AND_RHYTHM"||scene==="TRADITION_VS_MODERN"||scene==="HEART_RECORD") && <InkLine frame={frame} accent={accent}/>}
   
   {scene==="TRADITION_VS_MODERN" && <div style={{position:"absolute",right:-70,top:310,fontSize:230,fontWeight:900,letterSpacing:-15,opacity:.08,writingMode:"vertical-rl"}}>SWAG</div>}
   {scene==="MYTHOLOGY" && <div style={{position:"absolute",left:90,top:270,fontSize:420,lineHeight:.8,fontWeight:900,color:accent,opacity:.09}}>ॐ</div>}
   {scene==="TIMELESS" && <div style={{position:"absolute",left:70,top:340,fontSize:280,fontWeight:900,letterSpacing:-15,opacity:.06}}>TIME</div>}
   {scene==="PAUSE" && <div style={{position:"absolute",left:90,top:420,right:90,height:1,background:"#fff",opacity:.18}}/>}
   {scene==="FINALE" && <div style={{position:"absolute",inset:250,border:"1px solid rgba(255,255,255,.16)",transform:`rotate(${Math.sin(frame/100)*1.2}deg)`}}/>}

   <div style={{position:"absolute",left:72,right:72,top:dominant?720:790,opacity,transform:`translateY(${interpolate(inP,[0,1],[70,0])}px) scale(${scale})`}}>
     <div style={{fontSize:16,letterSpacing:4,textTransform:"uppercase",color:accent,marginBottom:22,opacity:.9}}>
       {idx===0?"OPENING FRAME":idx===LYRICS.length-1?"FINAL POETRY":"LYRIC / "+String(idx+1).padStart(2,"0")}
     </div>
     <div style={{fontSize:dominant?72:58,fontWeight:800,lineHeight:1.22,letterSpacing:dominant?-2:-1,textAlign:dominant?"left":"center",textShadow:`0 12px 38px ${bg}`}}>
       {words.map((w,i)=>{
         const wp=spring({frame:Math.max(0,local-i*3),fps:FPS,config:{damping:16,stiffness:140,mass:.5}});
         return <span key={i} style={{display:"inline-block",marginRight:15,opacity:interpolate(wp,[0,1],[.18,1]),transform:`translateY(${interpolate(wp,[0,1],[22,0])}px)`}}>{w}</span>
       })}
     </div>
     <div style={{marginTop:28,width:170,height:3,background:accent,transformOrigin:"left",transform:`scaleX(${interpolate(t,[0,.2,1],[.2,1,.45])})`}}/>
   </div>

   {idx>0 && <div style={{position:"absolute",bottom:255,left:72,right:72,fontSize:21,opacity:.22,textAlign:"center",letterSpacing:.5}}>{prev}</div>}
   <div style={{position:"absolute",bottom:105,left:72,right:72,height:3,background:"rgba(255,255,255,.12)"}}>
     <div style={{width:`${frame/DURATION*100}%`,height:"100%",background:accent}}/>
   </div>
   <div style={{position:"absolute",bottom:55,left:72,right:72,display:"flex",justifyContent:"space-between",fontSize:14,letterSpacing:3,opacity:.45}}>
     <span>BHARATANATYAM × POETRY</span><span>{String(idx+1).padStart(2,"0")} / {String(LYRICS.length).padStart(2,"0")}</span>
   </div>
 </AbsoluteFill>
}

export const MyComposition=()=> <Composition id="MyComp" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H}/>;
