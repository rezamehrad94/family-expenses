// Google Apps Script — همگام‌سازی خرج‌های خانواده
// 1) script.google.com ← New project ← این کد را بچسبان  2) KEY را عوض کن
// 3) Deploy ← New deployment ← Web app ← Execute as: Me ← Who has access: Anyone ← Deploy
// 4) آدرس /exec و همین KEY را در اپ، ⚙️ تنظیمات بگذار
const KEY="یک-کلید-دلخواه-بنویس";
function _file(){const it=DriveApp.getFilesByName("family-expenses.json");return it.hasNext()?it.next():DriveApp.createFile("family-expenses.json","{}")}
function _out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function _merge(a,b){const r={cfg:a.cfg,cu:a.cu||0,goal:a.goal||0,gu:a.gu||0,kala:a.kala,ku:a.ku||0};
  if((b.cu||0)>r.cu||(!r.cfg&&b.cfg)){r.cfg=b.cfg;r.cu=b.cu||0}
  if((b.gu||0)>r.gu){r.goal=b.goal;r.gu=b.gu}
  if((b.ku||0)>r.ku){r.kala=b.kala;r.ku=b.ku}
  const del=Object.assign({},a.del||{});for(const k in (b.del||{}))del[k]=Math.max(del[k]||0,b.del[k]);
  const m={};[].concat(a.txs||[],b.txs||[]).forEach(t=>{if(!m[t.id]||(t.u||0)>(m[t.id].u||0))m[t.id]=t});
  for(const k in del)if(m[k]&&(m[k].u||0)<=del[k])delete m[k];
  r.txs=Object.keys(m).map(k=>m[k]);r.del=del;return r}
function doGet(){return _out({ok:true})}
function doPost(e){const lock=LockService.getScriptLock();lock.waitLock(20000);
  try{const q=JSON.parse(e.postData.contents);if(q.k!==KEY)return _out({ok:false});
    const f=_file();let a={};try{a=JSON.parse(f.getBlob().getDataAsString())||{}}catch(x){}
    const r=_merge(a,q.s||{});f.setContent(JSON.stringify(r));return _out({ok:true,s:r})}
  finally{lock.releaseLock()}}
