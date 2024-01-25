import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useState } from "react";
import { useQuery } from "react-query";
import statisticApi from "../../../api/modules/statistic.api";

const Top5Topic = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [top5TopicOption, setTop5TopicOption] = useState<any>({
        series: [{
            name: 'Số khóa học bán ra',
            data: []
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
                categories: [],
                title: {
                    text: "Chuyên đề"
                }
            },
            yaxis: {
                title: {
                    text: "Số khóa học bán ra"
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

    const { data } = useQuery({
        queryKey: ['top5Topic', user.id],
        queryFn: async () => {
            const { response, error } = await statisticApi.statisticTop5Topic(user.id)
            if(response) return response.data
            if(error) return Promise.reject()
        },
        onSuccess(data) {
            if(data) {
                setTop5TopicOption({
                    ...top5TopicOption,
                    series: [{
                        name: 'Số khóa học bán ra',
                        data: data.numberCourse
                    }],
                    options: {
                        ...top5TopicOption,
                        xaxis: {
                            categories: data.topics,
                            title: {
                                text: "Chuyên đề"
                            }
                        },
                    }
                })
            }
        },
    })

    return (
        <div className="flex flex-col gap-y-3 justify-center border border-gray-100 rounded-md p-4 shadow shadow-gray-200">
            <h2 className="font-semibold">Top 5 chuyên đề bán chạy</h2>
            <div className="p-3 rounded-lg h-[300px] flex flex-col gap-y-5">
                <Chart 
                    options={top5TopicOption.options}
                    series={top5TopicOption.series}
                    type="area"
                    height='100%'
                />
            </div>
        </div>
    )
}

export default Top5Topic
