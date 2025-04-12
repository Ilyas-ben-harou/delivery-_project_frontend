"use client"

import { Bar, BarChart as RechartsBarChart, Legend, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "./chart"

// This component transforms the Chart.js style data format to Recharts format
export function BarChartWrapper({ data }) {
  // Transform the data from Chart.js format to Recharts format
  const transformedData = data.labels.map((label, index) => {
    const dataPoint = { name: label }

    // Add each dataset's value for this label
    data.datasets.forEach((dataset, datasetIndex) => {
      const safeKey = dataset.label.replace(/\s+/g, "_").toLowerCase()
      dataPoint[safeKey] = dataset.data[index]
    })

    return dataPoint
  })

  // Create config for the chart container
  const chartConfig = {}
  data.datasets.forEach((dataset) => {
    const safeKey = dataset.label.replace(/\s+/g, "_").toLowerCase()
    chartConfig[safeKey] = {
      label: dataset.label,
      color: dataset.backgroundColor,
    }
  })

  return (
    <div className="h-[300px]">
      <ChartContainer config={chartConfig}>
        <RechartsBarChart data={transformedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          {data.datasets.map((dataset, index) => {
            const safeKey = dataset.label.replace(/\s+/g, "_").toLowerCase()
            return <Bar key={index} dataKey={safeKey} fill={dataset.backgroundColor} name={dataset.label} />
          })}
        </RechartsBarChart>
      </ChartContainer>
    </div>
  )
}
