import {Capacitor} from "@capacitor/core";
import {Filesystem,Directory,Encoding} from "@capacitor/filesystem";
import {Share} from "@capacitor/share";
import {createDocumentStore} from "./document-store";
import type {NativePort} from "../../lib/native-port";

if(!Capacitor.isNativePlatform())throw new Error("Este pacote deve ser aberto pelo aplicativo iOS ou Android.");
const documents=createDocumentStore({
  async list(){return (await Filesystem.readdir({path:"",directory:Directory.Data})).files.map(f=>f.name);},
  async read(path){const result=await Filesystem.readFile({path,directory:Directory.Data,encoding:Encoding.UTF8});if(typeof result.data!=="string")throw new Error("Arquivo inválido.");return result.data;},
  async write(path,data){await Filesystem.writeFile({path,data,directory:Directory.Data,encoding:Encoding.UTF8});},
});
const port:NativePort={...documents,async exportBackup(data){
  const file=await Filesystem.writeFile({path:"open-finance-backup.json",data,directory:Directory.Cache,encoding:Encoding.UTF8});
  await Share.share({title:"Backup do Open Finance",files:[file.uri],dialogTitle:"Salvar ou compartilhar backup"});
}};
window.openFinanceNative=true;
window.openFinanceNativePort=port;
document.documentElement.classList.add("native-app");
void import("../../preview/standalone");
