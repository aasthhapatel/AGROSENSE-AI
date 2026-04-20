// /* ══════════════════════════════════════
//    THREE.JS 3D SCENE BUILDERS
// ══════════════════════════════════════ */
 
// // ── Helper: build a renderer for a canvas
// function makeRenderer(canvasId, alpha=true){
//   const canvas = document.getElementById(canvasId);
//   if(!canvas) return null;
//   const renderer = new THREE.WebGLRenderer({canvas, alpha, antialias:true});
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
//   return {renderer, canvas};
// }
 
// // ── HERO: Floating particle field with depth
// (function heroScene(){
//   const {renderer, canvas} = makeRenderer('hero-canvas') || {};
//   if(!renderer) return;
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
//   camera.position.z = 5;
 
//   // Particle geometry
//   const COUNT = 1200;
//   const geo = new THREE.BufferGeometry();
//   const pos = new Float32Array(COUNT*3);
//   const col = new Float32Array(COUNT*3);
//   const sizes = new Float32Array(COUNT);
//   const colors = [
//     new THREE.Color(0x4A8C65), new THREE.Color(0x7EC99A),
//     new THREE.Color(0xD4A853), new THREE.Color(0x1C3A28),
//     new THREE.Color(0xC8EDD6)
//   ];
//   for(let i=0;i<COUNT;i++){
//     pos[i*3]   = (Math.random()-0.5)*30;
//     pos[i*3+1] = (Math.random()-0.5)*20;
//     pos[i*3+2] = (Math.random()-0.5)*15;
//     const c = colors[Math.floor(Math.random()*colors.length)];
//     col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
//     sizes[i] = Math.random()*3+0.5;
//   }
//   geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
//   geo.setAttribute('color',    new THREE.BufferAttribute(col,3));
//   geo.setAttribute('size',     new THREE.BufferAttribute(sizes,1));
//   const mat = new THREE.PointsMaterial({
//     size:0.06, vertexColors:true, transparent:true, opacity:0.7,
//     sizeAttenuation:true
//   });
//   const pts = new THREE.Points(geo, mat);
//   scene.add(pts);
 
//   // Floating organic meshes (leaf-like)
//   const leafGeo = new THREE.SphereGeometry(0.15,8,6);
//   const leafMat = new THREE.MeshBasicMaterial({color:0x4A8C65,transparent:true,opacity:0.12,wireframe:true});
//   const leaves = [];
//   for(let i=0;i<18;i++){
//     const m = new THREE.Mesh(leafGeo,leafMat.clone());
//     m.position.set((Math.random()-0.5)*20,(Math.random()-0.5)*14,(Math.random()-0.5)*8);
//     const s = Math.random()*1.5+0.5;
//     m.scale.setScalar(s);
//     m.userData = {spd: Math.random()*0.008+0.002, phase: Math.random()*Math.PI*2};
//     scene.add(m); leaves.push(m);
//   }
 
//   let mx=0, my=0;
//   window.addEventListener('mousemove', e=>{
//     mx = (e.clientX/window.innerWidth-0.5)*2;
//     my = (e.clientY/window.innerHeight-0.5)*2;
//   });
 
//   function resize(){
//     const s = canvas.parentElement;
//     const w = s.offsetWidth, h = s.offsetHeight;
//     renderer.setSize(w,h,false);
//     camera.aspect = w/h;
//     camera.updateProjectionMatrix();
//   }
//   resize();
//   window.addEventListener('resize', resize);
 
//   let t=0;
//   function animate(){
//     requestAnimationFrame(animate);
//     t += 0.006;
//     pts.rotation.y = t*0.04;
//     pts.rotation.x = Math.sin(t*0.02)*0.1;
//     camera.position.x += (mx*1.2 - camera.position.x)*0.03;
//     camera.position.y += (-my*0.8 - camera.position.y)*0.03;
//     leaves.forEach(l=>{
//       l.rotation.x = t*l.userData.spd;
//       l.rotation.y = t*l.userData.spd*0.7;
//       l.position.y += Math.sin(t + l.userData.phase)*0.001;
//     });
//     renderer.render(scene, camera);
//   }
//   animate();
// })();
 
// // ── DETECT: DNA helix / microscopic cell environment
// (function detectScene(){
//   const {renderer, canvas} = makeRenderer('detect-canvas') || {};
//   if(!renderer) return;
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
//   camera.position.set(0,0,12);
 
//   // Helix points
//   const helixGeo = new THREE.BufferGeometry();
//   const helixPts = [];
//   for(let i=0;i<400;i++){
//     const t = i*0.08;
//     helixPts.push(Math.cos(t)*3, t*0.1-12, Math.sin(t)*3);
//     helixPts.push(Math.cos(t+Math.PI)*3, t*0.1-12, Math.sin(t+Math.PI)*3);
//   }
//   helixGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(helixPts),3));
//   const helixMat = new THREE.PointsMaterial({color:0x4A8C65, size:0.05, transparent:true, opacity:0.4});
//   const helix = new THREE.Points(helixGeo, helixMat);
//   scene.add(helix);
 
//   // Cell-like rings
//   const rings = [];
//   for(let i=0;i<8;i++){
//     const rGeo = new THREE.TorusGeometry(Math.random()*2+0.5, 0.02, 8, 60);
//     const rMat = new THREE.MeshBasicMaterial({color:0x2A5C3F, transparent:true, opacity:0.12+Math.random()*0.1});
//     const r = new THREE.Mesh(rGeo, rMat);
//     r.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*10, (Math.random()-0.5)*4);
//     r.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
//     r.userData = {spd:Math.random()*0.004+0.001};
//     scene.add(r); rings.push(r);
//   }
 
//   function resize(){
//     const s = canvas.parentElement;
//     renderer.setSize(s.offsetWidth, s.offsetHeight, false);
//     camera.aspect = s.offsetWidth/s.offsetHeight;
//     camera.updateProjectionMatrix();
//   }
//   resize();
//   window.addEventListener('resize', resize);
 
//   let t=0;
//   function animate(){
//     requestAnimationFrame(animate);
//     t += 0.005;
//     helix.rotation.y = t*0.1;
//     rings.forEach(r=>{ r.rotation.z += r.userData.spd; r.rotation.x += r.userData.spd*0.5; });
//     renderer.render(scene, camera);
//   }
//   animate();
// })();
 
// // ── TOOLS: Floating geometric crystals
// (function toolsScene(){
//   const {renderer, canvas} = makeRenderer('tools-canvas') || {};
//   if(!renderer) return;
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
//   camera.position.z = 14;
 
//   const crystals = [];
//   const geos = [
//     new THREE.OctahedronGeometry(0.4),
//     new THREE.TetrahedronGeometry(0.4),
//     new THREE.IcosahedronGeometry(0.3),
//   ];
//   const colors = [0x4A8C65, 0x7EC99A, 0xD4A853, 0x2A5C3F, 0xB5622A];
//   for(let i=0;i<30;i++){
//     const geo = geos[i%geos.length];
//     const mat = new THREE.MeshBasicMaterial({
//       color:colors[i%colors.length],
//       wireframe:true, transparent:true, opacity:0.15+Math.random()*0.12
//     });
//     const m = new THREE.Mesh(geo, mat);
//     m.position.set((Math.random()-0.5)*28,(Math.random()-0.5)*20,(Math.random()-0.5)*8);
//     m.scale.setScalar(Math.random()*2+0.5);
//     m.userData={vx:(Math.random()-0.5)*0.003,vy:(Math.random()-0.5)*0.003,rx:Math.random()*0.008,ry:Math.random()*0.008};
//     scene.add(m); crystals.push(m);
//   }
 
//   function resize(){
//     const s = canvas.parentElement;
//     renderer.setSize(s.offsetWidth, s.offsetHeight, false);
//     camera.aspect = s.offsetWidth/s.offsetHeight;
//     camera.updateProjectionMatrix();
//   }
//   resize();
//   window.addEventListener('resize', resize);
 
//   function animate(){
//     requestAnimationFrame(animate);
//     crystals.forEach(c=>{
//       c.rotation.x += c.userData.rx;
//       c.rotation.y += c.userData.ry;
//       c.position.x += c.userData.vx;
//       c.position.y += c.userData.vy;
//       if(Math.abs(c.position.x)>14) c.userData.vx *= -1;
//       if(Math.abs(c.position.y)>10) c.userData.vy *= -1;
//     });
//     renderer.render(scene, camera);
//   }
//   animate();
// })();
 
// // ── HOW IT WORKS: Flowing network / pathway
// (function howScene(){
//   const {renderer, canvas} = makeRenderer('how-canvas') || {};
//   if(!renderer) return;
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
//   camera.position.z = 10;
 
//   // Network nodes
//   const nodes=[], edges=[];
//   const nodeMat = new THREE.MeshBasicMaterial({color:0x4A8C65,transparent:true,opacity:0.18});
//   for(let i=0;i<40;i++){
//     const g = new THREE.SphereGeometry(0.08,6,6);
//     const n = new THREE.Mesh(g, nodeMat);
//     n.position.set((Math.random()-0.5)*22,(Math.random()-0.5)*14,(Math.random()-0.5)*6);
//     n.userData={vx:(Math.random()-0.5)*0.005,vy:(Math.random()-0.5)*0.005};
//     scene.add(n); nodes.push(n);
//   }
//   // Connect nearby nodes
//   const lineMat = new THREE.LineBasicMaterial({color:0x2A5C3F,transparent:true,opacity:0.12});
//   for(let i=0;i<nodes.length;i++){
//     for(let j=i+1;j<nodes.length;j++){
//       if(nodes[i].position.distanceTo(nodes[j].position)<5){
//         const g = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
//         const l = new THREE.Line(g, lineMat);
//         scene.add(l); edges.push({line:l, a:nodes[i], b:nodes[j]});
//       }
//     }
//   }
 
//   // Flowing dots along a path
//   const pathDotGeo = new THREE.SphereGeometry(0.05,6,6);
//   const pathDotMat = new THREE.MeshBasicMaterial({color:0xD4A853,transparent:true,opacity:0.6});
//   const pathDots = [];
//   for(let i=0;i<8;i++){
//     const d = new THREE.Mesh(pathDotGeo, pathDotMat);
//     d.userData = {t: i/8};
//     scene.add(d); pathDots.push(d);
//   }
 
//   function resize(){
//     const s = canvas.parentElement;
//     renderer.setSize(s.offsetWidth, s.offsetHeight, false);
//     camera.aspect = s.offsetWidth/s.offsetHeight;
//     camera.updateProjectionMatrix();
//   }
//   resize();
//   window.addEventListener('resize', resize);
 
//   let t=0;
//   function animate(){
//     requestAnimationFrame(animate);
//     t += 0.005;
//     nodes.forEach(n=>{
//       n.position.x += n.userData.vx;
//       n.position.y += n.userData.vy;
//       if(Math.abs(n.position.x)>11) n.userData.vx *= -1;
//       if(Math.abs(n.position.y)>7) n.userData.vy *= -1;
//     });
//     edges.forEach(e=>{
//       const pts = [e.a.position.clone(), e.b.position.clone()];
//       e.line.geometry.setFromPoints(pts);
//     });
//     pathDots.forEach(d=>{
//       d.userData.t = (d.userData.t + 0.003) % 1;
//       const a = d.userData.t * Math.PI * 2;
//       d.position.set(Math.cos(a)*6, Math.sin(a*2)*2, Math.sin(a)*2);
//     });
//     renderer.render(scene, camera);
//   }
//   animate();
// })();
 
// // ── WEATHER: Atmospheric sky with particles
// (function weatherScene(){
//   const {renderer, canvas} = makeRenderer('weather-canvas') || {};
//   if(!renderer) return;
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
//   camera.position.z = 12;
 
//   // Rain-like streaks
//   const rainCount = 800;
//   const rainGeo = new THREE.BufferGeometry();
//   const rainPos = new Float32Array(rainCount*3);
//   for(let i=0;i<rainCount;i++){
//     rainPos[i*3]   = (Math.random()-0.5)*28;
//     rainPos[i*3+1] = (Math.random()-0.5)*18;
//     rainPos[i*3+2] = (Math.random()-0.5)*8;
//   }
//   rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos,3));
//   const rainMat = new THREE.PointsMaterial({color:0x7DD3F8, size:0.04, transparent:true, opacity:0.4});
//   const rain = new THREE.Points(rainGeo, rainMat);
//   scene.add(rain);
 
//   // Cloud-like spheres
//   const cloudMat = new THREE.MeshBasicMaterial({color:0x0a4060, transparent:true, opacity:0.06, wireframe:false});
//   const clouds=[];
//   for(let i=0;i<12;i++){
//     const g = new THREE.SphereGeometry(Math.random()*1.5+0.5, 8, 6);
//     const c = new THREE.Mesh(g, cloudMat.clone());
//     c.position.set((Math.random()-0.5)*20, (Math.random()-0.5)*12, (Math.random()-0.5)*4-4);
//     c.userData={vx:(Math.random()-0.5)*0.003};
//     scene.add(c); clouds.push(c);
//   }
 
//   function resize(){
//     const s = canvas.parentElement;
//     renderer.setSize(s.offsetWidth, s.offsetHeight, false);
//     camera.aspect = s.offsetWidth/s.offsetHeight;
//     camera.updateProjectionMatrix();
//   }
//   resize();
//   window.addEventListener('resize', resize);
 
//   const rp = rainGeo.attributes.position.array;
//   function animate(){
//     requestAnimationFrame(animate);
//     for(let i=0;i<rainCount;i++){
//       rp[i*3+1] -= 0.04;
//       if(rp[i*3+1] < -9) rp[i*3+1] = 9;
//     }
//     rainGeo.attributes.position.needsUpdate = true;
//     clouds.forEach(c=>{
//       c.position.x += c.userData.vx;
//       if(c.position.x > 12) c.position.x = -12;
//     });
//     renderer.render(scene, camera);
//   }
//   animate();
// })();
 
// /* ══════════════════════════════════════
//    SCROLL REVEAL OBSERVER
// ══════════════════════════════════════ */
// const ro = new IntersectionObserver(entries=>{
//   entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('vis');});
// },{threshold:0.1});
// document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el=>ro.observe(el));
 
// /* ══════════════════════════════════════
//    NAVBAR SCROLL
// ══════════════════════════════════════ */
// window.addEventListener('scroll',()=>{
//   document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);
// });
 
// /* ══════════════════════════════════════
//    APP STATE
// ══════════════════════════════════════ */
// let selectedCrop='Wheat', selectedUnit='acre', detectionResult=null;
 
// /* ══════════════════════════════════════
//    TOAST
// ══════════════════════════════════════ */
// function toast(msg, type='ok'){
//   const el=document.getElementById('toastNotif');
//   el.textContent=(type==='ok'?'✅ ':'❌ ')+msg;
//   el.className='notif-toast show'+(type==='error'?' error':'');
//   clearTimeout(el._t);
//   el._t=setTimeout(()=>el.className='notif-toast',3500);
// }
 
