import {backupSchema} from "../../lib/backup";
import {defaults,type Snapshot} from "../../lib/finance";
export type DocumentFiles={list:()=>Promise<string[]>;read:(name:string)=>Promise<string>;write:(name:string,contents:string)=>Promise<void>};
const names=["open-finance-document-0.json","open-finance-document-1.json"];
export function createDocumentStore(files:DocumentFiles) {
  return {
    async read():Promise<Snapshot> {
      const present=(await files.list()).filter(name=>names.includes(name));
      if(!present.length)return {data:defaults(),revision:0};
      const candidates:Snapshot[]=[];
      for(const name of present){
        const contents=await files.read(name);
        try {
        const value=JSON.parse(contents);
        if(!Number.isSafeInteger(value.revision)||value.revision<0)continue;
        const data=backupSchema.parse({version:1,data:value.data}).data;
        candidates.push({data,revision:value.revision});
        }catch{/* The other file preserves the preceding completed write. */}
      }
      if(!candidates.length)throw new Error("Não foi possível ler os registros do aplicativo. Preserve os arquivos e use seu backup para recuperação.");
      return candidates.sort((a,b)=>b.revision-a.revision)[0];
    },
    async write(snapshot:Snapshot) {
      if(!Number.isSafeInteger(snapshot.revision)||snapshot.revision<1)throw new Error("Versão dos registros inválida.");
      const contents=JSON.stringify(snapshot);
      const name=names[snapshot.revision%2];
      await files.write(name,contents);
      if(await files.read(name)!==contents)throw new Error("Não foi possível confirmar o salvamento. Tente novamente.");
    },
  };
}
