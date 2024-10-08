import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

export default function CategoryChart({ monthName, categories }) {
  return (
    <div className="mt-5">
      <ResponsiveContainer
        width="100%"
        height={300}
        style={{ alignSelf: "flexStart" }}
      >
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={categories}
            startAngle={0}
            endAngle={360}
            innerRadius="40%"
            outerRadius="70%"
            dataKey="count"
          >
            {categories.map((each, index) => (
              <Cell
                key={`cell-${index}`}
                name={each._id.toUpperCase()}
                fill={getRandomColor()}
              />
            ))}
          </Pie>
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
