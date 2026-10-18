/* Per-project sequential imports. Persist decisions/receipts, never file bytes or text. */
(() => {
  const LIMIT=100,MAX_BYTES=8_000_000;
  const fields=['id','filename','size','lastModified','name','requestId','state','sha256','documentId','error','attempted','confirmation','keep','duplicateCount'];
  const states=new Set(['queued','reading','checking','saving','saved','failed','duplicate','cancelled','needs-file']);
  class Queue {
    constructor({projectId,id,storage,read,check,save,changed=()=>{}}) {
      Object.assign(this,{projectId,id,storage,read,check,save,changed});this.key='qt.importQueue.v1:'+projectId;
      this.rows=[];this.files=new Map();this.running=false;this.paused=true;this.storageError='';
      try {
        const raw=storage?.getItem(this.key);
        if(raw){
          const saved=JSON.parse(raw);
          if(saved.version!==1||saved.projectId!==projectId||!Array.isArray(saved.rows)||saved.rows.length>LIMIT)throw Error('Invalid queue history');
          const seen=new Set();
          for(const old of saved.rows){
            if(!old||!states.has(old.state)||typeof old.id!=='string'||old.id.length>100||seen.has(old.id)||typeof old.requestId!=='string'||!old.requestId||old.requestId.length>100||typeof old.filename!=='string'||old.filename.length>300||typeof old.name!=='string'||old.name.length>1024||!Number.isSafeInteger(old.size)||old.size<0||old.size>Number.MAX_SAFE_INTEGER||!(old.sha256===null||/^[a-f0-9]{64}$/.test(old.sha256))||!(old.confirmation===null||/^[a-f0-9]{64}$/.test(old.confirmation)))throw Error('Invalid queue item');
            seen.add(old.id);const row=Object.fromEntries(fields.map(k=>[k,old[k]]));
            if(!['saved','cancelled'].includes(row.state)){row.state='needs-file';row.error='Reselect the original file to continue.';}
            this.rows.push(row);
          }
        }
      } catch(error){this.rows=[];this.storageError='Queue history is unavailable. Reselect files; check saved documents before retrying.';}
    }
    emit() {
      try {
        if(!this.storage)throw Error('Storage unavailable');
        this.storage.setItem(this.key,JSON.stringify({version:1,projectId:this.projectId,rows:this.rows.map(row=>Object.fromEntries(fields.map(k=>[k,row[k]])))}));
      } catch(error){this.storageError='Queue history cannot be saved in this browser. Keep this page open; after refresh, check saved documents before importing again.';}
      this.changed(this);
    }
    add(files) {
      if(this.running)throw Error('Stop after the current file before adding files.');
      files=Array.from(files);if(!files.length)return;
      if(this.rows.length+files.length>LIMIT)throw Error('Choose at most 100 files per queue. Clear finished items before adding more.');
      for(const file of files){
        const row={id:this.id(),filename:file.name,size:file.size,lastModified:file.lastModified||0,name:file.name.replace(/\.(txt|docx)$/i,''),requestId:this.id(),state:'queued',sha256:null,documentId:null,error:'',attempted:false,confirmation:null,keep:false,duplicateCount:0};
        if(!/\.(txt|docx)$/i.test(file.name)){row.state='failed';row.error='Choose a TXT or DOCX file.';}
        else if(file.size>MAX_BYTES){row.state='failed';row.error='File exceeds 8 MB.';}
        else if(!row.name.trim()||row.name.length>200){row.state='failed';row.error='Document names must contain 1–200 characters.';}
        this.rows.push(row);this.files.set(row.id,file);
      }
      this.emit();
    }
    attach(files) {
      if(this.running)throw Error('Stop after the current file before reselecting files.');
      const matched=new Set();let attached=0;
      for(const file of files){
        const row=this.rows.find(r=>!matched.has(r.id)&&r.filename===file.name&&['needs-file','failed'].includes(r.state));
        if(!row)continue;
        matched.add(row.id);this.files.set(row.id,file);row.state='queued';row.error='';attached++;
      }
      this.emit();return attached;
    }
    rename(id,name) {
      const row=this.rows.find(r=>r.id===id);
      if(!row||row.attempted||this.running)return;
      row.name=name;this.emit();
    }
    pause(){this.paused=true;this.emit();}
    cancel(id){const row=this.rows.find(r=>r.id===id);if(!row||['saved','reading','checking','saving'].includes(row.state))return;row.state='cancelled';row.error='';row.keep=false;this.files.delete(id);this.emit();}
    retry(id){const row=this.rows.find(r=>r.id===id);if(!row||row.state!=='failed')return;row.state=this.files.has(id)?'queued':'needs-file';row.error='';this.emit();}
    keep(id){const row=this.rows.find(r=>r.id===id);if(!row||row.state!=='duplicate')return;row.keep=true;row.state='queued';row.error='';this.emit();}
    clearFinished(){if(this.running)return;this.rows=this.rows.filter(r=>!['saved','cancelled'].includes(r.state));const ids=new Set(this.rows.map(r=>r.id));for(const id of this.files.keys())if(!ids.has(id))this.files.delete(id);this.emit();}
    counts(){const count={total:this.rows.length,saved:0,failed:0,cancelled:0,duplicate:0,pending:0};for(const r of this.rows){if(r.state in count)count[r.state]++;else count.pending++;}return count;}
    async process(row) {
      const file=this.files.get(row.id);
      if(!file){row.state='needs-file';row.error='Reselect the original file to continue.';this.emit();return;}
      try {
        row.state='reading';row.error='';this.emit();
        if(!/\.(txt|docx)$/i.test(file.name))throw Error('Choose a TXT or DOCX file.');
        if(file.size>MAX_BYTES)throw Error('File exceeds 8 MB.');
        const body={...await this.read(file),name:row.name,request_id:row.requestId};
        row.state='checking';this.emit();const info=await this.check(body);
        if(!info.valid)throw Error(info.error||'This file could not be read.');
        if(row.sha256&&row.sha256!==info.sha256)throw Error('The source changed. Reselect the original file, or add the changed file as a new item.');
        row.sha256=info.sha256;row.name=info.name;
        if(info.remaining_documents===0&&!row.attempted)throw Error('This project already has 100 documents. Import into another project.');
        row.state='saving';row.attempted=true;this.emit();
        const result=await this.save({...body,name:info.name,expected_sha256:row.sha256,...(row.keep?{duplicate_confirmation:row.confirmation}:{})});
        if(result.requires_confirmation){row.state='duplicate';row.confirmation=result.duplicate.confirmation;row.keep=false;row.duplicateCount=result.duplicate.count;}
        else {if(typeof result.id!=='string')throw Error('The server did not confirm this import. Retry to check its result.');row.state='saved';row.documentId=result.id;row.confirmation=null;row.keep=false;this.files.delete(row.id);}
      } catch(error){row.state='failed';row.error=String(error.message||'Import interrupted. Retry this file.').slice(0,1000);}
      this.emit();
    }
    async run() {
      if(this.running)return;
      this.running=true;this.paused=false;this.emit();
      try {let row;while(!this.paused&&(row=this.rows.find(r=>r.state==='queued')))await this.process(row);}
      finally {this.running=false;this.emit();}
    }
  }
  async function readFile(file) {
    if(/\.txt$/i.test(file.name)){
      const buffer=await file.arrayBuffer();
      try{return {text:new TextDecoder('utf-8',{fatal:true}).decode(buffer)};}
      catch(error){throw Error('This TXT file is not valid UTF-8.');}
    }
    const bytes=new Uint8Array(await file.arrayBuffer());let binary='';
    for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
    return {docx_base64:btoa(binary)};
  }
  window.QTImportQueue={Queue,readFile,LIMIT};
})();
