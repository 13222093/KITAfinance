'use client';

import { useEffect, useRef, useState } from 'react';

interface PriceChartProps {
    symbol: string;
    targetPrice?: number;
}

export function PriceChart({ symbol, targetPrice }: PriceChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [priceChange, setPriceChange] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    // Map symbols to CoinGecko IDs
    const coinGeckoIds: { [key: string]: string } = {
        'ETH': 'ethereum',
        'BTC': 'bitcoin',
        'SOL': 'solana',
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        let chart: any = null;
        let series: any = null;

        const initChart = async () => {
            // Dynamic import to avoid SSR issues
            const { createChart } = await import('lightweight-charts');

            if (!chartContainerRef.current) return;

            // Create chart with v5 API
            chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 300,
            });

            // Apply options separately for v5
            chart.applyOptions({
                layout: {
                    background: { color: 'transparent' },
                    textColor: '#6B7280',
                },
                grid: {
                    vertLines: { color: '#E5E7EB' },
                    horzLines: { color: '#E5E7EB' },
                },
                timeScale: {
                    borderColor: '#D1D5DB',
                    timeVisible: true,
                },
                rightPriceScale: {
                    borderColor: '#D1D5DB',
                },
            });

            // Create area series
            series = chart.addAreaSeries({
                lineColor: '#0A98FF',
                topColor: 'rgba(10, 152, 255, 0.4)',
                bottomColor: 'rgba(10, 152, 255, 0.0)',
                lineWidth: 2,
            });

            // Fetch price data
            try {
                setIsLoading(true);
                const coinId = coinGeckoIds[symbol];

                // Fetch 7 days of hourly data
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=idr&days=7&interval=hourly`
                );

                const data = await response.json();

                if (data.prices && data.prices.length > 0) {
                    // Convert to chart format
                    const chartData = data.prices.map((price: [number, number]) => ({
                        time: Math.floor(price[0] / 1000), // Convert to seconds
                        value: price[1],
                    }));

                    series.setData(chartData);

                    // Set current price and calculate change
                    const latest = chartData[chartData.length - 1].value;
                    const oldest = chartData[0].value;
                    setCurrentPrice(latest);
                    setPriceChange(((latest - oldest) / oldest) * 100);

                    // Add target price line if provided
                    if (targetPrice) {
                        series.createPriceLine({
                            price: targetPrice,
                            color: '#10B981',
                            lineWidth: 2,
                            lineStyle: 2, // Dashed
                            axisLabelVisible: true,
                            title: 'Target',
                        });
                    }

                    chart.timeScale().fitContent();
                }
            } catch (error) {
                console.error('Error fetching price data:', error);
            } finally {
                setIsLoading(false);
            }

            // Handle resize
            const handleResize = () => {
                if (chartContainerRef.current && chart) {
                    chart.applyOptions({
                        width: chartContainerRef.current.clientWidth,
                    });
                }
            };

            window.addEventListener('resize', handleResize);

            // Cleanup
            return () => {
                window.removeEventListener('resize', handleResize);
                if (chart) {
                    chart.remove();
                }
            };
        };

        initChart();

        return () => {
            if (chart) {
                chart.remove();
            }
        };
    }, [symbol, targetPrice]);

    return (
        <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-gray-200 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg md:text-xl font-black text-[#0A4A7C]">{symbol}/IDR</h3>
                    {currentPrice && (
                        <p className="text-2xl md:text-3xl font-black text-gray-900 mt-1">
                            Rp {(currentPrice / 1000000).toFixed(2)}jt
                        </p>
                    )}
                </div>
                {!isLoading && priceChange !== 0 && (
                    <div className={`px-3 py-1 rounded-lg font-bold text-sm ${priceChange >= 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                    </div>
                )}
            </div>

            {/* Chart */}
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl z-10">
                        <div className="text-gray-400 font-semibold">Loading chart...</div>
                    </div>
                )}
                <div ref={chartContainerRef} className="rounded-xl overflow-hidden min-h-[300px]" />
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 font-medium text-center">
                    📊 Data 7 hari terakhir dari CoinGecko
                </p>
            </div>
        </div>
    );
}
