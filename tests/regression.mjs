import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dropMaterials, recipes} from '../data/materials.js';
import {stages} from '../data/stages.js';
import {swords} from '../data/swords.js';
import {itemIcons} from '../data/item-icons.js';
import {uiAssets} from '../js/ui-assets.js';
import {calculateRequirements} from '../js/calculation.js';

const baseline=JSON.parse(readFileSync(new URL('./baseline.json',import.meta.url),'utf8'));
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const root=new URL('../',import.meta.url);

test('原版数据完整性：关卡、刀剑、素材、配方、图标',()=>{
  const values={stages,swords,dropMaterials,recipes,itemIcons};
  for(const [name,value] of Object.entries(values)){
    assert.equal(Object.keys(value).length,baseline.counts[name]);
    if(baseline.hashes[name])assert.equal(digest(value),baseline.hashes[name]);
  }
  assert.equal(new Set(swords.map(sword=>sword.id)).size,swords.length);
  assert.ok([...Object.values(itemIcons),...Object.values(uiAssets),'./assets/brand.png']
    .every(path=>existsSync(fileURLToPath(new URL(path,root)))));
});

test('多素材筛选使用交集',()=>{
  assert.deepEqual(stages.filter(stage=>['水','大豆'].every(name=>stage.drops.includes(name))).map(stage=>stage.id),
    ['1-9','1-17','3-17']);
});

test('贈物递归展开、已有材料缺口所用基础数量',()=>{
  const result=calculateRequirements([['臼と杵',2],['水',1]]);
  assert.deepEqual(result.unknown,[]);
  assert.deepEqual(Object.fromEntries(result.rows.filter(row=>row.required).map(row=>[row.name,row.required])),
    {'丸太':4,'水':5});
  const owned=6;
  assert.equal(Math.max(0,result.rows.find(row=>row.name==='水').required-owned),0);
  assert.deepEqual(calculateRequirements([['青の絵具',1]]).rows.filter(row=>row.required),[]);
});

test('全部 55 把刀剑的 165 个阶段与原版计算结果一致',()=>{
  const results=[];
  for(const sword of swords){
    for(const stage of sword.stages){
      const result=calculateRequirements(stage.materials);
      assert.deepEqual(result.unknown,[],`${sword.displayName} 第${stage.stage}阶段存在未知素材`);
      assert.ok(result.rows.every(row=>Number.isInteger(row.required)&&row.required>=0));
      results.push({id:sword.id,stage:stage.stage,
        rows:result.rows.filter(row=>row.required>0).map(row=>[row.name,row.required])});
    }
  }
  assert.equal(results.length,baseline.counts.stageResults);
  assert.equal(digest(results),baseline.hashes.stageResults);
});