// /* ══════════════════════════════════════
//    FILE UPLOAD
// ══════════════════════════════════════ */
// function handleFileUpload(e){
//   const file=e.target.files[0]; if(!file) return;
//   const reader=new FileReader();
//   reader.onload=ev=>{
//     const p=document.getElementById('imagePreview');
//     p.src=ev.target.result; p.style.display='block';
//     document.getElementById('uploadPlaceholder').style.display='none';
//   };
//   reader.readAsDataURL(file);
// }
// const uz=document.getElementById('uploadZone');
// uz.addEventListener('dragover',e=>{e.preventDefault();uz.classList.add('dragover');});
// uz.addEventListener('dragleave',()=>uz.classList.remove('dragover'));
// uz.addEventListener('drop',e=>{
//   e.preventDefault();uz.classList.remove('dragover');
//   const f=e.dataTransfer.files[0];
//   if(f?.type.startsWith('image/')){
//     const dt=new DataTransfer();dt.items.add(f);
//     document.getElementById('fileInput').files=dt.files;
//     handleFileUpload({target:{files:dt.files}});
//   }
// });
 
// /* ══════════════════════════════════════
//    DETECTION
// ══════════════════════════════════════ */
// async function runDetection(){
//   const fi=document.getElementById('fileInput');
//   if(!fi.files[0]){toast('Please upload a crop image first','error');return;}
//   document.getElementById('resultEmpty').style.display='none';
//   document.getElementById('resultContent').style.display='none';
//   document.getElementById('detectionLoader').classList.add('on');
//   document.getElementById('detectBtn').disabled=true;
//   try{
//     const fd=new FormData();
//     fd.append('image',fi.files[0]);
//     fd.append('crop',selectedCrop);
//     const res=await fetch('/predict',{method:'POST',body:fd});
//     if(!res.ok) throw new Error('Server error');
//     const data=await res.json();
//     renderDetectionResult({disease_name:data.disease,confidence:data.confidence});
//   }catch(err){
//     console.error(err);
//     toast('Prediction failed. Check Flask server.','error');
//     document.getElementById('detectionLoader').classList.remove('on');
//     document.getElementById('detectBtn').disabled=false;
//   }
// }
 
// function renderDetectionResult(d){
//   detectionResult={...d, crop:selectedCrop};
//   document.getElementById('detectionLoader').classList.remove('on');
//   document.getElementById('detectBtn').disabled=false;
//   document.getElementById('resultIcon').textContent='🌿';
//   document.getElementById('resultIcon').className='result-icon healthy';
//   document.getElementById('resultName').textContent=d.disease_name;
//   document.getElementById('resultBadge').textContent='AI Diagnosis';
//   document.getElementById('confScore').textContent=d.confidence+'%';
//   document.getElementById('resultEmpty').style.display='none';
//   document.getElementById('resultContent').style.display='block';
//   toast('Disease analysis complete!');
// }
 
// function resetDetection(){
//   document.getElementById('fileInput').value='';
//   document.getElementById('imagePreview').style.display='none';
//   const ph=document.getElementById('uploadPlaceholder');
//   ph.style.display='flex'; ph.style.flexDirection='column';
//   ph.style.alignItems='center'; ph.style.gap='18px';
//   document.getElementById('resultContent').style.display='none';
//   document.getElementById('resultEmpty').style.display='flex';
//   detectionResult=null;
// }
 
// function downloadReport(){
//   if(!detectionResult) return;
//   const d=detectionResult;
//   const txt=`AGROSENSE AI — CROP DISEASE REPORT
// Date: ${new Date().toLocaleDateString('en-IN')}
// Crop: ${d.crop}
 
// DIAGNOSIS
// Disease: ${d.disease_name}
// AI Confidence: ${d.confidence}%
 
// Generated by AgroSense AI Platform`;
//   const blob=new Blob([txt],{type:'text/plain'});
//   const a=document.createElement('a');
//   a.href=URL.createObjectURL(blob);
//   a.download=`AgroSense_Report.txt`;
//   a.click();
//   toast('Report downloaded!');
// }
 
// /* ══════════════════════════════════════
//    MODALS
// ══════════════════════════════════════ */
// function openModal(id){document.getElementById(id+'Modal').classList.add('open');}
// function closeModal(id){document.getElementById(id+'Modal').classList.remove('open');}
// function closeModalOnOverlay(e,id){if(e.target===document.getElementById(id))closeModal(id.replace('Modal',''));}
// document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));});
// function setUnit(btn,unit){btn.parentElement.querySelectorAll('.unit-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');selectedUnit=unit;}
// function showResult(id){document.getElementById(id).classList.add('show');}
 
// /* ══════════════════════════════════════
//    WEATHER
// ══════════════════════════════════════ */
// async function geocodeCity(city){
//   const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
//   const d=await r.json();
//   if(!d.results?.length) throw new Error('City not found');
//   return{lat:d.results[0].latitude,lon:d.results[0].longitude,name:d.results[0].name+', '+(d.results[0].country||'')};
// }
// async function fetchWeatherData(lat,lon,cityName){
//   const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,visibility,uv_index,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max&hourly=temperature_2m,precipitation_probability,weather_code&timezone=auto&forecast_days=5`;
//   const r=await fetch(url); const d=await r.json();
//   renderWeather(d,cityName);
// }
// function wCode(c){
//   if(c===0)return{icon:'☀️',label:'Clear sky'};
//   if(c<=2)return{icon:'🌤️',label:'Partly cloudy'};
//   if(c<=3)return{icon:'☁️',label:'Overcast'};
//   if(c<=48)return{icon:'🌫️',label:'Foggy'};
//   if(c<=55)return{icon:'🌦️',label:'Drizzle'};
//   if(c<=67)return{icon:'🌧️',label:'Rain'};
//   if(c<=77)return{icon:'❄️',label:'Snow'};
//   if(c<=82)return{icon:'🌦️',label:'Rain showers'};
//   if(c<=99)return{icon:'⛈️',label:'Thunderstorm'};
//   return{icon:'⛅',label:'Unknown'};
// }
// function windDir(deg){const dirs=['N','NE','E','SE','S','SW','W','NW'];return dirs[Math.round(deg/45)%8];}
// function uvLabel(uv){if(uv<=2)return'Low';if(uv<=5)return'Moderate';if(uv<=7)return'High';if(uv<=10)return'Very High';return'Extreme';}
// function renderWeather(d,cityName){
//   document.getElementById('weatherSkeleton').style.display='none';
//   document.getElementById('weatherError').style.display='none';
//   const cur=d.current;
//   document.getElementById('currentCard').style.display='block';
//   document.getElementById('weatherRightPanel').style.display='flex';
//   document.getElementById('wcCity').textContent=cityName;
//   const wc=wCode(cur.weather_code);
//   document.getElementById('wcIcon').textContent=wc.icon;
//   document.getElementById('wcTemp').textContent=Math.round(cur.temperature_2m);
//   document.getElementById('wcCondition').textContent=wc.label;
//   document.getElementById('wcFeels').textContent=Math.round(cur.apparent_temperature);
//   document.getElementById('wcHumidity').textContent=cur.relative_humidity_2m+'%';
//   document.getElementById('wcWind').textContent=Math.round(cur.wind_speed_10m)+' km/h';
//   document.getElementById('wcWindDir').textContent=windDir(cur.wind_direction_10m);
//   document.getElementById('wcRain').textContent=(cur.precipitation_probability||0)+'%';
//   document.getElementById('wcUV').textContent=cur.uv_index??'—';
//   document.getElementById('wcUVLabel').textContent=uvLabel(cur.uv_index||0);
//   document.getElementById('wcVis').textContent=cur.visibility?Math.round(cur.visibility/1000):'—';
//   document.getElementById('wcDew').textContent=Math.round(cur.dew_point_2m??0);
//   const sr=new Date(d.daily.sunrise[0]),ss=new Date(d.daily.sunset[0]),now=new Date();
//   document.getElementById('wcSunrise').textContent=sr.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
//   document.getElementById('wcSunset').textContent=ss.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
//   const pct=Math.round((Math.max(0,Math.min(ss-sr,now-sr))/(ss-sr))*100);
//   document.getElementById('sunProgress').style.width=pct+'%';
//   document.getElementById('sunDot').style.left=pct+'%';
//   const fg=document.getElementById('forecastGrid');fg.innerHTML='';
//   const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
//   for(let i=0;i<5;i++){
//     const dt=new Date(d.daily.time[i]);const w=wCode(d.daily.weather_code[i]);
//     fg.innerHTML+=`<div class="forecast-card"><div class="fc-day">${days[dt.getDay()]}</div><div class="fc-icon">${w.icon}</div><div class="fc-temp-hi">${Math.round(d.daily.temperature_2m_max[i])}°</div><div class="fc-temp-lo">${Math.round(d.daily.temperature_2m_min[i])}°</div><div class="fc-rain">🌧 ${d.daily.precipitation_probability_max[i]||0}%</div></div>`;
//   }
//   const hs=document.getElementById('hourlyScroll');hs.innerHTML='';
//   const nowH=new Date().getHours();
//   for(let i=nowH;i<nowH+24&&i<d.hourly.time.length;i++){
//     const t2=new Date(d.hourly.time[i]);const w=wCode(d.hourly.weather_code[i]);
//     hs.innerHTML+=`<div class="hourly-card"><div class="hc-time">${t2.getHours().toString().padStart(2,'0')}:00</div><div class="hc-icon">${w.icon}</div><div class="hc-temp">${Math.round(d.hourly.temperature_2m[i])}°</div><div class="hc-rain">${d.hourly.precipitation_probability[i]||0}%</div></div>`;
//   }
//   buildAdvisory(d.current,d.daily);
//   buildCharts(d.daily);
// }
// function buildAdvisory(cur,daily){
//   const grid=document.getElementById('advisoryGrid');grid.innerHTML='';
//   const tips=[];
//   const rain=daily.precipitation_probability_max[0]||0;
//   const temp=Math.round(cur.temperature_2m);
//   const hum=cur.relative_humidity_2m;
//   if(rain>60) tips.push({icon:'☔',title:'Avoid Spraying',body:'High rain probability. Hold pesticide application until clear skies.'});
//   else if(rain<15) tips.push({icon:'💧',title:'Irrigation Needed',body:'Low rain chance today. Consider supplemental irrigation.'});
//   if(temp>38) tips.push({icon:'🌡️',title:'Heat Stress Alert',body:'High temperatures may stress crops. Irrigate early morning.'});
//   if(hum>80) tips.push({icon:'🍄',title:'Fungal Risk High',body:'High humidity increases fungal disease risk. Apply preventive fungicide.'});
//   if(tips.length===0) tips.push({icon:'✅',title:'Good Farming Day',body:'Weather conditions are favorable for field operations today.'});
//   tips.push({icon:'🌱',title:'Soil Moisture',body:`Humidity at ${hum}%. ${hum>65?'Reduce irrigation frequency.':'Monitor soil moisture closely.'}`});
//   tips.forEach(t=>{ grid.innerHTML+=`<div class="ag-tip"><div class="ag-tip-icon">${t.icon}</div><div><div class="ag-tip-title">${t.title}</div><div class="ag-tip-body">${t.body}</div></div></div>`; });
// }
// function buildCharts(daily){
//   const rb=document.getElementById('rainBars');rb.innerHTML='';
//   const days=['Su','Mo','Tu','We','Th'];
//   for(let i=0;i<5;i++){
//     const pct=daily.precipitation_probability_max[i]||0;
//     const h=Math.max(3,Math.round((pct/100)*70));
//     rb.innerHTML+=`<div class="rain-bar-wrap"><div class="rain-bar-pct">${pct}%</div><div class="rain-bar" style="height:${h}px"></div><div class="rain-bar-label">${days[i]}</div></div>`;
//   }
//   const tr=document.getElementById('tempRanges');tr.innerHTML='';
//   const allT=[...daily.temperature_2m_max.slice(0,5),...daily.temperature_2m_min.slice(0,5)];
//   const minT=Math.min(...allT)-2,range=Math.max(...allT)+2-minT;
//   for(let i=0;i<5;i++){
//     const lo=daily.temperature_2m_min[i],hi=daily.temperature_2m_max[i];
//     const lp=((lo-minT)/range)*100,wp=((hi-lo)/range)*100;
//     tr.innerHTML+=`<div class="temp-row"><div class="temp-day-label">${days[i]}</div><div class="temp-lo-label">${Math.round(lo)}°</div><div class="temp-range-bar-bg"><div class="temp-range-fill" style="left:${lp}%;width:${wp}%"></div></div><div class="temp-hi-label">${Math.round(hi)}°</div></div>`;
//   }
// }
// function switchTab(tab){
//   document.querySelectorAll('.wtab,.wtab-panel').forEach(el=>el.classList.remove('active'));
//   document.getElementById('tab-'+tab).classList.add('active');
//   const map={forecast:0,hourly:1,advisory:2,charts:3};
//   document.querySelectorAll('.wtab')[map[tab]]?.classList.add('active');
// }
// async function searchWeather(){
//   const city=document.getElementById('locationInput').value.trim();
//   if(!city){toast('Please enter a city name','error');return;}
//   document.getElementById('weatherSkeleton').style.display='block';
//   document.getElementById('currentCard').style.display='none';
//   document.getElementById('weatherRightPanel').style.display='none';
//   document.getElementById('weatherError').style.display='none';
//   try{const geo=await geocodeCity(city);await fetchWeatherData(geo.lat,geo.lon,geo.name);}
//   catch(e){showWeatherError(e.message);}
// }
// async function locateMe(){
//   if(!navigator.geolocation){toast('Geolocation not supported','error');return;}
//   navigator.geolocation.getCurrentPosition(async pos=>{
//     const{latitude:lat,longitude:lon}=pos.coords;
//     document.getElementById('weatherSkeleton').style.display='block';
//     document.getElementById('currentCard').style.display='none';
//     document.getElementById('weatherRightPanel').style.display='none';
//     try{await fetchWeatherData(lat,lon,'My Location');}catch(e){showWeatherError(e.message);}
//   },()=>toast('Location access denied','error'));
// }
// function showWeatherError(msg){
//   document.getElementById('weatherSkeleton').style.display='none';
//   document.getElementById('weatherError').style.display='block';
//   document.getElementById('weatherErrorMsg').textContent=msg||'Unable to fetch weather data.';
// }
// async function loadDefaultWeather(){
//   document.getElementById('locationInput').value='Ahmedabad';
//   document.getElementById('weatherSkeleton').style.display='block';
//   document.getElementById('weatherError').style.display='none';
//   try{const geo=await geocodeCity('Ahmedabad');await fetchWeatherData(geo.lat,geo.lon,geo.name);}
//   catch(e){showWeatherError(e.message);}
// }
// loadDefaultWeather();
 
