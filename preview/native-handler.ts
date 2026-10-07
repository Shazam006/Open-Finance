import {actionSchema,applyAction} from "../lib/actions";
import {backupSchema} from "../lib/backup";
import {newEntryId} from "../lib/ids";
import type {NativePort} from "../lib/native-port";

export function createNativeHandler(port:NativePort) {
  let pending:Promise<unknown>=Promise.resolve();
  return (init?:RequestInit):Promise<Response>=>{
    const operation=pending.then(async()=>{
      try {
        const current=await port.read();
        if(init?.method!=="POST")return Response.json(current);
        let body;
        try {
          body=JSON.parse(String(init.body));
          if(!body||!Number.isSafeInteger(body.revision)||body.revision<0)throw new Error("Versão dos registros inválida.");
        }catch(error){return Response.json({error:(error as Error).message},{status:400});}
        if(body.revision!==current.revision)return Response.json({error:"Os dados mudaram. Confira os valores e tente novamente.",snapshot:current},{status:409});
        let next;
        try {
          if(current.revision>=Number.MAX_SAFE_INTEGER)throw new Error("Limite de versões atingido. Exporte seu backup.");
          next={data:body.action==="restore"?backupSchema.parse(body.backup).data:applyAction(current.data,actionSchema.parse(body),newEntryId()),revision:current.revision+1};
        }catch(error){return Response.json({error:(error as Error).message||"Confira os campos."},{status:400});}
        await port.write(next);
        return Response.json(next);
      }catch(error){return Response.json({error:(error as Error).message||"Não foi possível salvar. Tente novamente."},{status:503});}
    });
    pending=operation.catch(()=>{});
    return operation;
  };
}
