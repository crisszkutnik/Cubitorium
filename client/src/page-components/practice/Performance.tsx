import { PerformanceItem } from "./PerformanceItem"

export function Performance() {
    return (
        <div className="flex flex-col items-center mt-10 pb-10">
            <div className="flex flex-col items-center bg-gray-300 pt-2 w-3/4">
                <h1 className="text-4xl font-bold pb-3">Desempeño por caso</h1>
                
                <div className="grid grid-cols-3 w-full border border-black">
                    <PerformanceItem/>
                    <PerformanceItem/>
                    <PerformanceItem/>
                    <PerformanceItem/>
                    <PerformanceItem/>
                    <PerformanceItem/>
                    <PerformanceItem/>
                    <PerformanceItem/>
                    <PerformanceItem/>
                </div>

            </div>
            
        </div>
        )
}