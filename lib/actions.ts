import { z } from "zod";
import { balance, instances, paydays, validDate, today, type FinanceData } from "./finance";
import { thirteenthSchema } from "./thirteenth-schema";
const amount=z.number().int().min(1).max(999999999);
const signed=z.number().int().min(-999999999).max(999999999);
const name=z.string().trim().min(1,"Informe um nome.").max(80);
const id=z.string().min(1).max(100);
const date=z.string().refine(validDate,"Data inválida.");
const month=z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).refine(v=>validDate(`${v}-01`));
export const actionSchema=z.discriminatedUnion("action",[
  z.object({action:z.literal("account"),args:z.object({id:id.optional(),name,balance:signed})}),
  z.object({action:z.literal("bill"),args:z.object({id:id.optional(),title:name,amount,date,repeat:z.enum(["once","monthly"]),category:name})}),
  z.object({action:z.literal("deleteBill"),args:z.object({id})}),
  z.object({action:z.literal("payment"),args:z.object({key:id,month,accountId:id,date})}),
  z.object({action:z.literal("income"),args:z.object({key:id,month,accountId:id,date,amount})}),
  z.object({action:z.literal("undo"),args:z.object({id})}),
  z.object({action:z.literal("settings"),args:z.object({fifthAmount:amount.or(z.literal(0)),twentiethAmount:amount.or(z.literal(0)),saturday:z.boolean(),twentiethRule:z.enum(["exact","previous","next"]),extraHolidays:z.array(date).max(15),thirteenth:thirteenthSchema})}),
]);
export type Action=z.infer<typeof actionSchema>;
export function applyAction(original: FinanceData, input: Action, newId: string): FinanceData {
  const data=structuredClone(original);
  if(input.action==="account") {
    const a=input.args;
    if(a.id) { const account=data.accounts.find(x=>x.id===a.id); if(!account) throw new Error("Conta não encontrada."); const delta=a.balance-balance(account,data); account.name=a.name; if(delta) data.entries.push({id:newId,accountId:account.id,amount:delta,date:today(),kind:"adjustment",label:"Ajuste de saldo"}); }
    else { if(data.accounts.length>=30) throw new Error("Limite de 30 contas atingido."); data.accounts.push({id:newId,name:a.name,opening:a.balance}); }
  } else if(input.action==="bill") {
    const a=input.args; const old=a.id?data.bills.find(b=>b.id===a.id):undefined;
    if(a.id && !old) throw new Error("Conta a pagar não encontrada.");
    if(old && data.entries.some(e=>e.key?.startsWith(`bill:${old.id}:`)) && (old.date!==a.date || old.repeat!==a.repeat)) throw new Error("Esta conta já tem pagamentos. Mantenha a data inicial e a repetição, ou cadastre uma nova conta.");
    if(old) Object.assign(old,a); else { if(data.bills.length>=500) throw new Error("Limite de contas atingido."); data.bills.push({...a,id:newId}); }
  } else if(input.action==="deleteBill") {
    if(data.entries.some(e=>e.key?.startsWith(`bill:${input.args.id}:`))) throw new Error("Contas com pagamentos registrados devem ser preservadas.");
    data.bills=data.bills.filter(b=>b.id!==input.args.id);
  } else if(input.action==="payment" || input.action==="income") {
    const a=input.args; if(!data.accounts.some(x=>x.id===a.accountId)) throw new Error("Selecione uma conta válida.");
    if(data.entries.some(e=>e.key===a.key)) throw new Error("Este lançamento já foi registrado.");
    if(input.action==="payment") { const item=instances(data,a.month).find(b=>b.key===a.key); if(!item) throw new Error("Conta a pagar não encontrada."); data.entries.push({id:newId,accountId:a.accountId,amount:-item.amount,date:a.date,label:item.title,kind:"payment",key:item.key,scheduledDate:item.due}); }
    else { const p=paydays(a.month,data.settings).find(p=>p.key===a.key); if(!p) throw new Error("Recebimento não encontrado."); data.entries.push({id:newId,accountId:a.accountId,amount:input.args.amount,date:a.date,label:p.label,kind:"income",key:p.key,scheduledDate:p.date}); }
  } else if(input.action==="undo") {
    const entry=data.entries.find(e=>e.id===input.args.id); if(!entry || entry.kind==="adjustment") throw new Error("Lançamento não encontrado."); data.entries=data.entries.filter(e=>e.id!==input.args.id);
  } else if(input.action==="settings") {
    const settings={...input.args,extraHolidays:[...new Set(input.args.extraHolidays)].sort()};
    for(const m of settings.extraHolidays.map(v=>v.slice(0,7))) paydays(m,settings);
    data.settings=settings;
  }
  return data;
}