// /* ══════════════════════════════════════
//    CHATBOT
// ══════════════════════════════════════ */
// function toggleChat(){document.getElementById('chatWindow').classList.toggle('open');}
// async function sendChatMessage(){
//   const inp=document.getElementById('chatInput');const msg=inp.value.trim();if(!msg) return;
//   addChatMsg(msg,'user');inp.value='';
//   document.getElementById('chatTyping').classList.add('on');
//   try{
//     const r=await fetch('http://127.0.0.1:5000/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})});
//     const data=await r.json();
//     document.getElementById('chatTyping').classList.remove('on');
//     addChatMsg(data.success?data.reply:'⚠️ AI service unavailable.','bot');
//   }catch{
//     document.getElementById('chatTyping').classList.remove('on');
//     addChatMsg(offlineChat(msg),'bot');
//   }
// }
// function addChatMsg(text,type){
//   const div=document.createElement('div');
//   div.className=`chat-msg ${type==='user'?'user':'bot'}`;
//   div.textContent=text;
//   const msgs=document.getElementById('chatMessages');
//   msgs.appendChild(div);msgs.scrollTop=99999;
// }
// function offlineChat(msg){
//   const m=msg.toLowerCase();
//   if(['hi','hello','hey','namaste'].some(g=>m.includes(g))) return '👋 Hello! I can help with crop diseases, fertilizers, pest management, irrigation, and market prices. What\'s your farming question?';
//   if(m.includes('rust')||m.includes('yellow stripe')) return '🌾 Yellow Rust: Apply Propiconazole 25% EC @ 0.5ml/L. Spray early morning and repeat after 14 days.';
//   if(m.includes('blight')) return '🍅 Blight: Apply Mancozeb 75% WP @ 2g/L immediately. Remove infected leaves first.';
//   if(m.includes('fertilizer')||m.includes('npk')) return '🌿 Use the Fertilizer Calculator tool for exact NPK amounts.';
//   if(m.includes('pest')||m.includes('aphid')) return '🛡️ For sucking pests: Imidacloprid 17.8% SL @ 0.5ml/L.';
//   if(m.includes('water')||m.includes('irrigation')) return '💧 Use the Irrigation Planner for smart watering schedules.';
//   if(m.includes('soil')||m.includes('ph')) return '🪱 Ideal soil pH is 6.0–7.5 for most crops. Use the Soil Analyzer.';
//   return 'I can help with crop diseases 🌿, fertilizers, irrigation 💧, pests 🛡️, soil health, and market prices 📈.';
// }
 
// /* ══════════════════════════════════════
//    CALCULATORS
// ══════════════════════════════════════ */
// function calcFertilizer(){
//   const crop=document.getElementById('fCrop').value;
//   const area=parseFloat(document.getElementById('fArea').value)||1;
//   const stage=document.getElementById('fStage').value;
//   const npk={Wheat:{N:120,P:60,K:40},Rice:{N:100,P:50,K:50},Maize:{N:150,P:75,K:50},Millets:{N:80,P:40,K:40},Sorghum:{N:90,P:40,K:30},Tomato:{N:150,P:75,K:125},Cotton:{N:60,P:30,K:30},Potato:{N:90,P:60,K:75},Soybean:{N:30,P:60,K:40},Groundnut:{N:20,P:40,K:40},Onion:{N:100,P:50,K:50},Chilli:{N:120,P:60,K:60},Sugarcane:{N:250,P:80,K:120},Sunflower:{N:90,P:60,K:60}};
//   const sm={'Sowing / Basal':0.4,'Vegetative':0.35,'Flowering':0.15,'Fruiting / Grain Filling':0.1};
//   const uH={acre:0.4047,hectare:1,gunta:0.01012};
//   const areaHa=area*(uH[selectedUnit]||0.4047);
//   const s=sm[stage]||0.4; const b=npk[crop]||npk.Wheat;
//   const N=Math.round(b.N*areaHa*s),P=Math.round(b.P*areaHa*s),K=Math.round(b.K*areaHa*s);
//   document.getElementById('nVal').textContent=N;
//   document.getElementById('pVal').textContent=P;
//   document.getElementById('kVal').textContent=K;
//   const urea=Math.round(N/0.46),dap=Math.round(P/0.46),mop=Math.round(K/0.60);
//   const cost=Math.round(urea*6.5+dap*27+mop*17);
//   document.getElementById('fertDetails').innerHTML=`<strong>Products Required:</strong><br>• Urea (46% N): <strong>${urea} kg</strong><br>• DAP (18-46-0): <strong>${dap} kg</strong><br>• MOP (0-0-60): <strong>${mop} kg</strong><br><br><strong>Estimated Cost:</strong> ₹${cost.toLocaleString('en-IN')}<br><br><em style="color:rgba(255,255,255,0.35)">Apply basal dose before sowing, split remaining across growth stages.</em>`;
//   showResult('fertResult');
// }
 
// function calcPesticide(){
//   const pesticide=document.getElementById('pPesticide').value;
//   const tank=parseFloat(document.getElementById('pTank').value)||15;
//   const area=parseFloat(document.getElementById('pArea').value)||1;
//   const db={'Mancozeb 75% WP':{dose:30,phi:14,mode:'Multi-site contact fungicide',tpa:2},'Chlorpyrifos 20% EC':{dose:30,phi:21,mode:'Broad-spectrum organophosphate',tpa:2},'Imidacloprid 17.8% SL':{dose:5,phi:14,mode:'Systemic neonicotinoid insecticide',tpa:2},'Propiconazole 25% EC':{dose:8,phi:21,mode:'Systemic triazole fungicide',tpa:2},'Tricyclazole 75% WP':{dose:6,phi:14,mode:'Systemic fungicide for blast',tpa:2},'Emamectin benzoate 5% SG':{dose:4,phi:14,mode:'Systemic avermectin insecticide',tpa:2},'Copper Oxychloride 50% WP':{dose:50,phi:7,mode:'Protective copper fungicide',tpa:2}};
//   const d=db[pesticide]||{dose:25,phi:14,mode:'Contact pesticide',tpa:2};
//   const totalTanks=Math.ceil(area*d.tpa*(tank<15?15/tank:1));
//   const totalProduct=((d.dose*totalTanks)/1000).toFixed(2);
//   const totalWater=Math.round(totalTanks*tank);
//   document.getElementById('pestResult').innerHTML=`<div class="stat-grid-2"><div class="stat-box"><div class="stat-box-label">Dose per Tank</div><div class="stat-box-value">${d.dose}g/ml</div></div><div class="stat-box"><div class="stat-box-label">Tanks Needed</div><div class="stat-box-value">${totalTanks}</div></div><div class="stat-box"><div class="stat-box-label">Total Product</div><div class="stat-box-value">${totalProduct} kg</div></div><div class="stat-box"><div class="stat-box-label">Water Required</div><div class="stat-box-value">${totalWater} L</div></div></div><div class="result-text"><strong>⚠️ Pre-Harvest Interval:</strong> Do not harvest within <strong>${d.phi} days</strong> of spraying.<br><strong>Mode:</strong> ${d.mode}<br><br>• Spray early morning (6–9 AM) for best efficacy<br>• Wear protective clothing while spraying</div>`;
//   showResult('pestResult');
// }
 
// function calcFarming(){
//   const crop=document.getElementById('fcCrop').value;
//   const area=parseFloat(document.getElementById('fcArea').value)||2;
//   const seed=parseFloat(document.getElementById('fcSeed').value)||2000;
//   const fert=parseFloat(document.getElementById('fcFert').value)||3500;
//   const labour=parseFloat(document.getElementById('fcLabour').value)||5000;
//   const mktPrice=parseFloat(document.getElementById('fcPrice').value)||2100;
//   const baseYield={Wheat:18,Rice:22,Maize:20,Millets:12,Sorghum:14,Tomato:80,Cotton:8,Potato:100,Soybean:12,Groundnut:10,Sugarcane:350,Sunflower:10};
//   const otherCosts=Math.round(area*3500);
//   const totalCost=seed+fert+labour+otherCosts;
//   const yield_q=Math.round((baseYield[crop]||18)*area);
//   const revenue=yield_q*mktPrice;
//   const profit=revenue-totalCost;
//   const roi=Math.round((profit/totalCost)*100);
//   const breakeven=Math.ceil(totalCost/yield_q);
//   const pc=profit>=0?'#5DCAA5':'#F09595';
//   document.getElementById('farmResult').innerHTML=`<div class="stat-grid-2"><div class="stat-box"><div class="stat-box-label">Total Cost</div><div class="stat-box-value" style="color:#F09595">₹${totalCost.toLocaleString('en-IN')}</div></div><div class="stat-box"><div class="stat-box-label">Expected Yield</div><div class="stat-box-value">${yield_q} Q</div></div><div class="stat-box"><div class="stat-box-label">Gross Revenue</div><div class="stat-box-value" style="color:var(--mint)">₹${revenue.toLocaleString('en-IN')}</div></div><div class="stat-box"><div class="stat-box-label">Net Profit</div><div class="stat-box-value" style="color:${pc}">₹${profit.toLocaleString('en-IN')}</div></div></div><div class="result-text"><strong>ROI: ${roi}%</strong> — ${profit>0?'✅ Profitable season':'⚠️ Review your input costs'}<br><strong>Breakeven Price:</strong> ₹${breakeven}/quintal<br><em style="color:rgba(255,255,255,0.35)">Includes ₹${otherCosts.toLocaleString('en-IN')} for machinery, irrigation, and misc.</em></div>`;
//   showResult('farmResult');
// }
 
// function calcIrrigation(){
//   const crop=document.getElementById('irCrop').value;
//   const stage=document.getElementById('irStage').value;
//   const soil=document.getElementById('irSoil').value;
//   const area=parseFloat(document.getElementById('irArea').value)||1;
//   const etc={Wheat:{Sowing:2,Vegetative:4,Flowering:6,Maturity:3},Rice:{Sowing:5,Vegetative:7,Flowering:9,Maturity:6},Maize:{Sowing:2,Vegetative:4.5,Flowering:6.5,Maturity:3},Millets:{Sowing:1.5,Vegetative:3,Flowering:4.5,Maturity:2.5},Sorghum:{Sowing:1.5,Vegetative:3.5,Flowering:5,Maturity:2.5},Tomato:{Sowing:2,Vegetative:4,Flowering:7,Maturity:5},Cotton:{Sowing:2,Vegetative:5,Flowering:7,Maturity:4},Potato:{Sowing:2,Vegetative:4,Flowering:6,Maturity:4},Soybean:{Sowing:2,Vegetative:4,Flowering:6,Maturity:3},Groundnut:{Sowing:2,Vegetative:3.5,Flowering:5.5,Maturity:3},Sugarcane:{Sowing:4,Vegetative:8,Flowering:10,Maturity:6},Sunflower:{Sowing:2,Vegetative:4,Flowering:6.5,Maturity:3}};
//   const sf={Sandy:0.7,'Sandy Loam':0.8,Loamy:1.0,'Clay Loam':1.2,Clay:1.4};
//   const sk=stage.split(' ')[0]==='Flowering'?'Flowering':stage;
//   const dailyMM=((etc[crop]||etc.Wheat)[sk]||4)*(sf[soil]||1);
//   const freq=soil==='Sandy'?3:soil==='Sandy Loam'?4:soil==='Clay'?8:5;
//   const areaM2=area*4047;
//   const waterL=Math.round(dailyMM*freq*areaM2/1000);
//   const dailyL=Math.round(dailyMM*areaM2/1000);
//   const method=soil==='Sandy'||soil==='Sandy Loam'?'Drip Irrigation':'Sprinkler / Furrow';
//   const today=new Date();
//   const dates=[0,freq,freq*2].map(d=>{const dt=new Date(today);dt.setDate(dt.getDate()+d);return dt.toLocaleDateString('en-IN',{day:'numeric',month:'short'});});
//   document.getElementById('irriResult').innerHTML=`<div class="stat-grid-2"><div class="stat-box"><div class="stat-box-label">Water / Cycle</div><div class="stat-box-value">${waterL.toLocaleString()} L</div></div><div class="stat-box"><div class="stat-box-label">Frequency</div><div class="stat-box-value">Every ${freq} days</div></div><div class="stat-box"><div class="stat-box-label">Daily Need</div><div class="stat-box-value">${dailyL.toLocaleString()} L</div></div><div class="stat-box"><div class="stat-box-label">Method</div><div class="stat-box-value" style="font-size:0.95rem">${method.split(' ')[0]}</div></div></div><div class="result-text"><strong>Method:</strong> ${method}<br><strong>Schedule:</strong> ${dates.join(' → ')} → …<br><br>• Irrigate early morning (5–8 AM)<br>• Use soil moisture meter for precision</div>`;
//   showResult('irriResult');
// }
 
// function calcSoil(){
//   const ph=parseFloat(document.getElementById('sPH').value)||6.5;
//   const oc=parseFloat(document.getElementById('sOC').value)||0.4;
//   const N=parseFloat(document.getElementById('sN').value)||180;
//   const P=parseFloat(document.getElementById('sP').value)||12;
//   const K=parseFloat(document.getElementById('sK').value)||150;
//   const params=[
//     {name:'pH',value:ph.toFixed(1),score:ph>=6.0&&ph<=7.5?100:ph>=5.5&&ph<=8.0?60:25,status:ph>=6.0&&ph<=7.5?'✅ Optimal':ph<6.0?'⚠️ Acidic':'⚠️ Alkaline',action:ph<6.0?`Apply lime @ ${Math.round((6.2-ph)*1000)} kg/ha`:ph>7.5?'Apply gypsum to lower pH':'pH in optimal range',color:ph>=6.0&&ph<=7.5?'#5DCAA5':'#EF9F27'},
//     {name:'Organic Carbon',value:oc.toFixed(2)+'%',score:oc>=0.75?100:oc>=0.5?70:oc>=0.25?40:15,status:oc>=0.75?'✅ High':oc>=0.5?'🔶 Medium':'🔴 Low',action:oc<0.5?'Apply FYM @ 5–10 t/ha':'Good — maintain with crop residue',color:oc>=0.5?'#5DCAA5':'#F09595'},
//     {name:'Nitrogen',value:N+' kg/ha',score:N>=280?100:N>=140?65:30,status:N>=280?'✅ High':N>=140?'🔶 Medium':'🔴 Low',action:N<140?`Apply Urea @ ${Math.round((200-N)*2.17)} kg/ha`:'Apply balanced top-dressing',color:N>=140?'#5DCAA5':'#F09595'},
//     {name:'Phosphorus',value:P+' kg/ha',score:P>=25?100:P>=11?65:30,status:P>=25?'✅ High':P>=11?'🔶 Medium':'🔴 Low',action:P<11?`Apply DAP @ ${Math.round((20-P)*2.2)} kg/ha`:'Adequate — maintenance dose at sowing',color:P>=11?'#5DCAA5':'#F09595'},
//     {name:'Potassium',value:K+' kg/ha',score:K>=280?100:K>=110?65:30,status:K>=280?'✅ High':K>=110?'🔶 Medium':'🔴 Low',action:K<110?`Apply MOP @ ${Math.round((200-K)*1.67)} kg/ha`:'Good — continue maintenance',color:K>=110?'#5DCAA5':'#F09595'},
//   ];
//   const avg=Math.round(params.reduce((a,b)=>a+b.score,0)/params.length);
//   const hl=avg>=80?'Excellent 🟢':avg>=55?'Good 🟡':avg>=30?'Fair 🟠':'Poor 🔴';
//   document.getElementById('soilResult').innerHTML=`<div style="margin-bottom:16px;padding:16px;background:rgba(255,255,255,0.05);border-radius:14px;border:1px solid rgba(126,201,154,0.12)"><div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.3);margin-bottom:5px">Overall Soil Health</div><div style="font-family:'Fraunces',serif;font-size:1.6rem;font-weight:700;color:var(--mint)">${hl} · ${avg}%</div></div>${params.map(p=>`<div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:13px 16px;margin-bottom:10px;border-left:3px solid ${p.color};border-top:1px solid rgba(255,255,255,0.04);border-right:1px solid rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.04)"><div style="font-weight:700;font-size:0.87rem;color:${p.color}">${p.name}: ${p.value} — ${p.status}</div><div style="font-size:0.8rem;color:rgba(255,255,255,0.42);margin-top:5px">${p.action}</div></div>`).join('')}`;
//   showResult('soilResult');
// }
 
