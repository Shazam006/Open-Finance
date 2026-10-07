import {spawnSync} from "node:child_process";
import {mkdirSync,existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
const app=fileURLToPath(new URL("../",import.meta.url));
if(process.platform!=="darwin")throw new Error("A compilação iOS exige macOS e Xcode. Execute em um Mac ou runner macOS.");
function run(command,args){const result=spawnSync(command,args,{cwd:app,stdio:"inherit"});if(result.error)throw result.error;if(result.status!==0)throw new Error(`${command} falhou (${result.status}).`);}
run("xcodebuild",["-project","ios/App/App.xcodeproj","-scheme","App","-configuration","Release","-sdk","iphoneos","-destination","generic/platform=iOS","-derivedDataPath","build/ios","CODE_SIGNING_ALLOWED=NO","CODE_SIGNING_REQUIRED=NO","CODE_SIGN_IDENTITY=","build"]);
const product=app+"build/ios/Build/Products/Release-iphoneos/App.app";
if(!existsSync(product))throw new Error("O Xcode não gerou o aplicativo para iPhone.");
mkdirSync(app+"build/package/Payload",{recursive:true});
run("ditto",[product,"build/package/Payload/Open Finance.app"]);
run("ditto",["-c","-k","--keepParent","build/package/Payload","build/Open-Finance-sem-assinatura.ipa"]);
console.log("IPA gerado sem assinatura. Use Sideloadly ou SideStore para assinar com sua própria conta Apple. Este arquivo não instala diretamente pelo Safari.");
