import { useState } from "react";
import Chart from "react-apexcharts";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import paymentApi from "../../../api/modules/payment.api";
import { toast } from "react-toastify";

const TurnOver = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const [profitChartOpts, setProfitChartOpts] = useState<any>({
        series: [{
            name: 'Doanh thu',
            data: [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000]
        }, {
            name: 'Lợi nhuận',
            data: [100000, 90000, 80000, 70000, 60000, 50000, 40000, 30000, 20000, 10000]
        }], 
        options: {
            colors: ['#4287f5', '#f542d7'],
            chart: {
                background: 'transparent',
            }, 
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
            },
            xaxis: {
                categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                title: {
                    text: "Tháng"
                }
            },
            legend: {
                position: 'top'
            },
            grid: {
                show: false
            }
        }
    })
    
    const allAdminPaymentsOfUser = useQuery({
        queryKey: ['allAdminPayments', user.id],
        queryFn: async () => {
          const { response, error } = await paymentApi.getAllAdminPaymentsOfUser(user.id)
          if(response) {
            const principalAmounts = 
              response.data.content
                .filter(p => p.monthOfYear.split('-')[1] === String(new Date().getFullYear()))
                .sort((p1, p2) => Number(p1.monthOfYear.split("-")[0]) - Number(p2.monthOfYear.split("-")[0]))
            const principalResult = Array(12).fill(0)
            for(let i = 0; i < principalAmounts.length; i++) {
              principalResult.splice(Number(principalAmounts[i].monthOfYear.split("-")[1]) - 1, 0, principalAmounts[i].amount)
            }
    
            const profitAmounts = 
              response.data.content
                .filter(p => p.monthOfYear.split('-')[1] === String(new Date().getFullYear()))
                .sort((p1, p2) => Number(p1.monthOfYear.split("-")[0]) - Number(p2.monthOfYear.split("-")[0]))
            const profitResult = Array(12).fill(0)
            for(let i = 0; i < profitAmounts.length; i++) {
              profitResult.splice(Number(profitAmounts[i].monthOfYear.split("-")[1]) - 1, 0, profitAmounts[i].amount)
            }
    
            setProfitChartOpts({
              ...profitChartOpts,
              series: [{
                name: 'Doanh thu',
                data: profitResult
              }, {
                name: 'Lợi nhuận',
                data: principalResult
              }], 
            })
            return response.data.content.filter(p => p.monthOfYear.split('-')[1] === String(new Date().getFullYear()));
          }
          if(error) toast.error(error.response?.data.errorMessage ?? error.message)
        },
        onError(error: Error) {
            toast.error(error.message)
        }
    })

    return (
        <div className="flex flex-col gap-y-3 justify-center border border-gray-100 rounded-md p-4 shadow shadow-gray-200">
            <h2 className="font-semibold">Doanh thu</h2>
            <div className="p-3 rounded-lg h-[300px] flex flex-col gap-y-5">
                <Chart 
                options={profitChartOpts.options}
                series={profitChartOpts.series}
                type="bar"
                height='100%'
                />
            </div>
        </div>
    )
}

export default TurnOver
