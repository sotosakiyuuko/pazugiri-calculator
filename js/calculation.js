import {dropMaterials, recipes} from "../data/materials.js";

export function expand(name,quantity,total,stack=[]){
      if(name==="小判")return;
      if(stack.includes(name))throw new Error(`配方循环：${[...stack,name].join(" → ")}`);
      if(Object.prototype.hasOwnProperty.call(recipes,name)){
        Object.entries(recipes[name]).forEach(([part,amount])=>expand(part,quantity*amount,total,[...stack,name]));
        return;
      }
      total[name]=(total[name]||0)+quantity;
    }

export function calculateRequirements(inputs){
  const total={};
  inputs.forEach(([name,quantity])=>{if(name&&Number(quantity)>0)expand(name,Number(quantity),total)});
  const unknown=Object.keys(total).filter(name=>!dropMaterials.includes(name));
  const rows=dropMaterials.map(name=>({name,required:total[name]||0}));
  return {rows,unknown};
}
