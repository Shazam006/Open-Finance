import {z} from "zod";
import {validDate} from "./finance";
import {thirteenthSchema} from "./thirteenth-schema";
const id=z.string().min(1).max(100),name=z.string().trim().min(1).max(80);
const amount=z.number().int().min(-999999999).max(999999999);
const date=z.string().refine(validDate,"O backup contém uma data inválida.");
export const backupSchema=z.object({version:z.literal(1),data:z.object({
  accounts:z.array(z.object({id,name,opening:amount})).max(30),
  bills:z.array(z.object({id,title:name,amount:amount.refine(n=>n>0),date,repeat:z.enum(["once","monthly"]),category:name})).max(500),
  entries:z.array(z.object({id,accountId:id,amount,date,label:name,kind:z.enum(["payment","income","adjustment"]),key:id.optional(),scheduledDate:date.optional()})).max(10000),
  settings:z.object({fifthAmount:amount.refine(n=>n>=0),twentiethAmount:amount.refine(n=>n>=0),saturday:z.boolean(),twentiethRule:z.enum(["exact","previous","next"]),extraHolidays:z.array(date).max(15),thirteenth:thirteenthSchema})
})}).superRefine(({data},ctx)=>{
  const duplicate=(values:string[])=>new Set(values).size!==values.length;
  if(duplicate(data.accounts.map(a=>a.id))||duplicate(data.bills.map(b=>b.id))||duplicate(data.entries.map(e=>e.id))||duplicate(data.entries.filter(e=>e.key).map(e=>e.key!)))ctx.addIssue({code:"custom",message:"O backup contém lançamentos duplicados."});
  if(data.entries.some(e=>!data.accounts.some(a=>a.id===e.accountId)))ctx.addIssue({code:"custom",message:"O backup contém uma movimentação sem conta."});
  if(data.entries.some(e=>(e.kind==="payment"&&(e.amount>=0||!e.key))||(e.kind==="income"&&(e.amount<=0||!e.key))))ctx.addIssue({code:"custom",message:"O backup contém valores de movimentação inválidos."});
});
