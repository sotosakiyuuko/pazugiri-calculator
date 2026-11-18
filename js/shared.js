import {itemIcons} from "../data/item-icons.js";
import {uiAssets} from "./ui-assets.js";

export const art=(key,classes="")=>`<img class="ui-art ${classes}" src="${uiAssets[key]}" alt="" aria-hidden="true" decoding="async">`;
    export const main=document.querySelector("main");
    export const emptySelections=stage=>Array.from({length:stage==="1"?2:stage==="2"?4:stage==="3"?6:0},()=>({name:"",quantity:1}));
    export const state={dropSearch:"",selectedDrops:[],rarity:"",swordType:"",swordId:"",stage:"",manualStage:"",selections:[],owned:{},hideZero:true};
    export const esc=value=>String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"}[c]));
    export const route=()=>{const [name,query=""]=(location.hash.slice(1)||"home").split("?");return {name,params:new URLSearchParams(query)}};
    export const go=(name,params)=>location.hash=params&&params.toString()?name+"?"+params.toString():name;
    export const icon=(name,size="")=>itemIcons[name]?`<img class="item-icon ${size}" src="${itemIcons[name]}" alt="" aria-hidden="true">`:`<span class="item-icon-placeholder" aria-hidden="true"></span>`;