// function calcYield(){
//   const crop=document.getElementById('yCrop').value;
//   const area=parseFloat(document.getElementById('yArea').value)||2;
//   const irri=document.getElementById('yIrri').value;
//   const soil=document.getElementById('ySoil').value;
//   const bY={Wheat:18,Rice:22,Maize:20,Millets:12,Sorghum:14,Tomato:80,Cotton:8,Potato:100,Soybean:12,Groundnut:10,Sugarcane:350,Sunflower:10};
//   const iM={Drip:1.3,Sprinkler:1.15,Flood:1.0,Rainfed:0.75};
//   const sM={Excellent:1.2,Good:1.0,Average:0.8,Poor:0.6};
//   const msp={Wheat:2275,Rice:2183,Maize:1962,Millets:2500,Sorghum:3180,Tomato:1200,Cotton:7020,Potato:920,Soybean:4600,Groundnut:6377,Sugarcane:315,Sunflower:6760};
//   const ypa=Math.round((bY[crop]||18)*(iM[irri]||1)*(sM[soil]||1)*10)/10;
//   const totalY=Math.round(ypa*area*10)/10;
//   const price=msp[crop]||2000;
//   const rev=Math.round(totalY*price);
//   document.getElementById('yieldResult').innerHTML=`<div style="text-align:center;background:rgba(255,255,255,0.05);padding:26px;border-radius:16px;border:1px solid rgba(126,201,154,0.12);margin-bottom:18px"><div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.3)">Expected Total Yield</div><div style="font-family:'Fraunces',serif;font-size:3rem;font-weight:700;color:var(--mint)">${totalY} Q</div><div style="font-size:0.78rem;color:rgba(255,255,255,0.3)">Range: ${Math.round(totalY*0.85*10)/10} – ${Math.round(totalY*1.15*10)/10} Quintals</div></div><div class="stat-grid-2"><div class="stat-box"><div class="stat-box-label">Per Acre</div><div class="stat-box-value">${ypa} Q</div></div><div class="stat-box"><div class="stat-box-label">Revenue Est.</div><div class="stat-box-value" style="font-size:1.1rem">₹${rev.toLocaleString('en-IN')}</div></div></div><div class="result-text" style="margin-top:14px">${irri==='Drip'?'• Drip irrigation gives 30% water saving + higher yield':irri==='Rainfed'?'• Consider supplemental irrigation during critical stages':'• Maintain current irrigation schedule'}<br>${soil==='Poor'||soil==='Average'?'• Add organic matter to boost yield by 20–40%':'• Excellent soil — maintain with balanced nutrition'}<br><em style="color:rgba(255,255,255,0.32)">${area}A · ${irri} · ${soil} soil · MSP ₹${price}/Q</em></div>`;
//   showResult('yieldResult');
// }
// /* ══════════════════════════════════════
//    RISK PREDICTOR SECTION 3D CANVAS
// ══════════════════════════════════════ */
// (function riskScene(){
//   const rc = makeRenderer('risk-canvas');
//   if(!rc) return;
//   const {renderer, canvas} = rc;
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(60,1,0.1,500);
//   camera.position.z = 5;

//   const COUNT = 600;
//   const geo = new THREE.BufferGeometry();
//   const pos = new Float32Array(COUNT*3);
//   const col = new Float32Array(COUNT*3);
//   const colors = [new THREE.Color(0x4A8C65),new THREE.Color(0x7EC99A),new THREE.Color(0xD4A853),new THREE.Color(0x1C3A28)];
//   for(let i=0;i<COUNT;i++){
//     pos[i*3]=(Math.random()-0.5)*28; pos[i*3+1]=(Math.random()-0.5)*18; pos[i*3+2]=(Math.random()-0.5)*12;
//     const c=colors[Math.floor(Math.random()*colors.length)];
//     col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
//   }
//   geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
//   geo.setAttribute('color',new THREE.BufferAttribute(col,3));
//   const mat = new THREE.PointsMaterial({size:0.055,vertexColors:true,transparent:true,opacity:0.5});
//   scene.add(new THREE.Points(geo,mat));

//   function resize(){
//     const w=canvas.parentElement.offsetWidth, h=canvas.parentElement.offsetHeight;
//     renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
//   }
//   resize(); window.addEventListener('resize',resize);

//   let t=0;
//   (function animate(){ requestAnimationFrame(animate); t+=0.004; scene.rotation.y=t*0.03; renderer.render(scene,camera); })();
// })();

// /* ══════════════════════════════════════
//    CROP DISEASE RISK PREDICTOR — ML MODEL & UI
// ══════════════════════════════════════ */
// const CDR_MODEL = {"tree":{"feature":"pH","threshold":5.195,"left":{"leaf":"High","counts":[1,0,0]},"right":{"feature":"pH","threshold":8.005,"left":{"feature":"EC_mS_cm","threshold":2.005,"left":{"feature":"Nitrogen_ppm","threshold":29.995,"left":{"feature":"Organic_Matter_%","threshold":0.595,"left":{"leaf":"High","counts":[1,0,0]},"right":{"leaf":"Medium","counts":[0,0,1]}},"right":{"feature":"Phosphorus_ppm","threshold":11.995,"left":{"feature":"Organic_Matter_%","threshold":0.595,"left":{"leaf":"High","counts":[1,0,0]},"right":{"leaf":"Medium","counts":[0,0,1]}},"right":{"feature":"Potassium_ppm","threshold":34.995,"left":{"feature":"Organic_Matter_%","threshold":0.595,"left":{"leaf":"High","counts":[1,0,0]},"right":{"leaf":"Medium","counts":[0,0,1]}},"right":{"feature":"Organic_Matter_%","threshold":0.595,"left":{"leaf":"High","counts":[1,0,0]},"right":{"leaf":"Low","counts":[0,1,0]}}}}},"right":{"leaf":"High","counts":[1,0,0]}},"right":{"leaf":"High","counts":[1,0,0]}}},"crop_encoding":{"Apple":0,"Arecanut":1,"Banana":2,"Barley":3,"Bitter Gourd":4,"Black Gram":5,"Bottle Gourd":6,"Brinjal":7,"Cabbage":8,"Capsicum":9,"Carrot":10,"Castor":11,"Cauliflower":12,"Chickpea":13,"Cocoa":14,"Coconut":15,"Coffee":16,"Cotton":17,"Field Pea":18,"Grapes":19,"Green Gram":20,"Groundnut":21,"Guava":22,"Jute":23,"Lentil":24,"Maize":25,"Mango":26,"Millet":27,"Muskmelon":28,"Mustard":29,"Okra":30,"Onion":31,"Orange":32,"Papaya":33,"Peas":34,"Pigeon Pea":35,"Pineapple":36,"Pomegranate":37,"Potato":38,"Ragi":39,"Rice":40,"Rubber":41,"Sapota":42,"Sesame":43,"Sorghum":44,"Soybean":45,"Spinach":46,"Sugarcane":47,"Sunflower":48,"Tea":49,"Tobacco":50,"Tomato":51,"Watermelon":52,"Wheat":53}};

// function cdrTraverse(node, features){
//   if(node.leaf) return node.leaf;
//   return features[node.feature] <= node.threshold ? cdrTraverse(node.left,features) : cdrTraverse(node.right,features);
// }

// function cdrPredict(){
//   const crop     = document.getElementById('cropSelect').value;
//   const pH       = parseFloat(document.getElementById('cdrPH').value);
//   const N        = parseFloat(document.getElementById('cdrNitrogen').value);
//   const P        = parseFloat(document.getElementById('cdrPhosphorus').value);
//   const K        = parseFloat(document.getElementById('cdrPotassium').value);
//   const OM       = parseFloat(document.getElementById('cdrOrganicMatter').value);
//   const EC       = parseFloat(document.getElementById('cdrEC').value);
//   const moisture = parseFloat(document.getElementById('cdrMoisture').value)||40;
//   const temp     = parseFloat(document.getElementById('cdrTemperature').value)||28;
//   const humidity = parseFloat(document.getElementById('cdrHumidity').value)||68;

//   const errors = [];
//   if(!crop) errors.push('cropSelect');
//   if(isNaN(pH)) errors.push('cdrPH');
//   if(isNaN(N))  errors.push('cdrNitrogen');
//   if(isNaN(P))  errors.push('cdrPhosphorus');
//   if(isNaN(K))  errors.push('cdrPotassium');
//   if(isNaN(OM)) errors.push('cdrOrganicMatter');
//   if(isNaN(EC)) errors.push('cdrEC');

//   document.querySelectorAll('#cdrWidget .cdr-input-wrap input, #cdrWidget .cdr-crop-select').forEach(el=>el.classList.remove('error'));
//   if(errors.length){ errors.forEach(id=>document.getElementById(id)?.classList.add('error')); return; }

//   const features = {'pH':pH,'Nitrogen_ppm':N,'Phosphorus_ppm':P,'Potassium_ppm':K,'Organic_Matter_%':OM,'EC_mS_cm':EC,'Moisture_%':moisture,'Temperature_C':temp,'Humidity_%':humidity,'Crop_enc':CDR_MODEL.crop_encoding[crop]??0};
//   cdrShowResult(cdrTraverse(CDR_MODEL.tree, features), crop, {pH,N,P,K,OM,EC,moisture,temp,humidity});
// }

// function cdrShowResult(risk, crop, v){
//   const header = document.getElementById('cdrResultHeader');
//   document.getElementById('cdrRiskLabel').textContent = risk+' Risk';
//   header.className = 'cdr-result-header risk-'+risk;
//   document.getElementById('cdrResultTitle').textContent = risk==='High' ? 'Elevated disease susceptibility detected' : risk==='Medium' ? 'Moderate risk — monitor conditions' : 'Soil conditions look favourable';
//   document.getElementById('cdrResultCrop').textContent = 'Crop: '+crop;

//   const advMap = {
//     High:[
//       {icon:'⚠️',title:'Preventive Fungicide Application',body:'High-risk soil profile detected. Consider applying a broad-spectrum fungicide as a protective measure before symptoms appear.'},
//       {icon:'💧',title:'Review Irrigation Practices',body:v.EC>2?`EC at ${v.EC} mS/cm indicates salt stress — flush soil with clean water to reduce conductivity.`:'Avoid waterlogging; ensure drainage channels are clear to reduce moisture-borne pathogens.'},
//       {icon:'🧪',title:'Soil Amendment Recommended',body:v.OM<0.6?'Organic matter is very low. Add compost or vermicompost to improve soil structure and microbial health.':v.pH<5.2?'Soil is highly acidic. Apply agricultural lime to raise pH towards optimal range.':v.pH>8?'Alkaline soil detected. Use sulphur or acidic fertilisers to lower pH.':'Balance NPK ratios and consider micronutrient supplementation.'}
//     ],
//     Medium:[
//       {icon:'👁️',title:'Increased Field Monitoring',body:'Inspect crop leaves and stems weekly. Early symptoms of fungal or bacterial disease should be treated immediately.'},
//       {icon:'🌱',title:'Improve Soil Organic Matter',body:v.OM<1.5?'Organic matter is below optimal. Green manuring or adding crop residue will improve disease suppression.':'Maintain current organic matter levels through crop rotation and residue management.'},
//       {icon:'📊',title:'Retest After Amendment',body:'Re-run a soil test in 4–6 weeks after applying amendments to track improvements in the risk profile.'}
//     ],
//     Low:[
//       {icon:'✅',title:'Soil Profile is Healthy',body:'Your key soil parameters are within optimal ranges. Continue current fertilisation and irrigation practices.'},
//       {icon:'🔄',title:'Maintain Crop Rotation',body:'Good soil health is best preserved with a 2–3 year rotation cycle. Avoid growing the same crop consecutively.'},
//       {icon:'📅',title:'Routine Monitoring',body:'Even at low risk, inspect your crop bi-weekly and retest soil at the start of each season.'}
//     ]
//   };
//   document.getElementById('cdrAdvisories').innerHTML = (advMap[risk]||advMap.Low).map(a=>`<div class="cdr-advisory"><span class="cdr-advisory-icon">${a.icon}</span><div><strong>${a.title}</strong><span>${a.body}</span></div></div>`).join('');

//   const factors = [];
//   if(v.pH<5.5) factors.push({label:`pH ${v.pH} — Acidic`,cls:'alert'});
//   else if(v.pH>7.5) factors.push({label:`pH ${v.pH} — Alkaline`,cls:'warn'});
//   else factors.push({label:`pH ${v.pH} — Optimal`,cls:'good'});
//   if(v.EC>2) factors.push({label:`EC ${v.EC} — High Salinity`,cls:'alert'});
//   else if(v.EC>1.5) factors.push({label:`EC ${v.EC} — Moderate`,cls:'warn'});
//   else factors.push({label:`EC ${v.EC} — Normal`,cls:'good'});
//   if(v.N<30) factors.push({label:`N ${v.N} ppm — Deficient`,cls:'alert'});
//   else if(v.N>90) factors.push({label:`N ${v.N} ppm — Excess`,cls:'warn'});
//   else factors.push({label:`N ${v.N} ppm — Adequate`,cls:'good'});
//   if(v.OM<0.6) factors.push({label:`OM ${v.OM}% — Very Low`,cls:'alert'});
//   else if(v.OM<1.5) factors.push({label:`OM ${v.OM}% — Low`,cls:'warn'});
//   else factors.push({label:`OM ${v.OM}% — Good`,cls:'good'});
//   factors.push(v.P<12?{label:`P ${v.P} ppm — Low`,cls:'warn'}:{label:`P ${v.P} ppm — OK`,cls:'good'});
//   factors.push(v.K<35?{label:`K ${v.K} ppm — Low`,cls:'warn'}:{label:`K ${v.K} ppm — OK`,cls:'good'});
//   document.getElementById('cdrFactorPills').innerHTML = factors.map(f=>`<span class="cdr-factor-pill ${f.cls}">${f.label}</span>`).join('');

//   document.getElementById('cdrResult').classList.add('visible');
//   document.getElementById('cdrResetBtn').style.display = 'block';
//   document.getElementById('cdrResult').scrollIntoView({behavior:'smooth',block:'nearest'});
// }

// function cdrToggleOptional(){
//   document.getElementById('cdrOptToggle').classList.toggle('open');
//   document.getElementById('cdrOptGrid').classList.toggle('visible');
// }

// function cdrReset(){
//   document.getElementById('cdrResult').classList.remove('visible');
//   document.getElementById('cdrResetBtn').style.display='none';
//   document.querySelectorAll('#cdrWidget .cdr-input-wrap input').forEach(el=>{el.value='';el.classList.remove('error');});
//   document.getElementById('cropSelect').value='';
//   document.getElementById('cdrWidget').scrollIntoView({behavior:'smooth',block:'nearest'});
// }

/* ══════════════════════════════════════
   THREE.JS 3D SCENE BUILDERS
══════════════════════════════════════ */
 
