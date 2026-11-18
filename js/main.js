import {uiAssets} from "./ui-assets.js";
import {art, route} from "./shared.js";
import {home, about} from "./pages.js";
import {drops} from "./drops.js";
import {calculator} from "./calculator.js";

document.querySelector("#site-favicon").href=document.querySelector(".brand-logo").src;
function render(){const current=route();if(current.name==="drops")drops(current.params);else if(current.name==="calculator")calculator();else if(current.name==="about")about();else home()}
    const cornerArt=document.createElement("div");cornerArt.className="page-corner-art";cornerArt.setAttribute("aria-hidden","true");cornerArt.innerHTML=art("midare","corner-midare")+art("mission","corner-fox")+art("food","corner-food");document.body.appendChild(cornerArt);
    for(const [name,key] of [["midare","midare"],["food","food"],["boat","boat"]])document.documentElement.style.setProperty(`--decoration-${name}`,`url("${new URL(uiAssets[key],document.baseURI).href}")`);
    window.addEventListener("hashchange",render);render();
