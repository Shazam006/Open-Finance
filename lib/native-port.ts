import type { Snapshot } from "./finance";
export type NativePort = {
  read:()=>Promise<Snapshot>;
  write:(snapshot:Snapshot)=>Promise<void>;
  exportBackup:(contents:string)=>Promise<void>;
};
declare global {
  interface Window {
    openFinanceNative?:boolean;
    openFinanceNativePort?:NativePort;
  }
}
export const nativeMode=()=>typeof window!=="undefined"&&window.openFinanceNative===true;
