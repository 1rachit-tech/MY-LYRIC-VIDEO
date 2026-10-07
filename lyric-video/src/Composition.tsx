import React from "react";
import {AbsoluteFill, Audio, Composition, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";

const FPS = 30;
const DURATION = 900;
const W = 1080;
const H = 1920;

const scenes = [
  {start:0,end:120,zoom:[1.02,1.10],x:["50%","56%"],y:["50%","46%"],title:"Soneya",sub:"एक दिल, एक याद, एक हमसफ़र…"},
  {start:120,end:255,zoom:[1.08,1.18],x:["58%","67%"],y:["47%","42%"],title:"सफेद साड़ी",sub:"माथे पे चंदन • आंखों में शांति"},
  {start:255,end:405,zoom:[1.10,1.25],x:["45%","35%"],y:["45%","50%"],title:"रोशनी ठहर गई",sub:"स्टेज पे उतरी…"},
  {start:405,end:555,zoom:[1.14,1.30],x:["52%","46%"],y:["58%","65%"],title:"घुंघरू",sub:"मेरी हार्टबीट बढ़ गई"},
  {start:555,end:720,zoom:[1.08,1.20],x:["62%","54%"],y:["44%","48%"],title:"मुद्रा",sub:"हाथों की मुद्रा बोले पुरानी कथा"},
  {start:720,end:900,zoom:[1.06,1.16],x:["52%","60%"],y:["48%","45%"],title:"हर भाव में",sub:"छुपा कोई देव प्रथा"},
] as const;

const scene = (frame:number) => scenes.findIndex(s => frame >= s.start && frame < s.end);

function PhotoScene({data}:{data:(typeof scenes)[number]}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - data.start;
  const length = data.end - data.start;
  const p = Math.min(1, Math.max(0, local / length));
  const eased = p * p * (3 - 2 * p);
  const zoom = interpolate(eased,[0,1],data.zoom);
  const x = interpolate(eased,[0,1],[parseFloat(data.x[0]),parseFloat(data.x[1])]);
  const y = interpolate(eased,[0,1],[parseFloat(data.y[0]),parseFloat(data.y[1])]);
  const enter = interpolate(local,[0,18],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const exit = interpolate(local,[length-18,length],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});

  return (
    <AbsoluteFill style={{opacity:enter*exit,background:"#160b10"}}>
      <Img
        src={staticFile("bg1.jpg")}
        style={{
          position:"absolute",
          width:"100%",
          height:"100%",
          objectFit:"cover",
          objectPosition:`${x}% ${y}%`,
          transform:`scale(${zoom})`,
          transformOrigin:"center center",
          filter:"saturate(1.05) contrast(1.02)",
        }}
      />
      <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(12,5,10,.28) 0%,rgba(12,5,10,0) 35%,rgba(12,5,10,.68) 100%)"}} />
      <div style={{position:"absolute",top:72,left:64,right:64,display:"flex",justifyContent:"space-between",color:"#fff",fontSize:16,fontWeight:700,letterSpacing:4,textShadow:"0 2px 12px rgba(0,0,0,.5)"}}>
        <span>RACHIT RAM MUSIC</span><span>SONEYA JO</span>
      </div>
      <div style={{position:"absolute",left:65,right:65,bottom:190,color:"#fff",textAlign:"center",textShadow:"0 4px 20px rgba(0,0,0,.65)"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:data.title==="Soneya"?108:68,fontWeight:800,fontStyle:data.title==="Soneya"?"italic":"normal",letterSpacing:data.title==="Soneya"?-4:0}}>{data.title}</div>
        <div style={{marginTop:18,fontSize:30,fontWeight:600,letterSpacing:1.5}}>{data.sub}</div>
      </div>
      <div style={{position:"absolute",left:72,right:72,bottom:110,height:3,background:"rgba(255,255,255,.3)"}}>
        <div style={{width:`${p*100}%`,height:"100%",background:"#f05b87"}} />
      </div>
    </AbsoluteFill>
  );
}

function Main() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background:"#160b10",fontFamily:"Arial,'Noto Sans Devanagari',sans-serif"}}>
      <Audio src="https://raw.githubusercontent.com/1rachit-tech/MY-LYRIC-VIDEO/main/lyric-video/song.mp3" />
      {scenes.map((s,i)=>
        <Sequence key={i} from={s.start} durationInFrames={s.end-s.start}>
          <PhotoScene data={s}/>
        </Sequence>
      )}
      <div style={{position:"absolute",left:0,right:0,bottom:0,height:4,background:"rgba(240,91,135,.85)",transform:`scaleX(${(frame+1)/DURATION})`,transformOrigin:"left"}} />
    </AbsoluteFill>
  );
}

export const MyComposition = () => (
  <Composition id="MyComp" component={Main} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
