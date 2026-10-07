import { z } from "zod";
import { defaultThirteenth, dateString, lastDay } from "./finance";
const amount=z.number().int().min(0).max(999999999);
export const thirteenthSchema=z.object({
  enabled:z.boolean(),firstAmount:amount,secondAmount:amount,
  firstMonth:z.number().int().min(1).max(12),firstDay:z.number().int().min(1).max(31),
  secondMonth:z.number().int().min(1).max(12),secondDay:z.number().int().min(1).max(31),
  rule:z.enum(["exact","previous"]),
}).refine(s=>{
  const date=(month:number,day:number)=>{const m=dateString(2000,month,1).slice(0,7);return `${m}-${String(Math.min(day,lastDay(m))).padStart(2,"0")}`;};
  return !s.enabled||date(s.firstMonth,s.firstDay)<=date(s.secondMonth,s.secondDay);
},"A segunda parcela do 13º deve ter uma data igual ou posterior à primeira.").default(defaultThirteenth);
