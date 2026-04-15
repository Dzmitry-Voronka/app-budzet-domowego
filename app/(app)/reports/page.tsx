import { prisma } from "@/lib/prisma";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default async function ReportsPage() {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const transactions = await prisma.transaction.findMany({ where: { date: { gte: yearStart } } });

  const monthly = new Map<number, number>();
  for (let i = 0; i < 12; i++) monthly.set(i, 0);
  transactions.forEach((t) => {
    const m = new Date(t.date).getMonth();
    const prev = monthly.get(m) || 0;
    monthly.set(m, prev + (t.type === "INCOME" ? Number(t.amount) : -Number(t.amount)));
  });

  const data = Array.from(monthly.entries()).map(([m, v]) => ({ month: ["Sty","Lut","Mar","Kwi","Maj","Cze","Lip","Sie","Wrz","Paź","Lis","Gru"][m] || String(m+1), value: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Raporty</h1>
        <p className="text-muted-foreground">Przeglądaj raporty i statystyki</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
        <h3 className="mb-6">Wykres przychodów</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
