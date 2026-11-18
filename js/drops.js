import {dropMaterials} from "../data/materials.js";
import {stages} from "../data/stages.js";
import {art, esc, icon, main, state} from "./shared.js";

export const filtered=materials=>stages.filter(stage=>materials.every(material=>stage.drops.includes(material)));

export function drops(params){
      const incoming=params.get("materials");
      if(incoming!==null){state.selectedDrops=[...new Set(incoming.split(",").filter(x=>dropMaterials.includes(x)))];history.replaceState(null,"","#drops")}
      const selected=state.selectedDrops,available=dropMaterials.filter(x=>x.includes(state.dropSearch)),results=filtered(selected);
      main.innerHTML=`<section class="page-head"><div><p class="eyebrow">素材关卡查询</p><div class="illustrated-title"><h1>按素材找关卡</h1>${art("boat","heading-art")}</div><p>多选时只显示<strong>同时</strong>掉落全部已选素材的关卡。未选择素材时展示全部关卡。</p></div><button class="button ghost" id="clear">清除筛选</button></section><section class="tool-layout"><aside class="panel" aria-label="筛选素材"><h2>选择目标素材</h2><p class="panel-note">已选择 ${selected.length} 项。输入名称可快速查找。</p><div class="tag-list">${selected.length?selected.map(x=>`<span class="tag">${icon(x,"small")}${esc(x)} <button data-remove="${esc(x)}" aria-label="移除 ${esc(x)}">×</button></span>`).join(""):'<span class="panel-note">尚未选择素材</span>'}</div><label class="section-label" for="search">全部可查询素材</label><div class="material-picker"><input id="search" value="${esc(state.dropSearch)}" placeholder="输入素材名称" autocomplete="off"><div class="options">${available.map(x=>`<button type="button" class="option" data-option="${esc(x)}" aria-pressed="${selected.includes(x)}"><span class="option-main">${icon(x)}<span>${esc(x)}</span></span><span>${selected.includes(x)?"已选":"选择"}</span></button>`).join("")||'<p class="empty">没有匹配的素材名称</p>'}</div></div></aside><section class="panel" aria-live="polite"><div class="result-head"><h2>符合条件的关卡</h2><span class="result-count">${results.length} 个</span></div><p class="panel-note">红色标签为你的目标素材。关卡数据未包含体力消耗、掉落数量或概率。</p><div class="stage-list">${results.length?results.map(s=>`<article class="stage-card"><div class="stage-card-top"><span class="stage-id">${s.id}</span><span class="matches">命中 ${selected.length||s.drops.length} 项目标</span></div><ul class="drop-list">${s.drops.map(x=>`<li class="${selected.includes(x)?"match":""}">${icon(x,"small")}${esc(x)}</li>`).join("")}</ul></article>`).join(""):'<p class="empty">没有关卡能够同时掉落目前选择的素材。请减少筛选条件后重试。</p>'}</div></section></section>`;
      const search=document.querySelector("#search");
      search.oninput=e=>{const position=e.target.selectionStart;state.dropSearch=e.target.value.trim();drops(new URLSearchParams());const next=document.querySelector("#search");next.focus();next.setSelectionRange(position,position)};
      document.querySelectorAll("[data-option]").forEach(button=>button.onclick=()=>{const x=button.dataset.option;state.selectedDrops=selected.includes(x)?selected.filter(y=>y!==x):[...selected,x];drops(new URLSearchParams())});
      document.querySelectorAll("[data-remove]").forEach(button=>button.onclick=()=>{state.selectedDrops=selected.filter(x=>x!==button.dataset.remove);drops(new URLSearchParams())});
      document.querySelector("#clear").onclick=()=>{state.selectedDrops=[];state.dropSearch="";drops(new URLSearchParams())};
    }
