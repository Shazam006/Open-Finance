import React from "react";
import { createRoot } from "react-dom/client";
import FinanceApp from "../app/finance-app";
import { actionSchema, applyAction } from "../lib/actions";
import { defaults, type Snapshot } from "../lib/finance";
import { backupSchema } from "../lib/backup";
import {newEntryId} from "../lib/ids";
import {nativeMode} from "../lib/native-port";
import {createNativeHandler} from "./native-handler";
(window as Window & {openFinanceLocal?:boolean}).openFinanceLocal=true;
const storage=nativeMode()?null:new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open((window as Window & {openFinanceMobile?:boolean}).openFinanceMobile?"open-finance-mobile":"open-finance-local",1);request.onupgradeneeded=()=>request.result.createObjectStore("document");request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error("Não foi possível abrir o armazenamento. Use Safari, Chrome ou Edge com o armazenamento permitido."));});
const nativeHandler=window.openFinanceNativePort?createNativeHandler(window.openFinanceNativePort):undefined;
const originalFetch=window.fetch.bind(window);
window.fetch=async function(input:RequestInfo|URL,init?:RequestInit):Promise<Response>{
  if(String(input)!=="/api/finance")return originalFetch(input,init);
  if(nativeHandler)return nativeHandler(init);
  try {
    const db=await storage;
    if(!db)throw new Error("Não foi possível abrir o armazenamento do aplicativo.");
    return await new Promise<Response>((resolve,reject)=>{
      const write=init?.method==="POST";const tx=db.transaction("document",write?"readwrite":"readonly");const table=tx.objectStore("document");const req=table.get("main");let response:Response;
      req.onsuccess=()=>{const current:Snapshot=req.result??{data:defaults(),revision:0};
        if(!write){response=Response.json(current);return;}
        try{const body=JSON.parse(String(init?.body));if(body.revision!==current.revision){response=Response.json({error:"Os dados mudaram em outra janela. Confira os valores e tente novamente.",snapshot:current},{status:409});return;}
          const next={data:body.action==="restore"?backupSchema.parse(body.backup).data:applyAction(current.data,actionSchema.parse(body),newEntryId()),revision:current.revision+1};table.put(next,"main");response=Response.json(next);
        }catch(error){response=Response.json({error:(error as Error).message||"Confira os campos."},{status:400});}
      };
      req.onerror=()=>reject(new Error("Não foi possível ler os registros."));
      tx.oncomplete=()=>resolve(response);
      tx.onabort=()=>reject(new Error("Não foi possível salvar. Os campos foram mantidos."));
      tx.onerror=()=>reject(new Error("Falha no armazenamento local. Tente novamente."));
    });
  }catch(error){return Response.json({error:(error as Error).message},{status:503});}
};
(window as unknown as {openFinanceBackup:{export:()=>Promise<void>;import:(file:File)=>Promise<void>}}).openFinanceBackup={
  async export(){const r=await fetch('/api/finance');if(!r.ok)throw new Error('Não foi possível exportar os registros.');const snapshot=await r.json() as Snapshot;const contents=JSON.stringify({version:1,data:snapshot.data},null,2);if(window.openFinanceNativePort){await window.openFinanceNativePort.exportBackup(contents);return;}const blob=new Blob([contents],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='open-finance-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);},
  async import(file){if(file.size>4*1024*1024)throw new Error('O arquivo de backup é muito grande.');let backup;try{backup=backupSchema.parse(JSON.parse(await file.text()));}catch{throw new Error("Backup inválido. Escolha um arquivo gerado pelo Open Finance.");}if(!window.confirm(`Restaurar este backup substituirá os registros deste ${nativeMode()?"aplicativo":"navegador"}. Deseja continuar?`))return;const r=await fetch('/api/finance');if(!r.ok)throw new Error('Não foi possível ler seus dados.');const snapshot=await r.json() as Snapshot;const result=await fetch('/api/finance',{method:'POST',body:JSON.stringify({action:'restore',backup,revision:snapshot.revision})});if(!result.ok){const error=await result.json() as {error:string};throw new Error(error.error);}location.reload();}
};
createRoot(document.getElementById("root")!).render(<FinanceApp/>);