// ── Helper: build a renderer for a canvas
function makeRenderer(canvasId, alpha=true){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return null;
  const renderer = new THREE.WebGLRenderer({canvas, alpha, antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  return {renderer, canvas};
}
 
// ── HERO: Floating particle field with depth
(function heroScene(){
  const {renderer, canvas} = makeRenderer('hero-canvas') || {};
  if(!renderer) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 5;
 
  // Particle geometry
  const COUNT = 1200;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT*3);
  const col = new Float32Array(COUNT*3);
  const sizes = new Float32Array(COUNT);
  const colors = [
    new THREE.Color(0x4A8C65), new THREE.Color(0x7EC99A),
    new THREE.Color(0xD4A853), new THREE.Color(0x1C3A28),
    new THREE.Color(0xC8EDD6)
  ];
  for(let i=0;i<COUNT;i++){
    pos[i*3]   = (Math.random()-0.5)*30;
    pos[i*3+1] = (Math.random()-0.5)*20;
    pos[i*3+2] = (Math.random()-0.5)*15;
    const c = colors[Math.floor(Math.random()*colors.length)];
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    sizes[i] = Math.random()*3+0.5;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col,3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes,1));
  const mat = new THREE.PointsMaterial({
    size:0.06, vertexColors:true, transparent:true, opacity:0.7,
    sizeAttenuation:true
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
 
  // Floating organic meshes (leaf-like)
  const leafGeo = new THREE.SphereGeometry(0.15,8,6);
  const leafMat = new THREE.MeshBasicMaterial({color:0x4A8C65,transparent:true,opacity:0.12,wireframe:true});
  const leaves = [];
  for(let i=0;i<18;i++){
    const m = new THREE.Mesh(leafGeo,leafMat.clone());
    m.position.set((Math.random()-0.5)*20,(Math.random()-0.5)*14,(Math.random()-0.5)*8);
    const s = Math.random()*1.5+0.5;
    m.scale.setScalar(s);
    m.userData = {spd: Math.random()*0.008+0.002, phase: Math.random()*Math.PI*2};
    scene.add(m); leaves.push(m);
  }
 
  let mx=0, my=0;
  window.addEventListener('mousemove', e=>{
    mx = (e.clientX/window.innerWidth-0.5)*2;
    my = (e.clientY/window.innerHeight-0.5)*2;
  });
 
  function resize(){
    const s = canvas.parentElement;
    const w = s.offsetWidth, h = s.offsetHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
 
  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.006;
    pts.rotation.y = t*0.04;
    pts.rotation.x = Math.sin(t*0.02)*0.1;
    camera.position.x += (mx*1.2 - camera.position.x)*0.03;
    camera.position.y += (-my*0.8 - camera.position.y)*0.03;
    leaves.forEach(l=>{
      l.rotation.x = t*l.userData.spd;
      l.rotation.y = t*l.userData.spd*0.7;
      l.position.y += Math.sin(t + l.userData.phase)*0.001;
    });
    renderer.render(scene, camera);
  }
  animate();
})();
 
// ── DETECT: DNA helix / microscopic cell environment
(function detectScene(){
  const {renderer, canvas} = makeRenderer('detect-canvas') || {};
  if(!renderer) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  camera.position.set(0,0,12);
 
  // Helix points
  const helixGeo = new THREE.BufferGeometry();
  const helixPts = [];
  for(let i=0;i<400;i++){
    const t = i*0.08;
    helixPts.push(Math.cos(t)*3, t*0.1-12, Math.sin(t)*3);
    helixPts.push(Math.cos(t+Math.PI)*3, t*0.1-12, Math.sin(t+Math.PI)*3);
  }
  helixGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(helixPts),3));
  const helixMat = new THREE.PointsMaterial({color:0x4A8C65, size:0.05, transparent:true, opacity:0.4});
  const helix = new THREE.Points(helixGeo, helixMat);
  scene.add(helix);
 
  // Cell-like rings
  const rings = [];
  for(let i=0;i<8;i++){
    const rGeo = new THREE.TorusGeometry(Math.random()*2+0.5, 0.02, 8, 60);
    const rMat = new THREE.MeshBasicMaterial({color:0x2A5C3F, transparent:true, opacity:0.12+Math.random()*0.1});
    const r = new THREE.Mesh(rGeo, rMat);
    r.position.set((Math.random()-0.5)*12, (Math.random()-0.5)*10, (Math.random()-0.5)*4);
    r.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    r.userData = {spd:Math.random()*0.004+0.001};
    scene.add(r); rings.push(r);
  }
 
  function resize(){
    const s = canvas.parentElement;
    renderer.setSize(s.offsetWidth, s.offsetHeight, false);
    camera.aspect = s.offsetWidth/s.offsetHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
 
  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.005;
    helix.rotation.y = t*0.1;
    rings.forEach(r=>{ r.rotation.z += r.userData.spd; r.rotation.x += r.userData.spd*0.5; });
    renderer.render(scene, camera);
  }
  animate();
})();
 
// ── TOOLS: Floating geometric crystals
(function toolsScene(){
  const {renderer, canvas} = makeRenderer('tools-canvas') || {};
  if(!renderer) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  camera.position.z = 14;
 
  const crystals = [];
  const geos = [
    new THREE.OctahedronGeometry(0.4),
    new THREE.TetrahedronGeometry(0.4),
    new THREE.IcosahedronGeometry(0.3),
  ];
  const colors = [0x4A8C65, 0x7EC99A, 0xD4A853, 0x2A5C3F, 0xB5622A];
  for(let i=0;i<30;i++){
    const geo = geos[i%geos.length];
    const mat = new THREE.MeshBasicMaterial({
      color:colors[i%colors.length],
      wireframe:true, transparent:true, opacity:0.15+Math.random()*0.12
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.set((Math.random()-0.5)*28,(Math.random()-0.5)*20,(Math.random()-0.5)*8);
    m.scale.setScalar(Math.random()*2+0.5);
    m.userData={vx:(Math.random()-0.5)*0.003,vy:(Math.random()-0.5)*0.003,rx:Math.random()*0.008,ry:Math.random()*0.008};
    scene.add(m); crystals.push(m);
  }
 
  function resize(){
    const s = canvas.parentElement;
    renderer.setSize(s.offsetWidth, s.offsetHeight, false);
    camera.aspect = s.offsetWidth/s.offsetHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
 
  function animate(){
    requestAnimationFrame(animate);
    crystals.forEach(c=>{
      c.rotation.x += c.userData.rx;
      c.rotation.y += c.userData.ry;
      c.position.x += c.userData.vx;
      c.position.y += c.userData.vy;
      if(Math.abs(c.position.x)>14) c.userData.vx *= -1;
      if(Math.abs(c.position.y)>10) c.userData.vy *= -1;
    });
    renderer.render(scene, camera);
  }
  animate();
})();
 
// ── HOW IT WORKS: Flowing network / pathway
(function howScene(){
  const {renderer, canvas} = makeRenderer('how-canvas') || {};
  if(!renderer) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  camera.position.z = 10;
 
  // Network nodes
  const nodes=[], edges=[];
  const nodeMat = new THREE.MeshBasicMaterial({color:0x4A8C65,transparent:true,opacity:0.18});
  for(let i=0;i<40;i++){
    const g = new THREE.SphereGeometry(0.08,6,6);
    const n = new THREE.Mesh(g, nodeMat);
    n.position.set((Math.random()-0.5)*22,(Math.random()-0.5)*14,(Math.random()-0.5)*6);
    n.userData={vx:(Math.random()-0.5)*0.005,vy:(Math.random()-0.5)*0.005};
    scene.add(n); nodes.push(n);
  }
  // Connect nearby nodes
  const lineMat = new THREE.LineBasicMaterial({color:0x2A5C3F,transparent:true,opacity:0.12});
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      if(nodes[i].position.distanceTo(nodes[j].position)<5){
        const g = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
        const l = new THREE.Line(g, lineMat);
        scene.add(l); edges.push({line:l, a:nodes[i], b:nodes[j]});
      }
    }
  }
 
  // Flowing dots along a path
  const pathDotGeo = new THREE.SphereGeometry(0.05,6,6);
  const pathDotMat = new THREE.MeshBasicMaterial({color:0xD4A853,transparent:true,opacity:0.6});
  const pathDots = [];
  for(let i=0;i<8;i++){
    const d = new THREE.Mesh(pathDotGeo, pathDotMat);
    d.userData = {t: i/8};
    scene.add(d); pathDots.push(d);
  }
 
  function resize(){
    const s = canvas.parentElement;
    renderer.setSize(s.offsetWidth, s.offsetHeight, false);
    camera.aspect = s.offsetWidth/s.offsetHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
 
  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.005;
    nodes.forEach(n=>{
      n.position.x += n.userData.vx;
      n.position.y += n.userData.vy;
      if(Math.abs(n.position.x)>11) n.userData.vx *= -1;
      if(Math.abs(n.position.y)>7) n.userData.vy *= -1;
    });
    edges.forEach(e=>{
      const pts = [e.a.position.clone(), e.b.position.clone()];
      e.line.geometry.setFromPoints(pts);
    });
    pathDots.forEach(d=>{
      d.userData.t = (d.userData.t + 0.003) % 1;
      const a = d.userData.t * Math.PI * 2;
      d.position.set(Math.cos(a)*6, Math.sin(a*2)*2, Math.sin(a)*2);
    });
    renderer.render(scene, camera);
  }
  animate();
})();
 
// ── WEATHER: Atmospheric sky with particles
(function weatherScene(){
  const {renderer, canvas} = makeRenderer('weather-canvas') || {};
  if(!renderer) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  camera.position.z = 12;
 
  // Rain-like streaks
  const rainCount = 800;
  const rainGeo = new THREE.BufferGeometry();
  const rainPos = new Float32Array(rainCount*3);
  for(let i=0;i<rainCount;i++){
    rainPos[i*3]   = (Math.random()-0.5)*28;
    rainPos[i*3+1] = (Math.random()-0.5)*18;
    rainPos[i*3+2] = (Math.random()-0.5)*8;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos,3));
  const rainMat = new THREE.PointsMaterial({color:0x7DD3F8, size:0.04, transparent:true, opacity:0.4});
  const rain = new THREE.Points(rainGeo, rainMat);
  scene.add(rain);
 
  // Cloud-like spheres
  const cloudMat = new THREE.MeshBasicMaterial({color:0x0a4060, transparent:true, opacity:0.06, wireframe:false});
  const clouds=[];
  for(let i=0;i<12;i++){
    const g = new THREE.SphereGeometry(Math.random()*1.5+0.5, 8, 6);
    const c = new THREE.Mesh(g, cloudMat.clone());
    c.position.set((Math.random()-0.5)*20, (Math.random()-0.5)*12, (Math.random()-0.5)*4-4);
    c.userData={vx:(Math.random()-0.5)*0.003};
    scene.add(c); clouds.push(c);
  }
 
  function resize(){
    const s = canvas.parentElement;
    renderer.setSize(s.offsetWidth, s.offsetHeight, false);
    camera.aspect = s.offsetWidth/s.offsetHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
 
  const rp = rainGeo.attributes.position.array;
  function animate(){
    requestAnimationFrame(animate);
    for(let i=0;i<rainCount;i++){
      rp[i*3+1] -= 0.04;
      if(rp[i*3+1] < -9) rp[i*3+1] = 9;
    }
    rainGeo.attributes.position.needsUpdate = true;
    clouds.forEach(c=>{
      c.position.x += c.userData.vx;
      if(c.position.x > 12) c.position.x = -12;
    });
    renderer.render(scene, camera);
  }
  animate();
})();
 
/* ══════════════════════════════════════
   SCROLL REVEAL OBSERVER
══════════════════════════════════════ */
const ro = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('vis');});
},{threshold:0.1});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el=>ro.observe(el));
 
/* ══════════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════════ */
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);
});
 
/* ══════════════════════════════════════
   APP STATE
══════════════════════════════════════ */
let selectedCrop='Wheat', selectedUnit='acre', detectionResult=null;
 
/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
function toast(msg, type='ok'){
  const el=document.getElementById('toastNotif');
  el.textContent=(type==='ok'?'✅ ':'❌ ')+msg;
  el.className='notif-toast show'+(type==='error'?' error':'');
  clearTimeout(el._t);
  el._t=setTimeout(()=>el.className='notif-toast',3500);
}
 
/* ══════════════════════════════════════
   FILE UPLOAD
══════════════════════════════════════ */
function handleFileUpload(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const p=document.getElementById('imagePreview');
    p.src=ev.target.result; p.style.display='block';
    document.getElementById('uploadPlaceholder').style.display='none';
  };
  reader.readAsDataURL(file);
}
const uz=document.getElementById('uploadZone');
uz.addEventListener('dragover',e=>{e.preventDefault();uz.classList.add('dragover');});
uz.addEventListener('dragleave',()=>uz.classList.remove('dragover'));
uz.addEventListener('drop',e=>{
  e.preventDefault();uz.classList.remove('dragover');
  const f=e.dataTransfer.files[0];
  if(f?.type.startsWith('image/')){
    const dt=new DataTransfer();dt.items.add(f);
    document.getElementById('fileInput').files=dt.files;
    handleFileUpload({target:{files:dt.files}});
  }
});
 
/* ══════════════════════════════════════
   DETECTION
══════════════════════════════════════ */
async function runDetection(){
  const fi=document.getElementById('fileInput');
  if(!fi.files[0]){toast('Please upload a crop image first','error');return;}
  document.getElementById('resultEmpty').style.display='none';
  document.getElementById('resultContent').style.display='none';
  document.getElementById('detectionLoader').classList.add('on');
  document.getElementById('detectBtn').disabled=true;
  try{
    const fd=new FormData();
    fd.append('image',fi.files[0]);
    fd.append('crop',selectedCrop);
    const res=await fetch('/predict',{method:'POST',body:fd});
    if(!res.ok) throw new Error('Server error');
    const data=await res.json();
    renderDetectionResult({
      disease_name: data.disease,
      confidence: data.confidence,
      recommendation: data.recommendation || null
    });
  }catch(err){
    console.error(err);
    toast('Prediction failed. Check Flask server.','error');
    document.getElementById('detectionLoader').classList.remove('on');
    document.getElementById('detectBtn').disabled=false;
  }
}

