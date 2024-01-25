import { useState } from "react";
import Chart from "react-apexcharts";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import statisticApi from "../../../api/modules/statistic.api";

const Top5Rate = () => {
    const user = useSelector((state: RootState) => state.user.user)

    const [top5RateOption, setTop5RateOption] = useState<any>({
        series: [{
            name: '',
            data: []
        }], 
        options: {
            colors: ['#4287f5'],
            chart: {
                background: 'transparent',
            },
            plotOptions: {
                bar: {
                    barHeight: '100%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom'
                    },
                }
            }, 
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    fontSize: '10px',
                    colors: ['#fff']
                },
                formatter: function (val: string, opt: any) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                  enabled: true
                }
            },
            stroke: {
                show: true,
                curve: 'straight',
                width: 2,
            },
            xaxis: {
                categories: [],
            },
            yaxis: {
                labels: {
                  show: false
                }
            },
            legend: {
                position: 'bottom'
            },
            grid: {
                show: true
            }
        }
    })

    const { data } = useQuery({
        queryKey: ['top5Rate', user.id],
        queryFn: async () => {
            const { response, error } = await statisticApi.statisticTop5Rate(user.id)
            if(response) return response.data
            if(error) return Promise.reject()
        },
        onSuccess(data) {
            if(data) {
                setTop5RateOption({
                    ...top5RateOption,
                    series: [{
                        name: 'Đánh giá',
                        data: data.rateCourse
                    }],
                    options: {
                        ...top5RateOption.options,
                        xaxis: {
                            categories: data.courses,
                            title: {
                                text: "Khóa học"
                            }
                        },
                    }
                })
            }
        },
    })

    return (
        <div className="flex flex-col gap-y-3 justify-center border border-gray-100 rounded-md p-4 shadow shadow-gray-200">
            <h2 className="font-semibold">Top 5 khóa học đánh giá cao nhất</h2>
            <div className="p-3 rounded-lg h-[300px] flex flex-col gap-y-5">
                {
                    data?.courses &&
                    <Chart 
                        options={top5RateOption.options}
                        series={top5RateOption.series}
                        type="bar"
                        height='100%'
                    />
                }
            </div>
        </div>
    )
}

export default Top5Rate
