export type Account = { id: string; name: string; opening: number };
export type Bill = { id: string; title: string; amount: number; date: string; repeat: "once" | "monthly"; category: string };
export type Entry = { id: string; accountId: string; amount: number; date: string; label: string; kind: "payment" | "income" | "adjustment"; key?: string; scheduledDate?: string };
export type ThirteenthSettings = { enabled: boolean; firstAmount: number; secondAmount: number; firstMonth: number; firstDay: number; secondMonth: number; secondDay: number; rule: "exact" | "previous" };
export type Settings = { fifthAmount: number; twentiethAmount: number; saturday: boolean; twentiethRule: "exact" | "previous" | "next"; extraHolidays: string[]; thirteenth?: ThirteenthSettings };
export type FinanceData = { accounts: Account[]; bills: Bill[]; entries: Entry[]; settings: Settings };
export type Snapshot = { data: FinanceData; revision: number };
export type BillInstance = Bill & { key: string; due: string; payment?: Entry };
export const defaultThirteenth = (): ThirteenthSettings => ({ enabled: true, firstAmount: 0, secondAmount: 0, firstMonth: 11, firstDay: 30, secondMonth: 12, secondDay: 20, rule: "exact" });
export const defaults = (): FinanceData => ({ accounts: [], bills: [], entries: [], settings: { fifthAmount: 0, twentiethAmount: 0, saturday: true, twentiethRule: "exact", extraHolidays: [], thirteenth: defaultThirteenth() } });
export function today() { return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
export function dateString(year: number, month: number, day: number) { return `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`; }
export function dateParts(date: string) { return date.split("-").map(Number); }
export function validDate(value: string) { if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const [y,m,d] = dateParts(value); const v = new Date(Date.UTC(y,m-1,d)); return y >= 2000 && y <= 2100 && v.getUTCFullYear() === y && v.getUTCMonth() === m-1 && v.getUTCDate() === d; }
export function shiftDate(value: string, days: number) { const [y,m,d] = dateParts(value); const v=new Date(Date.UTC(y,m-1,d+days)); return dateString(v.getUTCFullYear(),v.getUTCMonth()+1,v.getUTCDate()); }
export function shiftMonth(month: string, delta: number) { const [y,m]=dateParts(month); const v=new Date(Date.UTC(y,m-1+delta,1)); return dateString(v.getUTCFullYear(),v.getUTCMonth()+1,1).slice(0,7); }
export function lastDay(month: string) { const [y,m]=dateParts(month); return new Date(Date.UTC(y,m,0)).getUTCDate(); }
export function easter(year: number) { const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,n=Math.floor((a+11*h+22*l)/451),m=Math.floor((h+l-7*n+114)/31),day=(h+l-7*n+114)%31+1; return dateString(year,m,day); }
export function holidays(year: number) {
  return [
    ["01-01","Confraternização Universal"],["04-03","Aniversário de Jacareí"],["04-21","Tiradentes"],
    ["05-01","Dia do Trabalho"],["07-09","Revolução Constitucionalista (SP)"],["09-07","Independência"],
    ["10-12","Nossa Senhora Aparecida"],["11-02","Finados"],["11-15","Proclamação da República"],
    ["11-20","Consciência Negra"],["12-08","Padroeira de Jacareí"],["12-25","Natal"],
  ].map(([date,name])=>({date:`${year}-${date}`,name})).concat([
    {date:shiftDate(easter(year),-2),name:"Sexta-feira Santa"}, {date:shiftDate(easter(year),60),name:"Corpus Christi"},
  ]).sort((a,b)=>a.date.localeCompare(b.date));
}
export function isBusinessDay(date: string, settings: Settings, bank=false) { const [y,m,d]=dateParts(date); const w=new Date(Date.UTC(y,m-1,d)).getUTCDay(); return w!==0 && (w!==6 || (settings.saturday && !bank)) && !holidays(y).some(h=>h.date===date) && !settings.extraHolidays.includes(date); }
export function fifthBusinessDay(month: string, settings: Settings) { let count=0; for(let d=1;d<=31;d++) { const date=`${month}-${String(d).padStart(2,"0")}`; if(isBusinessDay(date,settings)) count++; if(count===5) return date; } throw new Error("Confira os feriados adicionais: não há cinco dias úteis neste mês."); }
export function thirteenthPaydays(year: number, settings: Settings) {
  const s=settings.thirteenth??defaultThirteenth(); if(!s.enabled) return [];
  return (["first","second"] as const).map(part=>{
    const month=dateString(year,part==="first"?s.firstMonth:s.secondMonth,1).slice(0,7);
    let date=`${month}-${String(Math.min(part==="first"?s.firstDay:s.secondDay,lastDay(month))).padStart(2,"0")}`;
    if(s.rule==="previous") { let n=0; while(!isBusinessDay(date,settings,true)) { date=shiftDate(date,-1); if(++n>31) throw new Error("Confira os feriados adicionais."); } }
    const label=`13º salário · ${part==="first"?"1ª":"2ª"} parcela`;
    return {key:`income:${year}:thirteenth:${part}`,label,rule:`13º · ${part==="first"?"1ª":"2ª"} parcela`,date,amount:part==="first"?s.firstAmount:s.secondAmount};
  });
}
export function paydays(month: string, settings: Settings) { let twentieth=`${month}-20`; if(settings.twentiethRule!=="exact") { const dir=settings.twentiethRule==="previous"?-1:1; let n=0; while(!isBusinessDay(twentieth,settings,true)) { twentieth=shiftDate(twentieth,dir); if(++n>31) throw new Error("Confira os feriados adicionais."); } } const year=Number(month.slice(0,4)); return [{key:`income:${month}:fifth`,label:"Pagamento",rule:"5º dia útil",date:fifthBusinessDay(month,settings),amount:settings.fifthAmount},{key:`income:${month}:twentieth`,label:"Adiantamento",rule:"Dia 20",date:twentieth,amount:settings.twentiethAmount},...thirteenthPaydays(year,settings).concat(thirteenthPaydays(year+1,settings)).filter(p=>p.date.slice(0,7)===month)].sort((a,b)=>a.date.localeCompare(b.date)); }
// Keep received annual installments in their original month when the forecast changes.
export function receivables(data: FinanceData, month: string) {
  const result=paydays(month,data.settings).filter(p=>{const e=data.entries.find(e=>e.key===p.key);return !e||!p.key.includes(":thirteenth:")||(e.scheduledDate??e.date).slice(0,7)===month;}).map(p=>{const e=data.entries.find(e=>e.key===p.key);return e?{...p,date:e.scheduledDate??p.date,amount:e.amount}:p;});
  for(const e of data.entries) if(e.kind==="income"&&e.key&&/^income:\d{4}:thirteenth:(first|second)$/.test(e.key)&&(e.scheduledDate??e.date).slice(0,7)===month&&!result.some(p=>p.key===e.key)) result.push({key:e.key,label:e.label,rule:`13º · ${e.key.endsWith(":first")?"1ª":"2ª"} parcela`,date:e.scheduledDate??e.date,amount:e.amount});
  return result.sort((a,b)=>a.date.localeCompare(b.date));
}
export function balance(account: Account, data: FinanceData) { return data.entries.filter(e=>e.accountId===account.id).reduce((sum,e)=>sum+e.amount,account.opening); }
export function totalBalance(data: FinanceData) { return data.accounts.reduce((sum,a)=>sum+balance(a,data),0); }
export function instances(data: FinanceData, month: string): BillInstance[] {
  const out: BillInstance[]=[];
  for(const bill of data.bills) {
    const first=bill.date.slice(0,7); if(first>month) continue; let cursor=first;
    do {
      const due=bill.repeat==="once"?bill.date:`${cursor}-${String(Math.min(Number(bill.date.slice(-2)),lastDay(cursor))).padStart(2,"0")}`;
      const key=`bill:${bill.id}:${bill.repeat==="once"?"once":cursor}`;
      const payment=data.entries.find(e=>e.kind==="payment" && e.key===key);
      if(due.slice(0,7)===month || (!payment && due.slice(0,7)<month)) out.push({...bill,key,due:payment?.scheduledDate??due,amount:payment?-payment.amount:bill.amount,payment});
      if(bill.repeat==="once") break; cursor=shiftMonth(cursor,1);
    } while(cursor<=month);
  }
  return out.sort((a,b)=>a.due.localeCompare(b.due)||a.title.localeCompare(b.title));
}
export function money(cents: number) { return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(cents/100); }
export function moneyInput(cents: number) { return (cents/100).toFixed(2).replace(".",","); }
export function parseMoney(raw: string) { let s=raw.trim().replace(/\s/g,"").replace(/^R\$/i,""); if(s.includes(",")) s=s.replace(/\./g,"").replace(",","."); if(!/^-?\d+(\.\d{1,2})?$/.test(s)) throw new Error("Informe um valor como 150,00."); const negative=s.startsWith("-"); const [whole,fraction=""]=s.replace("-","").split("."); const result=(Number(whole)*100+Number(fraction.padEnd(2,"0")))*(negative?-1:1); if(!Number.isSafeInteger(result)||Math.abs(result)>999999999) throw new Error("Valor fora do limite permitido."); return result; }
export function shortDate(date: string) { const [,m,d]=dateParts(date); return `${String(d).padStart(2,"0")}/${String(m).padStart(2,"0")}`; }
export function monthLabel(month: string) { const [y,m]=dateParts(month); return new Intl.DateTimeFormat("pt-BR",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(y,m-1,1))); }
