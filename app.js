const sections=[...document.querySelectorAll('.story section')];const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('aside a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}})},{rootMargin:'-10% 0px -65% 0px'});sections.forEach(s=>observer.observe(s));

// Values match the paper's six-panel comparison figure; missing models stay unreported.
const modelNames={a122:'Axion 1.0-122B',a35:'Axion 1.0-35B',fable:'Claude Fable 5',opus:'Claude Opus 5',muse:'Muse-Spark-1.0',astra:'GPT-6 Astra',apoteam:'Apodex 1.1 (Agent Team)',aporen:'Apodex 1.1 (ReAct)',sol:'GPT-5.6 Sol',g55:'GPT-5.5',gemini:'Gemini 3.1 Pro',agents:'Agents-A1',deep:'DeepSeek-V4 Pro Preview',kimi:'Kimi-K2.6'};
const shortNames={a122:'Axion 1.0<br>122B',a35:'Axion 1.0<br>35B',fable:'Claude<br>Fable 5',opus:'Claude<br>Opus 5',muse:'Muse-<br>Spark-1.0',astra:'GPT-6<br>Astra',apoteam:'Apodex 1.1<br>Agent Team',aporen:'Apodex 1.1<br>ReAct',sol:'GPT-5.6<br>Sol',g55:'GPT-5.5',gemini:'Gemini<br>3.1 Pro',agents:'Agents-<br>A1',deep:'DeepSeek-V4<br>Pro Preview',kimi:'Kimi-<br>K2.6'};
const chartData=[
 {name:'Humanity’s Last Exam',subtitle:'General reasoning and search',min:35,values:[['fable',63.8],['opus',63.6],['a122',59.0],['muse',58],['astra',57.2],['apoteam',56.1],['a35',52.2]]},
 {name:'BioMysteryBench',subtitle:'Scientific research / human-difficult',values:[['opus',49.4],['sol',47.1],['fable',46.1],['a122',41.7],['a35',35.3],['apoteam',35.3],['gemini',35.3]]},
 {name:'SEAL-0',subtitle:'Agentic problem solving',values:[['a35',62.2],['a122',58.6],['agents',56.4],['deep',55],['gemini',53.2],['sol',53.2],['kimi',50.5]]},
 {name:'HiPhO',subtitle:'Scientific reasoning',values:[['agents',46.4],['a122',46.2],['a35',45.7],['g55',43.3],['sol',42.9],['kimi',41.1],['deep',38.7]]},
 {name:'FrontierScience Olympiad',subtitle:'Scientific olympiad',values:[['a122',87],['a35',86],['gemini',85],['agents',79],['sol',79],['g55',78],['deep',76]]},
 {name:'FrontierScience Research',subtitle:'Scientific research',values:[['a122',66.7],['apoteam',63.3],['sol',63.3],['a35',56.7],['aporen',55],['agents',40],['muse',38]]}
];
const chartRoot=document.querySelector('#benchmark-charts');
chartRoot.innerHTML=chartData.map((chart,i)=>{const min=chart.min??0,max=Math.max(...chart.values.map(v=>v[1]));return `<article class="benchmark-chart"><h3>${chart.name}</h3><p class="chart-subtitle">${chart.subtitle}</p><div class="chart-current" data-chart="${i}"></div><div class="bar-plot">${chart.values.map(([id,v])=>`<button class="data-column ${id==='a122'?'axion122':id==='a35'?'axion35':''}" data-model-id="${id}" style="--bar-height:${(v-min)/(max-min)*120}px" aria-label="${modelNames[id]}: ${v.toFixed(1)}% on ${chart.name}" aria-pressed="false"><span class="bar-space"><span class="bar-score">${v.toFixed(1)}</span><span class="data-bar"></span></span><span class="bar-name">${shortNames[id]}</span></button>`).join('')}</div></article>`}).join('');
let pinnedModel=null;
const clearButton=document.querySelector('#clear-model');
function highlightModel(id){chartRoot.classList.toggle('has-highlight',!!id);chartRoot.querySelectorAll('[data-model-id]').forEach(button=>{button.classList.toggle('is-highlighted',button.dataset.modelId===id);button.setAttribute('aria-pressed',String(button.dataset.modelId===pinnedModel))});chartRoot.querySelectorAll('[data-chart]').forEach(label=>{const chart=chartData[Number(label.dataset.chart)],value=chart.values.find(v=>v[0]===id);label.textContent=id?`${modelNames[id]} · ${value?value[1].toFixed(1)+'%':'Not reported in this comparison'}`:''});clearButton.disabled=!id;document.querySelector('#model-selection').textContent=id?`${modelNames[id]} highlighted across all benchmarks${pinnedModel===id?' · Selection pinned':''}`:'Blue: Axion 1.0-122B · Teal: Axion 1.0-35B · Gray: comparison models';}
chartRoot.querySelectorAll('[data-model-id]').forEach(button=>{const id=button.dataset.modelId;button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')highlightModel(id)});button.addEventListener('pointerleave',()=>highlightModel(pinnedModel));button.addEventListener('focus',()=>highlightModel(id));button.addEventListener('blur',()=>highlightModel(pinnedModel));button.addEventListener('click',()=>{pinnedModel=pinnedModel===id?null:id;highlightModel(pinnedModel)})});
clearButton.addEventListener('click',()=>{pinnedModel=null;highlightModel(null)});chartRoot.addEventListener('keydown',e=>{if(e.key==='Escape'){pinnedModel=null;highlightModel(null)}});


// Scores transcribed from the manuscript's training-stage table.
const stageBenchmarks=[
 {name:'HLE-130',note:'130-question text-only subset',a:[47.7,59.2,66.2,70.0],b:[40.8,68.5,68.5,74.6]},
 {name:'BioMysteryBench',note:'Human-difficult subset',a:[23.5,17.6,35.3,35.3],b:[17.6,29.4,35.3,41.7]},
 {name:'SEAL-0',note:'Information seeking',a:[44.1,50.5,53.2,62.2],b:[47.8,52.3,53.2,58.6]},
 {name:'HiPhO',note:'Full benchmark',a:[38.6,45.9,46.8,45.7],b:[30.6,45.6,45.8,46.2]},
 {name:'FrontierScience Olympiad',note:'Olympiad split',a:[71.0,83.0,84.0,86.0],b:[65.0,85.0,86.0,87.0]},
 {name:'FrontierScience Research',note:'Research split',a:[26.7,48.3,58.3,56.7],b:[40.0,56.7,65.0,66.7]}
];
const trainingStages=['Base','SFT I','SFT II','+ RL'];
function trainingAxis(){const b=stageBenchmarks[currentStageBenchmark],values=[...b.a,...b.b],low=Math.min(...values),high=Math.max(...values),span=high-low,step=span>30?10:5,pad=Math.max(1,span*.08),min=Math.max(0,Math.floor((low-pad)/step)*step),max=Math.min(100,Math.ceil((high+pad)/step)*step);return {min,max,ticks:Array.from({length:Math.round((max-min)/step)+1},(_,i)=>min+i*step)}}
const stageX=i=>55+i*130,stageY=v=>{const axis=trainingAxis();return 205-(v-axis.min)/(axis.max-axis.min)*170};
const trainingRoot=document.querySelector('#progress');
let currentStageBenchmark=0,currentTrainingStage=3;
const benchmarkTabNames=['HLE-130','BMB','SEAL-0','HiPhO','FS Olympiad','FS Research'];
trainingRoot.innerHTML=`<div class="benchmark-tabs" role="tablist" aria-label="Benchmark">${stageBenchmarks.map((b,i)=>`<button role="tab" id="benchmark-tab-${i}" data-benchmark-tab="${i}" aria-label="${b.name}" title="${b.name}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" aria-controls="training-chart-content">${benchmarkTabNames[i]}</button>`).join('')}</div><p id="training-benchmark-note" class="benchmark-context"></p><div id="training-chart-content" role="tabpanel" aria-labelledby="benchmark-tab-0"></div>`;
function renderTrainingBenchmark(){const benchmark=stageBenchmarks[currentStageBenchmark],scores=[benchmark.a,benchmark.b];document.querySelector('#training-benchmark-note').textContent=benchmark.name+' · '+benchmark.note+' · Y-axis adapts to this benchmark';trainingRoot.querySelectorAll('[data-benchmark-tab]').forEach(b=>{const selected=Number(b.dataset.benchmarkTab)===currentStageBenchmark;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1});document.querySelector('#training-chart-content').setAttribute('aria-labelledby','benchmark-tab-'+currentStageBenchmark);document.querySelector('#training-chart-content').innerHTML=`<div class="training-legend"><span><i class="line35"></i>Axion 1.0-35B</span><span><i class="line122"></i>Axion 1.0-122B</span></div><svg class="training-svg" viewBox="0 0 500 240" role="group" aria-label="${benchmark.name} accuracy across training stages"><text x="8" y="16" class="axis-title">Score (%)</text>${trainingAxis().ticks.map(v=>`<line x1="45" x2="465" y1="${stageY(v)}" y2="${stageY(v)}" class="training-grid"/><text x="32" y="${stageY(v)+3}" class="axis-label" text-anchor="end">${v}</text>`).join('')}<line id="stage-guide" x1="445" x2="445" y1="30" y2="205"/>${scores.map((values,m)=>`<polyline class="training-line ${m?'line122':'line35'}" points="${values.map((v,i)=>`${stageX(i)},${stageY(v)}`).join(' ')}"/>`).join('')}${scores.map((values,m)=>values.map((v,i)=>`<g data-stage-point="${i}" role="button" tabindex="0" aria-label="${m?'122B':'35B'}, ${trainingStages[i]}, ${v.toFixed(1)} percent"><circle cx="${stageX(i)}" cy="${stageY(v)}" r="13" fill="transparent"/><circle class="training-point ${m?'line122':'line35'}" cx="${stageX(i)}" cy="${stageY(v)}" r="4.5"/></g>`).join('')).join('')}${trainingStages.map((name,i)=>`<text x="${stageX(i)}" y="228" class="stage-axis" text-anchor="middle">${name}</text>`).join('')}</svg><div class="stage-buttons" role="group" aria-label="Select training stage">${trainingStages.map((name,i)=>`<button data-training-stage="${i}" aria-pressed="false">${name}</button>`).join('')}</div><div class="training-readout" aria-live="polite"><strong id="stage-readout-title"></strong><span class="score35" id="stage-score35"></span><span class="score122" id="stage-score122"></span></div>`;
trainingRoot.querySelectorAll('[data-stage-point]').forEach(p=>{const select=()=>selectTrainingStage(Number(p.dataset.stagePoint));p.addEventListener('pointerenter',select);p.addEventListener('focus',select);p.addEventListener('click',select);p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}})});
trainingRoot.querySelectorAll('[data-training-stage]').forEach(b=>{const select=()=>selectTrainingStage(Number(b.dataset.trainingStage));b.addEventListener('click',select);b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')select()});b.addEventListener('focus',select)});selectTrainingStage(currentTrainingStage);}
function selectTrainingStage(i){currentTrainingStage=i;const benchmark=stageBenchmarks[currentStageBenchmark];trainingRoot.querySelector('#stage-guide').setAttribute('x1',stageX(i));trainingRoot.querySelector('#stage-guide').setAttribute('x2',stageX(i));trainingRoot.querySelectorAll('[data-stage-point]').forEach(p=>{const active=Number(p.dataset.stagePoint)===i;p.classList.toggle('stage-active',active);p.querySelector('.training-point').setAttribute('r',active?'6.5':'4.5')});trainingRoot.querySelectorAll('[data-training-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.trainingStage)===i)));document.querySelector('#stage-readout-title').textContent=benchmark.name+' · '+trainingStages[i];document.querySelector('#stage-score35').textContent=`35B · ${benchmark.a[i].toFixed(1)}%`;document.querySelector('#stage-score122').textContent=`122B · ${benchmark.b[i].toFixed(1)}%`;}
trainingRoot.querySelectorAll('[data-benchmark-tab]').forEach(button=>{const select=()=>{currentStageBenchmark=Number(button.dataset.benchmarkTab);renderTrainingBenchmark()};button.addEventListener('click',select);button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(currentStageBenchmark+1)%6;else if(e.key==='ArrowLeft')next=(currentStageBenchmark+5)%6;else if(e.key==='Home')next=0;else if(e.key==='End')next=5;else return;e.preventDefault();currentStageBenchmark=next;renderTrainingBenchmark();trainingRoot.querySelector(`[data-benchmark-tab="${next}"]`).focus()})});renderTrainingBenchmark();

const recipeStageDetails=[
 {title:'Self-contained reasoning',text:'Start with scientific seed problems, strengthen them using base-model feedback, and collect correctly solved reasoning trajectories.',input:'Scientific seed problems',process:'Model-aware task strengthening',output:'Verified reasoning trajectories',stage:1},
 {title:'Tool-dependent reasoning',text:'Construct questions with checkable answers from real data. Solvers must acquire the missing evidence through tools, and only verified solution trajectories are retained.',input:'Real-world data sources',process:'Search, tool use, and computation',output:'Verified tool-use trajectories',stage:2},
 {title:'Long-horizon refinement',text:'Use asynchronous GRPO to refine reasoning and tool use over agent trajectories. Context-condensation boundaries divide rollouts into sessions for training.',input:'Agent–environment interaction',process:'Asynchronous reinforcement learning',output:'Refined reasoning and tool use',stage:3}
];
let activeRecipeStage=0;
function selectRecipeStage(i){activeRecipeStage=i;const d=recipeStageDetails[i];document.querySelectorAll('[data-recipe-stage]').forEach(card=>{const selected=Number(card.dataset.recipeStage)===i;card.classList.toggle('recipe-selected',selected);card.setAttribute('aria-pressed',String(selected))});document.querySelector('#recipe-stage-detail').innerHTML=`<div class="recipe-detail-heading"><h3>${d.title}</h3><button type="button" id="view-recipe-progress">View this training stage ↓</button></div><p>${d.text}</p><div class="recipe-detail-flow"><div><small>INPUT</small><span>${d.input}</span></div><div><small>PROCESS</small><span>${d.process}</span></div><div><small>OUTCOME</small><span>${d.output}</span></div></div>`;document.querySelector('#view-recipe-progress').addEventListener('click',()=>{selectTrainingStage(d.stage);trainingRoot.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'})})}
document.querySelectorAll('[data-recipe-stage]').forEach(card=>{const choose=()=>selectRecipeStage(Number(card.dataset.recipeStage));card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')choose()});card.addEventListener('focus',choose);card.addEventListener('click',choose);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const next=(activeRecipeStage+(e.key==='ArrowRight'?1:2))%3;document.querySelector(`[data-recipe-stage="${next}"]`).focus()}})});selectRecipeStage(0);

// Only count visits to the published project site, not localhost previews.
const visitorMapMount = document.getElementById('visitor-map-mount');
if (visitorMapMount) {
  if (window.location.hostname === 'axion1-0.github.io') {
    const widget = document.createElement('script');
    widget.id = 'mapmyvisitors';
    widget.src = visitorMapMount.dataset.src;
    visitorMapMount.replaceWith(widget);
  } else {
    visitorMapMount.closest('.visitor-panel')?.remove();
  }
}

// Keep the contents toggle available and remember the reader's preference.
const readingLayout=document.querySelector('.reading-layout');
const contentsToggle=document.getElementById('contents-toggle');
const pageContents=document.getElementById('page-contents');
function setContentsCollapsed(collapsed){
 readingLayout.classList.toggle('contents-collapsed',collapsed);
 pageContents.hidden=collapsed;
 contentsToggle.setAttribute('aria-expanded',String(!collapsed));
 contentsToggle.setAttribute('aria-label',collapsed?'Show contents':'Hide contents');
 contentsToggle.title=collapsed?'Show contents':'Hide contents';
}
let savedContentsPreference=null;
try{savedContentsPreference=localStorage.getItem('axion-contents-collapsed')}catch{}
setContentsCollapsed(savedContentsPreference===null?matchMedia('(max-width:750px)').matches:savedContentsPreference==='true');
contentsToggle.addEventListener('click',()=>{
 const collapsed=!readingLayout.classList.contains('contents-collapsed');
 setContentsCollapsed(collapsed);
 try{localStorage.setItem('axion-contents-collapsed',String(collapsed))}catch{}
});