function renderDetectionResult(d){
  detectionResult={...d, crop:selectedCrop};
  document.getElementById('detectionLoader').classList.remove('on');
  document.getElementById('detectBtn').disabled=false;

  const sev = d.recommendation ? d.recommendation.severity : 'none';
  const sevMap = {
    none:     {icon:'✅', cls:'healthy',  badge:'Healthy',   color:'#5DCAA5'},
    moderate: {icon:'⚠️', cls:'moderate', badge:'Moderate',  color:'#EF9F27'},
    high:     {icon:'🔴', cls:'high',     badge:'High Risk',  color:'#F09595'},
    critical: {icon:'🚨', cls:'critical', badge:'CRITICAL',   color:'#ff4444'}
  };
  const sm = sevMap[sev] || sevMap['moderate'];

  document.getElementById('resultIcon').textContent = sm.icon;
  document.getElementById('resultIcon').className   = 'result-icon ' + sm.cls;
  const displayName = d.disease_name.replace(/___/g,' — ').replace(/__/g,' — ').replace(/_/g,' ');
  document.getElementById('resultName').textContent  = displayName;
  document.getElementById('resultBadge').textContent = sm.badge;
  document.getElementById('confScore').textContent   = d.confidence + '%';

  const rc = document.getElementById('resultContent');
  const oldRec = document.getElementById('recPanel');
  if(oldRec) oldRec.remove();

  if(d.recommendation){
    const r = d.recommendation;
    const stepsHtml = r.immediate_steps.map(s =>
      `<li style="margin-bottom:6px;color:rgba(255,255,255,0.75);font-size:0.82rem">${s}</li>`
    ).join('');
    let treatHtml = '';
    for(const[k,v] of Object.entries(r.treatment)){
      const label = k.charAt(0).toUpperCase()+k.slice(1).replace(/_/g,' ');
      treatHtml += `<div style="margin-bottom:6px"><span style="color:${sm.color};font-size:0.73rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em">${label}:</span> <span style="color:rgba(255,255,255,0.78);font-size:0.82rem">${v}</span></div>`;
    }
    const prevHtml = r.prevention.map(p =>
      `<li style="margin-bottom:5px;color:rgba(255,255,255,0.7);font-size:0.82rem">${p}</li>`
    ).join('');

    const panel = document.createElement('div');
    panel.id = 'recPanel';
    panel.style.cssText = 'margin-top:18px;display:flex;flex-direction:column;gap:14px;';
    panel.innerHTML = `
      <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:14px 16px;border-left:3px solid ${sm.color}">
        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,0.35);margin-bottom:4px">📋 About this Disease</div>
        <div style="font-size:0.82rem;color:rgba(255,255,255,0.75)">${r.description}</div>
        <div style="margin-top:6px;font-size:0.78rem;color:rgba(255,255,255,0.45)">Cause: ${r.cause}</div>
      </div>
      <div style="background:rgba(255,68,68,0.07);border-radius:12px;padding:14px 16px;border:1px solid rgba(255,68,68,0.15)">
        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:.1em;color:#F09595;margin-bottom:8px">⚡ Immediate Action Required</div>
        <ul style="margin:0;padding-left:18px">${stepsHtml}</ul>
      </div>
      <div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:14px 16px;border:1px solid rgba(255,255,255,0.07)">
        <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:.1em;color:#EF9F27;margin-bottom:8px">💊 Treatment</div>
        ${treatHtml}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div style="background:rgba(93,202,165,0.07);border-radius:12px;padding:13px 14px;border:1px solid rgba(93,202,165,0.12)">
          <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:.1em;color:#5DCAA5;margin-bottom:7px">🛡️ Prevention</div>
          <ul style="margin:0;padding-left:16px">${prevHtml}</ul>
        </div>
        <div style="background:rgba(126,201,154,0.07);border-radius:12px;padding:13px 14px;border:1px solid rgba(126,201,154,0.12)">
          <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:.1em;color:#7EC99A;margin-bottom:7px">🌿 Organic Remedy</div>
          <div style="font-size:0.82rem;color:rgba(255,255,255,0.7)">${r.organic_remedy}</div>
        </div>
      </div>
      <div style="background:rgba(212,168,83,0.08);border-radius:12px;padding:12px 16px;border:1px solid rgba(212,168,83,0.15);display:flex;align-items:center;gap:10px">
        <span style="font-size:1.3rem">📉</span>
        <div>
          <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:.1em;color:#D4A853;margin-bottom:2px">Yield Impact</div>
          <div style="font-size:0.82rem;color:rgba(255,255,255,0.7)">${r.yield_impact}</div>
        </div>
      </div>
    `;
    rc.appendChild(panel);
  }

  document.getElementById('resultEmpty').style.display='none';
  rc.style.display='block';
  toast('Disease analysis complete!');
}

function resetDetection(){
  document.getElementById('fileInput').value='';
  document.getElementById('imagePreview').style.display='none';
  const ph=document.getElementById('uploadPlaceholder');
  ph.style.display='flex'; ph.style.flexDirection='column';
  ph.style.alignItems='center'; ph.style.gap='18px';
  document.getElementById('resultContent').style.display='none';
  document.getElementById('resultEmpty').style.display='flex';
  const oldRec=document.getElementById('recPanel');
  if(oldRec) oldRec.remove();
  detectionResult=null;
}

function downloadReport(){
  if(!detectionResult) return;
  const d=detectionResult;
  const r=d.recommendation;
  const line='─'.repeat(50);
  const displayName = d.disease_name.replace(/___/g,' — ').replace(/__/g,' — ').replace(/_/g,' ');
  let txt = `AGROSENSE AI — CROP DISEASE DIAGNOSIS REPORT\n${line}\nDate  : ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}\nCrop  : ${d.crop}\n${line}\n\nDIAGNOSIS\n  Disease    : ${displayName}\n  Confidence : ${d.confidence}%\n  Severity   : ${r ? r.severity.toUpperCase() : 'N/A'}\n`;
  if(r){
    txt+=`\n${line}\nABOUT THIS DISEASE\n  ${r.description}\n  Cause: ${r.cause}\n\n${line}\nIMMEDIATE ACTION STEPS\n${r.immediate_steps.map((s,i)=>`  ${i+1}. ${s}`).join('\n')}\n\n${line}\nTREATMENT\n${Object.entries(r.treatment).map(([k,v])=>`  ${k.toUpperCase().replace(/_/g,' ')}: ${v}`).join('\n')}\n\n${line}\nPREVENTION\n${r.prevention.map((p,i)=>`  ${i+1}. ${p}`).join('\n')}\n\n${line}\nORGANIC REMEDY\n  ${r.organic_remedy}\n\n${line}\nYIELD IMPACT\n  ${r.yield_impact}\n`;
  }
  txt+=`\n${line}\nGenerated by AgroSense AI Platform\n`;
  const blob=new Blob([txt],{type:'text/plain'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`AgroSense_Report_${d.disease_name.replace(/[^a-zA-Z]/g,'_')}.txt`;
  a.click();
  toast('Report downloaded!');
}

/* ══════════════════════════════════════
   MODALS
══════════════════════════════════════ */
function openModal(id){document.getElementById(id+'Modal').classList.add('open');}
function closeModal(id){document.getElementById(id+'Modal').classList.remove('open');}
function closeModalOnOverlay(e,id){if(e.target===document.getElementById(id))closeModal(id.replace('Modal',''));}
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));});
function setUnit(btn,unit){btn.parentElement.querySelectorAll('.unit-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');selectedUnit=unit;}
function showResult(id){document.getElementById(id).classList.add('show');}
 
