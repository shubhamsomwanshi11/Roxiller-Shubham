import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export function StatsChart({ itemPriceRange, monthName }) {
  const data = itemPriceRange.map(({ range, count }) => ({
    name: range,
    items: count,
  }));

  return (
    <div className="chart-container box ">
      <p className="has-text-success has-text-weight-bold is-size-5">
        Bar Charts Stats - {monthName}
      </p>
      <hr />

      <ResponsiveContainer width="100%" height={500} style={{marginBottom:'30px'}}>
        <BarChart
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis interval={1} tickCount={10} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="items" fill="#4fa94d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}