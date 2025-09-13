import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function HseSingleMetricChart({ data, title, metricName, chartType = 'line' }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 18,
                    weight: 'bold'
                },
                color: '#374151'
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#374151',
                bodyColor: '#374151',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                padding: 12,
                callbacks: {
                    label: function(context) {
                        return `${metricName}: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Date',
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: metricName,
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                beginAtZero: true
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: metricName,
                data: data.values,
                borderColor: data.color || '#3b82f6',
                backgroundColor: data.backgroundColor || 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: chartType === 'line',
                tension: chartType === 'line' ? 0.4 : 0,
                pointBackgroundColor: data.color || '#3b82f6',
                pointBorderColor: data.color || '#3b82f6',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }
        ]
    };

    return (
        <div className="w-full h-96 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            {chartType === 'line' ? (
                <Line data={chartData} options={options} id={`chart-${title.replace(/\s+/g, '-').toLowerCase()}`} />
            ) : (
                <Bar data={chartData} options={options} id={`chart-${title.replace(/\s+/g, '-').toLowerCase()}`} />
            )}
        </div>
    );
}
