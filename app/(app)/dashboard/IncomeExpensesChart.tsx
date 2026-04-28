"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function IncomeExpensesChart({ data }: { data: Array<{ month: string; income: number; expenses: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="income" fill="#10b981" isAnimationActive={false} />
        <Bar dataKey="expenses" fill="#d4183d" isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