/* ══════════════════════════════════════
   WEATHER
══════════════════════════════════════ */
async function geocodeCity(city){
  const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  const d=await r.json();
  if(!d.results?.length) throw new Error('City not found');
  return{lat:d.results[0].latitude,lon:d.results[0].longitude,name:d.results[0].name+', '+(d.results[0].country||'')};
}
async function fetchWeatherData(lat,lon,cityName){
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,visibility,uv_index,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max&hourly=temperature_2m,precipitation_probability,weather_code&timezone=auto&forecast_days=5`;
  const r=await fetch(url); const d=await r.json();
  renderWeather(d,cityName);
}
function wCode(c){
  if(c===0)return{icon:'☀️',label:'Clear sky'};
  if(c<=2)return{icon:'🌤️',label:'Partly cloudy'};
  if(c<=3)return{icon:'☁️',label:'Overcast'};
  if(c<=48)return{icon:'🌫️',label:'Foggy'};
  if(c<=55)return{icon:'🌦️',label:'Drizzle'};
  if(c<=67)return{icon:'🌧️',label:'Rain'};
  if(c<=77)return{icon:'❄️',label:'Snow'};
  if(c<=82)return{icon:'🌦️',label:'Rain showers'};
  if(c<=99)return{icon:'⛈️',label:'Thunderstorm'};
  return{icon:'⛅',label:'Unknown'};
}
function windDir(deg){const dirs=['N','NE','E','SE','S','SW','W','NW'];return dirs[Math.round(deg/45)%8];}
function uvLabel(uv){if(uv<=2)return'Low';if(uv<=5)return'Moderate';if(uv<=7)return'High';if(uv<=10)return'Very High';return'Extreme';}
function renderWeather(d,cityName){
  document.getElementById('weatherSkeleton').style.display='none';
  document.getElementById('weatherError').style.display='none';
  const cur=d.current;
  document.getElementById('currentCard').style.display='block';
  document.getElementById('weatherRightPanel').style.display='flex';
  document.getElementById('wcCity').textContent=cityName;
  const wc=wCode(cur.weather_code);
  document.getElementById('wcIcon').textContent=wc.icon;
  document.getElementById('wcTemp').textContent=Math.round(cur.temperature_2m);
  document.getElementById('wcCondition').textContent=wc.label;
  document.getElementById('wcFeels').textContent=Math.round(cur.apparent_temperature);
  document.getElementById('wcHumidity').textContent=cur.relative_humidity_2m+'%';
  document.getElementById('wcWind').textContent=Math.round(cur.wind_speed_10m)+' km/h';
  document.getElementById('wcWindDir').textContent=windDir(cur.wind_direction_10m);
  document.getElementById('wcRain').textContent=(cur.precipitation_probability||0)+'%';
  document.getElementById('wcUV').textContent=cur.uv_index??'—';
  document.getElementById('wcUVLabel').textContent=uvLabel(cur.uv_index||0);
  document.getElementById('wcVis').textContent=cur.visibility?Math.round(cur.visibility/1000):'—';
  document.getElementById('wcDew').textContent=Math.round(cur.dew_point_2m??0);
  const sr=new Date(d.daily.sunrise[0]),ss=new Date(d.daily.sunset[0]),now=new Date();
  document.getElementById('wcSunrise').textContent=sr.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  document.getElementById('wcSunset').textContent=ss.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  const pct=Math.round((Math.max(0,Math.min(ss-sr,now-sr))/(ss-sr))*100);
  document.getElementById('sunProgress').style.width=pct+'%';
  document.getElementById('sunDot').style.left=pct+'%';
  const fg=document.getElementById('forecastGrid');fg.innerHTML='';
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  for(let i=0;i<5;i++){
    const dt=new Date(d.daily.time[i]);const w=wCode(d.daily.weather_code[i]);
    fg.innerHTML+=`<div class="forecast-card"><div class="fc-day">${days[dt.getDay()]}</div><div class="fc-icon">${w.icon}</div><div class="fc-temp-hi">${Math.round(d.daily.temperature_2m_max[i])}°</div><div class="fc-temp-lo">${Math.round(d.daily.temperature_2m_min[i])}°</div><div class="fc-rain">🌧 ${d.daily.precipitation_probability_max[i]||0}%</div></div>`;
  }
  const hs=document.getElementById('hourlyScroll');hs.innerHTML='';
  const nowH=new Date().getHours();
  for(let i=nowH;i<nowH+24&&i<d.hourly.time.length;i++){
    const t2=new Date(d.hourly.time[i]);const w=wCode(d.hourly.weather_code[i]);
    hs.innerHTML+=`<div class="hourly-card"><div class="hc-time">${t2.getHours().toString().padStart(2,'0')}:00</div><div class="hc-icon">${w.icon}</div><div class="hc-temp">${Math.round(d.hourly.temperature_2m[i])}°</div><div class="hc-rain">${d.hourly.precipitation_probability[i]||0}%</div></div>`;
  }
  buildAdvisory(d.current,d.daily);
  buildCharts(d.daily);
}
function buildAdvisory(cur,daily){
  const grid=document.getElementById('advisoryGrid');grid.innerHTML='';
  const tips=[];
  const rain=daily.precipitation_probability_max[0]||0;
  const temp=Math.round(cur.temperature_2m);
  const hum=cur.relative_humidity_2m;
  if(rain>60) tips.push({icon:'☔',title:'Avoid Spraying',body:'High rain probability. Hold pesticide application until clear skies.'});
  else if(rain<15) tips.push({icon:'💧',title:'Irrigation Needed',body:'Low rain chance today. Consider supplemental irrigation.'});
  if(temp>38) tips.push({icon:'🌡️',title:'Heat Stress Alert',body:'High temperatures may stress crops. Irrigate early morning.'});
  if(hum>80) tips.push({icon:'🍄',title:'Fungal Risk High',body:'High humidity increases fungal disease risk. Apply preventive fungicide.'});
  if(tips.length===0) tips.push({icon:'✅',title:'Good Farming Day',body:'Weather conditions are favorable for field operations today.'});
  tips.push({icon:'🌱',title:'Soil Moisture',body:`Humidity at ${hum}%. ${hum>65?'Reduce irrigation frequency.':'Monitor soil moisture closely.'}`});
  tips.forEach(t=>{ grid.innerHTML+=`<div class="ag-tip"><div class="ag-tip-icon">${t.icon}</div><div><div class="ag-tip-title">${t.title}</div><div class="ag-tip-body">${t.body}</div></div></div>`; });
}
function buildCharts(daily){
  const rb=document.getElementById('rainBars');rb.innerHTML='';
  const days=['Su','Mo','Tu','We','Th'];
  for(let i=0;i<5;i++){
    const pct=daily.precipitation_probability_max[i]||0;
    const h=Math.max(3,Math.round((pct/100)*70));
    rb.innerHTML+=`<div class="rain-bar-wrap"><div class="rain-bar-pct">${pct}%</div><div class="rain-bar" style="height:${h}px"></div><div class="rain-bar-label">${days[i]}</div></div>`;
  }
  const tr=document.getElementById('tempRanges');tr.innerHTML='';
  const allT=[...daily.temperature_2m_max.slice(0,5),...daily.temperature_2m_min.slice(0,5)];
  const minT=Math.min(...allT)-2,range=Math.max(...allT)+2-minT;
  for(let i=0;i<5;i++){
    const lo=daily.temperature_2m_min[i],hi=daily.temperature_2m_max[i];
    const lp=((lo-minT)/range)*100,wp=((hi-lo)/range)*100;
    tr.innerHTML+=`<div class="temp-row"><div class="temp-day-label">${days[i]}</div><div class="temp-lo-label">${Math.round(lo)}°</div><div class="temp-range-bar-bg"><div class="temp-range-fill" style="left:${lp}%;width:${wp}%"></div></div><div class="temp-hi-label">${Math.round(hi)}°</div></div>`;
  }
}
function switchTab(tab){
  document.querySelectorAll('.wtab,.wtab-panel').forEach(el=>el.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  const map={forecast:0,hourly:1,advisory:2,charts:3};
  document.querySelectorAll('.wtab')[map[tab]]?.classList.add('active');
}
async function searchWeather(){
  const city=document.getElementById('locationInput').value.trim();
  if(!city){toast('Please enter a city name','error');return;}
  document.getElementById('weatherSkeleton').style.display='block';
  document.getElementById('currentCard').style.display='none';
  document.getElementById('weatherRightPanel').style.display='none';
  document.getElementById('weatherError').style.display='none';
  try{const geo=await geocodeCity(city);await fetchWeatherData(geo.lat,geo.lon,geo.name);}
  catch(e){showWeatherError(e.message);}
}
async function locateMe(){
  if(!navigator.geolocation){toast('Geolocation not supported','error');return;}
  navigator.geolocation.getCurrentPosition(async pos=>{
    const{latitude:lat,longitude:lon}=pos.coords;
    document.getElementById('weatherSkeleton').style.display='block';
    document.getElementById('currentCard').style.display='none';
    document.getElementById('weatherRightPanel').style.display='none';
    try{await fetchWeatherData(lat,lon,'My Location');}catch(e){showWeatherError(e.message);}
  },()=>toast('Location access denied','error'));
}
function showWeatherError(msg){
  document.getElementById('weatherSkeleton').style.display='none';
  document.getElementById('weatherError').style.display='block';
  document.getElementById('weatherErrorMsg').textContent=msg||'Unable to fetch weather data.';
}
async function loadDefaultWeather(){
  document.getElementById('locationInput').value='Ahmedabad';
  document.getElementById('weatherSkeleton').style.display='block';
  document.getElementById('weatherError').style.display='none';
  try{const geo=await geocodeCity('Ahmedabad');await fetchWeatherData(geo.lat,geo.lon,geo.name);}
  catch(e){showWeatherError(e.message);}
}
loadDefaultWeather();
 
/* ══════════════════════════════════════
   CHATBOT
══════════════════════════════════════ */
function toggleChat(){document.getElementById('chatWindow').classList.toggle('open');}
async function sendChatMessage(){
  const inp=document.getElementById('chatInput');const msg=inp.value.trim();if(!msg) return;
  addChatMsg(msg,'user');inp.value='';
  document.getElementById('chatTyping').classList.add('on');
  try{
    const r=await fetch('http://127.0.0.1:5000/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})});
    const data=await r.json();
    document.getElementById('chatTyping').classList.remove('on');
    addChatMsg(data.success?data.reply:'⚠️ AI service unavailable.','bot');
  }catch{
    document.getElementById('chatTyping').classList.remove('on');
    addChatMsg(offlineChat(msg),'bot');
  }
}
function addChatMsg(text,type){
  const div=document.createElement('div');
  div.className=`chat-msg ${type==='user'?'user':'bot'}`;
  div.textContent=text;
  const msgs=document.getElementById('chatMessages');
  msgs.appendChild(div);msgs.scrollTop=99999;
}
function offlineChat(msg){
  const m=msg.toLowerCase();
  if(['hi','hello','hey','namaste'].some(g=>m.includes(g))) return '👋 Hello! I can help with crop diseases, fertilizers, pest management, irrigation, and market prices. What\'s your farming question?';
  if(m.includes('rust')||m.includes('yellow stripe')) return '🌾 Yellow Rust: Apply Propiconazole 25% EC @ 0.5ml/L. Spray early morning and repeat after 14 days.';
  if(m.includes('blight')) return '🍅 Blight: Apply Mancozeb 75% WP @ 2g/L immediately. Remove infected leaves first.';
  if(m.includes('fertilizer')||m.includes('npk')) return '🌿 Use the Fertilizer Calculator tool for exact NPK amounts.';
  if(m.includes('pest')||m.includes('aphid')) return '🛡️ For sucking pests: Imidacloprid 17.8% SL @ 0.5ml/L.';
  if(m.includes('water')||m.includes('irrigation')) return '💧 Use the Irrigation Planner for smart watering schedules.';
  if(m.includes('soil')||m.includes('ph')) return '🪱 Ideal soil pH is 6.0–7.5 for most crops. Use the Soil Analyzer.';
  return 'I can help with crop diseases 🌿, fertilizers, irrigation 💧, pests 🛡️, soil health, and market prices 📈.';
}
 
/* ══════════════════════════════════════
   CALCULATORS
══════════════════════════════════════ */
function calcFertilizer(){
  const crop=document.getElementById('fCrop').value;
  const area=parseFloat(document.getElementById('fArea').value)||1;
  const stage=document.getElementById('fStage').value;
  const npk={Wheat:{N:120,P:60,K:40},Rice:{N:100,P:50,K:50},Maize:{N:150,P:75,K:50},Millets:{N:80,P:40,K:40},Sorghum:{N:90,P:40,K:30},Tomato:{N:150,P:75,K:125},Cotton:{N:60,P:30,K:30},Potato:{N:90,P:60,K:75},Soybean:{N:30,P:60,K:40},Groundnut:{N:20,P:40,K:40},Onion:{N:100,P:50,K:50},Chilli:{N:120,P:60,K:60},Sugarcane:{N:250,P:80,K:120},Sunflower:{N:90,P:60,K:60}};
  const sm={'Sowing / Basal':0.4,'Vegetative':0.35,'Flowering':0.15,'Fruiting / Grain Filling':0.1};
  const uH={acre:0.4047,hectare:1,gunta:0.01012};
  const areaHa=area*(uH[selectedUnit]||0.4047);
  const s=sm[stage]||0.4; const b=npk[crop]||npk.Wheat;
  const N=Math.round(b.N*areaHa*s),P=Math.round(b.P*areaHa*s),K=Math.round(b.K*areaHa*s);
  document.getElementById('nVal').textContent=N;
  document.getElementById('pVal').textContent=P;
  document.getElementById('kVal').textContent=K;
  const urea=Math.round(N/0.46),dap=Math.round(P/0.46),mop=Math.round(K/0.60);
  const cost=Math.round(urea*6.5+dap*27+mop*17);
  document.getElementById('fertDetails').innerHTML=`<strong>Products Required:</strong><br>• Urea (46% N): <strong>${urea} kg</strong><br>• DAP (18-46-0): <strong>${dap} kg</strong><br>• MOP (0-0-60): <strong>${mop} kg</strong><br><br><strong>Estimated Cost:</strong> ₹${cost.toLocaleString('en-IN')}<br><br><em style="color:rgba(255,255,255,0.35)">Apply basal dose before sowing, split remaining across growth stages.</em>`;
  showResult('fertResult');
}
 
function calcPesticide(){
  const pesticide=document.getElementById('pPesticide').value;
  const tank=parseFloat(document.getElementById('pTank').value)||15;
  const area=parseFloat(document.getElementById('pArea').value)||1;
  const db={'Mancozeb 75% WP':{dose:30,phi:14,mode:'Multi-site contact fungicide',tpa:2},'Chlorpyrifos 20% EC':{dose:30,phi:21,mode:'Broad-spectrum organophosphate',tpa:2},'Imidacloprid 17.8% SL':{dose:5,phi:14,mode:'Systemic neonicotinoid insecticide',tpa:2},'Propiconazole 25% EC':{dose:8,phi:21,mode:'Systemic triazole fungicide',tpa:2},'Tricyclazole 75% WP':{dose:6,phi:14,mode:'Systemic fungicide for blast',tpa:2},'Emamectin benzoate 5% SG':{dose:4,phi:14,mode:'Systemic avermectin insecticide',tpa:2},'Copper Oxychloride 50% WP':{dose:50,phi:7,mode:'Protective copper fungicide',tpa:2}};
  const d=db[pesticide]||{dose:25,phi:14,mode:'Contact pesticide',tpa:2};
  const totalTanks=Math.ceil(area*d.tpa*(tank<15?15/tank:1));
  const totalProduct=((d.dose*totalTanks)/1000).toFixed(2);
  const totalWater=Math.round(totalTanks*tank);
  document.getElementById('pestResult').innerHTML=`<div class="stat-grid-2"><div class="stat-box"><div class="stat-box-label">Dose per Tank</div><div class="stat-box-value">${d.dose}g/ml</div></div><div class="stat-box"><div class="stat-box-label">Tanks Needed</div><div class="stat-box-value">${totalTanks}</div></div><div class="stat-box"><div class="stat-box-label">Total Product</div><div class="stat-box-value">${totalProduct} kg</div></div><div class="stat-box"><div class="stat-box-label">Water Required</div><div class="stat-box-value">${totalWater} L</div></div></div><div class="result-text"><strong>⚠️ Pre-Harvest Interval:</strong> Do not harvest within <strong>${d.phi} days</strong> of spraying.<br><strong>Mode:</strong> ${d.mode}<br><br>• Spray early morning (6–9 AM) for best efficacy<br>• Wear protective clothing while spraying</div>`;
  showResult('pestResult');
}
 
function calcFarming(){
  const crop=document.getElementById('fcCrop').value;
  const area=parseFloat(document.getElementById('fcArea').value)||2;
  const seed=parseFloat(document.getElementById('fcSeed').value)||2000;
  const fert=parseFloat(document.getElementById('fcFert').value)||3500;
  const labour=parseFloat(document.getElementById('fcLabour').value)||5000;
  const mktPrice=parseFloat(document.getElementById('fcPrice').value)||2100;
  const baseYield={Wheat:18,Rice:22,Maize:20,Millets:12,Sorghum:14,Tomato:80,Cotton:8,Potato:100,Soybean:12,Groundnut:10,Sugarcane:350,Sunflower:10};
  const otherCosts=Math.round(area*3500);
  const totalCost=seed+fert+labour+otherCosts;
  const yield_q=Math.round((baseYield[crop]||18)*area);
  const revenue=yield_q*mktPrice;
  const profit=revenue-totalCost;
  const roi=Math.round((profit/totalCost)*100);
  const breakeven=Math.ceil(totalCost/yield_q);
  const pc=profit>=0?'#5DCAA5':'#F09595';
  document.getElementById('farmResult').innerHTML=`<div class="stat-grid-2"><div class="stat-box"><div class="stat-box-label">Total Cost</div><div class="stat-box-value" style="color:#F09595">₹${totalCost.toLocaleString('en-IN')}</div></div><div class="stat-box"><div class="stat-box-label">Expected Yield</div><div class="stat-box-value">${yield_q} Q</div></div><div class="stat-box"><div class="stat-box-label">Gross Revenue</div><div class="stat-box-value" style="color:var(--mint)">₹${revenue.toLocaleString('en-IN')}</div></div><div class="stat-box"><div class="stat-box-label">Net Profit</div><div class="stat-box-value" style="color:${pc}">₹${profit.toLocaleString('en-IN')}</div></div></div><div class="result-text"><strong>ROI: ${roi}%</strong> — ${profit>0?'✅ Profitable season':'⚠️ Review your input costs'}<br><strong>Breakeven Price:</strong> ₹${breakeven}/quintal<br><em style="color:rgba(255,255,255,0.35)">Includes ₹${otherCosts.toLocaleString('en-IN')} for machinery, irrigation, and misc.</em></div>`;
  showResult('farmResult');
}
 
function calcIrrigation(){
  const crop=document.getElementById('irCrop').value;
  const stage=document.getElementById('irStage').value;
  const soil=document.getElementById('irSoil').value;
  const area=parseFloat(document.getElementById('irArea').value)||1;
  const etc={Wheat:{Sowing:2,Vegetative:4,Flowering:6,Maturity:3},Rice:{Sowing:5,Vegetative:7,Flowering:9,Maturity:6},Maize:{Sowing:2,Vegetative:4.5,Flowering:6.5,Maturity:3},Millets:{Sowing:1.5,Vegetative:3,Flowering:4.5,Maturity:2.5},Sorghum:{Sowing:1.5,Vegetative:3.5,Flowering:5,Maturity:2.5},Tomato:{Sowing:2,Vegetative:4,Flowering:7,Maturity:5},Cotton:{Sowing:2,Vegetative:5,Flowering:7,Maturity:4},Potato:{Sowing:2,Vegetative:4,Flowering:6,Maturity:4},Soybean:{Sowing:2,Vegetative:4,Flowering:6,Maturity:3},Groundnut:{Sowing:2,Vegetative:3.5,Flowering:5.5,Maturity:3},Sugarcane:{Sowing:4,Vegetative:8,Flowering:10,Maturity:6},Sunflower:{Sowing:2,Vegetative:4,Flowering:6.5,Maturity:3}};
  const sf={Sandy:0.7,'Sandy Loam':0.8,Loamy:1.0,'Clay Loam':1.2,Clay:1.4};
  const sk=stage.split(' ')[0]==='Flowering'?'Flowering':stage;
  const dailyMM=((etc[crop]||etc.Wheat)[sk]||4)*(sf[soil]||1);
  const freq=soil==='Sandy'?3:soil==='Sandy Loam'?4:soil==='Clay'?8:5;
  const areaM2=area*4047;
  const waterL=Math.round(dailyMM*freq*areaM2/1000);
  const dailyL=Math.round(dailyMM*areaM2/1000);
  const method=soil==='Sandy'||soil==='Sandy Loam'?'Drip Irrigation':'Sprinkler / Furrow';
  const today=new Date();
  const dates=[0,freq,freq*2].map(d=>{const dt=new Date(today);dt.setDate(dt.getDate()+d);return dt.toLocaleDateString('en-IN',{day:'numeric',month:'short'});});
  document.getElementById('irriResult').innerHTML=`<div class="stat-grid-2"><div class="stat-box"><div class="stat-box-label">Water / Cycle</div><div class="stat-box-value">${waterL.toLocaleString()} L</div></div><div class="stat-box"><div class="stat-box-label">Frequency</div><div class="stat-box-value">Every ${freq} days</div></div><div class="stat-box"><div class="stat-box-label">Daily Need</div><div class="stat-box-value">${dailyL.toLocaleString()} L</div></div><div class="stat-box"><div class="stat-box-label">Method</div><div class="stat-box-value" style="font-size:0.95rem">${method.split(' ')[0]}</div></div></div><div class="result-text"><strong>Method:</strong> ${method}<br><strong>Schedule:</strong> ${dates.join(' → ')} → …<br><br>• Irrigate early morning (5–8 AM)<br>• Use soil moisture meter for precision</div>`;
  showResult('irriResult');
}
 
function calcSoil(){
  const ph=parseFloat(document.getElementById('sPH').value)||6.5;
  const oc=parseFloat(document.getElementById('sOC').value)||0.4;
  const N=parseFloat(document.getElementById('sN').value)||180;
  const P=parseFloat(document.getElementById('sP').value)||12;
  const K=parseFloat(document.getElementById('sK').value)||150;
  const params=[
    {name:'pH',value:ph.toFixed(1),score:ph>=6.0&&ph<=7.5?100:ph>=5.5&&ph<=8.0?60:25,status:ph>=6.0&&ph<=7.5?'✅ Optimal':ph<6.0?'⚠️ Acidic':'⚠️ Alkaline',action:ph<6.0?`Apply lime @ ${Math.round((6.2-ph)*1000)} kg/ha`:ph>7.5?'Apply gypsum to lower pH':'pH in optimal range',color:ph>=6.0&&ph<=7.5?'#5DCAA5':'#EF9F27'},
    {name:'Organic Carbon',value:oc.toFixed(2)+'%',score:oc>=0.75?100:oc>=0.5?70:oc>=0.25?40:15,status:oc>=0.75?'✅ High':oc>=0.5?'🔶 Medium':'🔴 Low',action:oc<0.5?'Apply FYM @ 5–10 t/ha':'Good — maintain with crop residue',color:oc>=0.5?'#5DCAA5':'#F09595'},
    {name:'Nitrogen',value:N+' kg/ha',score:N>=280?100:N>=140?65:30,status:N>=280?'✅ High':N>=140?'🔶 Medium':'🔴 Low',action:N<140?`Apply Urea @ ${Math.round((200-N)*2.17)} kg/ha`:'Apply balanced top-dressing',color:N>=140?'#5DCAA5':'#F09595'},
    {name:'Phosphorus',value:P+' kg/ha',score:P>=25?100:P>=11?65:30,status:P>=25?'✅ High':P>=11?'🔶 Medium':'🔴 Low',action:P<11?`Apply DAP @ ${Math.round((20-P)*2.2)} kg/ha`:'Adequate — maintenance dose at sowing',color:P>=11?'#5DCAA5':'#F09595'},
    {name:'Potassium',value:K+' kg/ha',score:K>=280?100:K>=110?65:30,status:K>=280?'✅ High':K>=110?'🔶 Medium':'🔴 Low',action:K<110?`Apply MOP @ ${Math.round((200-K)*1.67)} kg/ha`:'Good — continue maintenance',color:K>=110?'#5DCAA5':'#F09595'},
  ];
  const avg=Math.round(params.reduce((a,b)=>a+b.score,0)/params.length);
  const hl=avg>=80?'Excellent 🟢':avg>=55?'Good 🟡':avg>=30?'Fair 🟠':'Poor 🔴';
  document.getElementById('soilResult').innerHTML=`<div style="margin-bottom:16px;padding:16px;background:rgba(255,255,255,0.05);border-radius:14px;border:1px solid rgba(126,201,154,0.12)"><div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.3);margin-bottom:5px">Overall Soil Health</div><div style="font-family:'Fraunces',serif;font-size:1.6rem;font-weight:700;color:var(--mint)">${hl} · ${avg}%</div></div>${params.map(p=>`<div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:13px 16px;margin-bottom:10px;border-left:3px solid ${p.color};border-top:1px solid rgba(255,255,255,0.04);border-right:1px solid rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.04)"><div style="font-weight:700;font-size:0.87rem;color:${p.color}">${p.name}: ${p.value} — ${p.status}</div><div style="font-size:0.8rem;color:rgba(255,255,255,0.42);margin-top:5px">${p.action}</div></div>`).join('')}`;
  showResult('soilResult');
}
 
