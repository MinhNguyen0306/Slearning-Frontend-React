import { useState } from "react";
import Chart from "react-apexcharts";

const Top5Course = () => {
    const [profitChartOpts, setProfitChartOpts] = useState<any>({
        series: [{
            name: 'Doanh thu',
            data: [10000, 20000, 30000, 40000, 50000]
        }], 
        options: {
            colors: ['#4287f5'],
            chart: {
                background: 'transparent',
            }, 
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '10px',
                    colors: ["#304758"]
                }
            },
            stroke: {
                show: true,
                curve: 'straight',
                width: 2,
            },
            xaxis: {
                categories: ['Web Development', 'Mobile Development', 'Music', 'AutoCAD', 'Design'],
                title: {
                    text: "Chuyên đề"
                }
            },
            legend: {
                position: 'top'
            },
            grid: {
                show: true
            }
        }
    })

    return (
        <div className="flex flex-col gap-y-3 justify-center border border-gray-100 rounded-md p-4 shadow shadow-gray-200">
            <h2 className="font-semibold">Top 5 khóa học nhiều học viên nhất</h2>
            <div className="p-3 rounded-lg h-[300px] flex flex-col gap-y-5">
                <Chart 
                    options={profitChartOpts.options}
                    series={profitChartOpts.series}
                    type="area"
                    height='100%'
                />
            </div>
        </div>
    )
}

export default Top5Course
