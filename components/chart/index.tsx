import dynamic from 'next/dynamic'
const ApexChart = dynamic(() => import('react-apexcharts'), {ssr:false})

interface PieProps {
    labels: string[];
    series: number[];
}

interface BarProps {
    labels: string[];
    seriesName: string;
    seriesData: number[];
}

export const PieChart: React.FC<PieProps> = (props) => (
    <div className="chart-content">
        <ApexChart
            options={{
                labels: props.labels,
                legend: {
                    position: 'bottom'
                },
                chart: {
                    toolbar: {
                        show: true
                    }
                }
            }}
            series={props.series.map(item => parseFloat(item.toFixed(2)))}
            type="pie"
            height="100%"
        />
    </div>
)

export const BarChart: React.FC<BarProps> = (props) => (
    <div className="chart-content">
        <ApexChart
            options={{
                chart: {
                    id: "basic-bar",
                },
                xaxis: {
                    categories: props.labels
                },
                plotOptions: {
                    bar: {
                        distributed: true
                    }
                },
            }}
            series={[
                {
                    name: props.seriesName,
                    data: props.seriesData.map(item => parseFloat(item.toFixed(2)))
                }
            ]}
            type="bar"
            height="93%"
        />
    </div>
)