function calcYield(){
  const crop=document.getElementById('yCrop').value;
  const area=parseFloat(document.getElementById('yArea').value)||2;
  const irri=document.getElementById('yIrri').value;
  const soil=document.getElementById('ySoil').value;
  const bY={Wheat:18,Rice:22,Maize:20,Millets:12,Sorghum:14,Tomato:80,Cotton:8,Potato:100,Soybean:12,Groundnut:10,Sugarcane:350,Sunflower:10};
  const iM={Drip:1.3,Sprinkler:1.15,Flood:1.0,Rainfed:0.75};
  const sM={Excellent:1.2,Good:1.0,Average:0.8,Poor:0.6};
  const msp={Wheat:2275,Rice:2183,Maize:1962,Millets:2500,Sorghum:3180,Tomato:1200,Cotton:7020,Potato:920,Soybean:4600,Groundnut:6377,Sugarcane:315,Sunflower:6760};
  const ypa=Math.round((bY[crop]||18)*(iM[irri]||1)*(sM[soil]||1)*10)/10;
  const totalY=Math.round(ypa*area*10)/10;
  const price=msp[crop]||2000;
  const rev=Math.round(totalY*price);
  document.getElementById('yieldResult').innerHTML=`<div style="text-align:center;background:rgba(255,255,255,0.05);padding:26px;border-radius:16px;border:1px solid rgba(126,201,154,0.12);margin-bottom:18px"><div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.3)">Expected Total Yield</div><div style="font-family:'Fraunces',serif;font-size:3rem;font-weight:700;color:var(--mint)">${totalY} Q</div><div style="font-size:0.78rem;color:rgba(255,255,255,0.3)">Range: ${Math.round(totalY*0.85*10)/10} – ${Math.round(totalY*1.15*10)/10} Quintals</div></div><div class="stat-grid-2"><div class="stat-box"><div class="stat-box-label">Per Acre</div><div class="stat-box-value">${ypa} Q</div></div><div class="stat-box"><div class="stat-box-label">Revenue Est.</div><div class="stat-box-value" style="font-size:1.1rem">₹${rev.toLocaleString('en-IN')}</div></div></div><div class="result-text" style="margin-top:14px">${irri==='Drip'?'• Drip irrigation gives 30% water saving + higher yield':irri==='Rainfed'?'• Consider supplemental irrigation during critical stages':'• Maintain current irrigation schedule'}<br>${soil==='Poor'||soil==='Average'?'• Add organic matter to boost yield by 20–40%':'• Excellent soil — maintain with balanced nutrition'}<br><em style="color:rgba(255,255,255,0.32)">${area}A · ${irri} · ${soil} soil · MSP ₹${price}/Q</em></div>`;
  showResult('yieldResult');
}

/* ══════════════════════════════════════
   RISK PREDICTOR SECTION 3D CANVAS
══════════════════════════════════════ */
(function riskScene(){
  const rc = makeRenderer('risk-canvas');
  if(!rc) return;
  const {renderer, canvas} = rc;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60,1,0.1,500);
  camera.position.z = 5;
 
  const COUNT = 600;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT*3);
  const col = new Float32Array(COUNT*3);
  const colors = [new THREE.Color(0x4A8C65),new THREE.Color(0x7EC99A),new THREE.Color(0xD4A853),new THREE.Color(0x1C3A28)];
  for(let i=0;i<COUNT;i++){
    pos[i*3]=(Math.random()-0.5)*28; pos[i*3+1]=(Math.random()-0.5)*18; pos[i*3+2]=(Math.random()-0.5)*12;
    const c=colors[Math.floor(Math.random()*colors.length)];
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat = new THREE.PointsMaterial({size:0.055,vertexColors:true,transparent:true,opacity:0.5});
  scene.add(new THREE.Points(geo,mat));
 
  function resize(){
    const w=canvas.parentElement.offsetWidth, h=canvas.parentElement.offsetHeight;
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  }
  resize(); window.addEventListener('resize',resize);
 
  let t=0;
  (function animate(){ requestAnimationFrame(animate); t+=0.004; scene.rotation.y=t*0.03; renderer.render(scene,camera); })();
})();
 
/* ══════════════════════════════════════
   CROP DISEASE RISK PREDICTOR — ML MODEL & UI
══════════════════════════════════════ */
const CDR_MODEL = {"tree":{"feature":"pH","threshold":5.195,"left":{"leaf":"High","counts":[1,0,0]},"right":{"feature":"pH","threshold":8.005,"left":{"feature":"EC_mS_cm","threshold":2.005,"left":{"feature":"Nitrogen_ppm","threshold":29.995,"left":{"feature":"Organic_Matter_%","threshold":0.595,"left":{"leaf":"High","counts":[1,0,0]},"right":{"leaf":"Medium","counts":[0,0,1]}},"right":{"feature":"Phosphorus_ppm","threshold":11.995,"left":{"feature":"Organic_Matter_%","threshold":0.595,"left":{"leaf":"High","counts":[1,0,0]},"right":{"leaf":"Medium","counts":[0,0,1]}},"right":{"feature":"Potassium_ppm","threshold":34.995,"left":{"feature":"Organic_Matter_%","threshold":0.595,"left":{"leaf":"High","counts":[1,0,0]},"right":{"leaf":"Medium","counts":[0,0,1]}},"right":{"feature":"Organic_Matter_%","threshold":0.595,"left":{"leaf":"High","counts":[1,0,0]},"right":{"leaf":"Low","counts":[0,1,0]}}}}},"right":{"leaf":"High","counts":[1,0,0]}},"right":{"leaf":"High","counts":[1,0,0]}}},"crop_encoding":{"Apple":0,"Arecanut":1,"Banana":2,"Barley":3,"Bitter Gourd":4,"Black Gram":5,"Bottle Gourd":6,"Brinjal":7,"Cabbage":8,"Capsicum":9,"Carrot":10,"Castor":11,"Cauliflower":12,"Chickpea":13,"Cocoa":14,"Coconut":15,"Coffee":16,"Cotton":17,"Field Pea":18,"Grapes":19,"Green Gram":20,"Groundnut":21,"Guava":22,"Jute":23,"Lentil":24,"Maize":25,"Mango":26,"Millet":27,"Muskmelon":28,"Mustard":29,"Okra":30,"Onion":31,"Orange":32,"Papaya":33,"Peas":34,"Pigeon Pea":35,"Pineapple":36,"Pomegranate":37,"Potato":38,"Ragi":39,"Rice":40,"Rubber":41,"Sapota":42,"Sesame":43,"Sorghum":44,"Soybean":45,"Spinach":46,"Sugarcane":47,"Sunflower":48,"Tea":49,"Tobacco":50,"Tomato":51,"Watermelon":52,"Wheat":53}};
 
function cdrTraverse(node, features){
  if(node.leaf) return node.leaf;
  return features[node.feature] <= node.threshold ? cdrTraverse(node.left,features) : cdrTraverse(node.right,features);
}
 
function cdrPredict(){
  const crop     = document.getElementById('cropSelect').value;
  const pH       = parseFloat(document.getElementById('cdrPH').value);
  const N        = parseFloat(document.getElementById('cdrNitrogen').value);
  const P        = parseFloat(document.getElementById('cdrPhosphorus').value);
  const K        = parseFloat(document.getElementById('cdrPotassium').value);
  const OM       = parseFloat(document.getElementById('cdrOrganicMatter').value);
  const EC       = parseFloat(document.getElementById('cdrEC').value);
  const moisture = parseFloat(document.getElementById('cdrMoisture').value)||40;
  const temp     = parseFloat(document.getElementById('cdrTemperature').value)||28;
  const humidity = parseFloat(document.getElementById('cdrHumidity').value)||68;
 
  const errors = [];
  if(!crop) errors.push('cropSelect');
  if(isNaN(pH)) errors.push('cdrPH');
  if(isNaN(N))  errors.push('cdrNitrogen');
  if(isNaN(P))  errors.push('cdrPhosphorus');
  if(isNaN(K))  errors.push('cdrPotassium');
  if(isNaN(OM)) errors.push('cdrOrganicMatter');
  if(isNaN(EC)) errors.push('cdrEC');
 
  document.querySelectorAll('#cdrWidget .cdr-input-wrap input, #cdrWidget .cdr-crop-select').forEach(el=>el.classList.remove('error'));
  if(errors.length){ errors.forEach(id=>document.getElementById(id)?.classList.add('error')); return; }
 
  const features = {'pH':pH,'Nitrogen_ppm':N,'Phosphorus_ppm':P,'Potassium_ppm':K,'Organic_Matter_%':OM,'EC_mS_cm':EC,'Moisture_%':moisture,'Temperature_C':temp,'Humidity_%':humidity,'Crop_enc':CDR_MODEL.crop_encoding[crop]??0};
  cdrShowResult(cdrTraverse(CDR_MODEL.tree, features), crop, {pH,N,P,K,OM,EC,moisture,temp,humidity});
}
 
function cdrShowResult(risk, crop, v){
  const header = document.getElementById('cdrResultHeader');
  document.getElementById('cdrRiskLabel').textContent = risk+' Risk';
  header.className = 'cdr-result-header risk-'+risk;
  document.getElementById('cdrResultTitle').textContent = risk==='High' ? 'Elevated disease susceptibility detected' : risk==='Medium' ? 'Moderate risk — monitor conditions' : 'Soil conditions look favourable';
  document.getElementById('cdrResultCrop').textContent = 'Crop: '+crop;
 
  const advMap = {
    High:[
      {icon:'⚠️',title:'Preventive Fungicide Application',body:'High-risk soil profile detected. Consider applying a broad-spectrum fungicide as a protective measure before symptoms appear.'},
      {icon:'💧',title:'Review Irrigation Practices',body:v.EC>2?`EC at ${v.EC} mS/cm indicates salt stress — flush soil with clean water to reduce conductivity.`:'Avoid waterlogging; ensure drainage channels are clear to reduce moisture-borne pathogens.'},
      {icon:'🧪',title:'Soil Amendment Recommended',body:v.OM<0.6?'Organic matter is very low. Add compost or vermicompost to improve soil structure and microbial health.':v.pH<5.2?'Soil is highly acidic. Apply agricultural lime to raise pH towards optimal range.':v.pH>8?'Alkaline soil detected. Use sulphur or acidic fertilisers to lower pH.':'Balance NPK ratios and consider micronutrient supplementation.'}
    ],
    Medium:[
      {icon:'👁️',title:'Increased Field Monitoring',body:'Inspect crop leaves and stems weekly. Early symptoms of fungal or bacterial disease should be treated immediately.'},
      {icon:'🌱',title:'Improve Soil Organic Matter',body:v.OM<1.5?'Organic matter is below optimal. Green manuring or adding crop residue will improve disease suppression.':'Maintain current organic matter levels through crop rotation and residue management.'},
      {icon:'📊',title:'Retest After Amendment',body:'Re-run a soil test in 4–6 weeks after applying amendments to track improvements in the risk profile.'}
    ],
    Low:[
      {icon:'✅',title:'Soil Profile is Healthy',body:'Your key soil parameters are within optimal ranges. Continue current fertilisation and irrigation practices.'},
      {icon:'🔄',title:'Maintain Crop Rotation',body:'Good soil health is best preserved with a 2–3 year rotation cycle. Avoid growing the same crop consecutively.'},
      {icon:'📅',title:'Routine Monitoring',body:'Even at low risk, inspect your crop bi-weekly and retest soil at the start of each season.'}
    ]
  };
  document.getElementById('cdrAdvisories').innerHTML = (advMap[risk]||advMap.Low).map(a=>`<div class="cdr-advisory"><span class="cdr-advisory-icon">${a.icon}</span><div><strong>${a.title}</strong><span>${a.body}</span></div></div>`).join('');
 
  const factors = [];
  if(v.pH<5.5) factors.push({label:`pH ${v.pH} — Acidic`,cls:'alert'});
  else if(v.pH>7.5) factors.push({label:`pH ${v.pH} — Alkaline`,cls:'warn'});
  else factors.push({label:`pH ${v.pH} — Optimal`,cls:'good'});
  if(v.EC>2) factors.push({label:`EC ${v.EC} — High Salinity`,cls:'alert'});
  else if(v.EC>1.5) factors.push({label:`EC ${v.EC} — Moderate`,cls:'warn'});
  else factors.push({label:`EC ${v.EC} — Normal`,cls:'good'});
  if(v.N<30) factors.push({label:`N ${v.N} ppm — Deficient`,cls:'alert'});
  else if(v.N>90) factors.push({label:`N ${v.N} ppm — Excess`,cls:'warn'});
  else factors.push({label:`N ${v.N} ppm — Adequate`,cls:'good'});
  if(v.OM<0.6) factors.push({label:`OM ${v.OM}% — Very Low`,cls:'alert'});
  else if(v.OM<1.5) factors.push({label:`OM ${v.OM}% — Low`,cls:'warn'});
  else factors.push({label:`OM ${v.OM}% — Good`,cls:'good'});
  factors.push(v.P<12?{label:`P ${v.P} ppm — Low`,cls:'warn'}:{label:`P ${v.P} ppm — OK`,cls:'good'});
  factors.push(v.K<35?{label:`K ${v.K} ppm — Low`,cls:'warn'}:{label:`K ${v.K} ppm — OK`,cls:'good'});
  document.getElementById('cdrFactorPills').innerHTML = factors.map(f=>`<span class="cdr-factor-pill ${f.cls}">${f.label}</span>`).join('');
 
  document.getElementById('cdrResult').classList.add('visible');
  document.getElementById('cdrResetBtn').style.display = 'block';
  document.getElementById('cdrResult').scrollIntoView({behavior:'smooth',block:'nearest'});
}
 
function cdrToggleOptional(){
  document.getElementById('cdrOptToggle').classList.toggle('open');
  document.getElementById('cdrOptGrid').classList.toggle('visible');
}
 
function cdrReset(){
  document.getElementById('cdrResult').classList.remove('visible');
  document.getElementById('cdrResetBtn').style.display='none';
  document.querySelectorAll('#cdrWidget .cdr-input-wrap input').forEach(el=>{el.value='';el.classList.remove('error');});
  document.getElementById('cropSelect').value='';
  document.getElementById('cdrWidget').scrollIntoView({behavior:'smooth',block:'nearest'});
}