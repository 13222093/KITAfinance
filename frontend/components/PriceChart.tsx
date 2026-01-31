'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, AreaSeries, AreaSeriesOptions, Time } from 'lightweight-charts';

interface PriceChartProps {
    symbol: string;
    targetPrice?: number;
}

interface OhlcvData {
    time_period_start: string;
    time_period_end: string;
    price_open: number;
    price_high: number;
    price_low: number;
    price_close: number;
    volume_traded: number;
    trades_count: number;
}

interface ChartDataPoint {
    time: Time;
    value: number;
}

export function PriceChart({ symbol, targetPrice }: PriceChartProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [priceChange, setPriceChange] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

    // Map symbols to CoinAPI symbol IDs
    const coinApiSymbols: { [key: string]: string } = {
        'ETH': 'BITSTAMP_SPOT_ETH_USD',
        'BTC': 'BITSTAMP_SPOT_BTC_USD',
        'SOL': 'BINANCE_SPOT_SOL_USDT',
    };

    // USD to IDR conversion rate (approximate)
    const USD_TO_IDR = 16000;

    // Fetch data from CoinAPI
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const symbolId = coinApiSymbols[symbol];
                const apiKey = '5ce1208e-44ac-4834-b02e-2f094e480d81';

                // Fetch 90 days of daily data
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 90);
                const timeStart = startDate.toISOString().split('.')[0];

                const response = await fetch(
                    `https://rest.coinapi.io/v1/ohlcv/${symbolId}/history?period_id=1DAY&time_start=${timeStart}&limit=90`,
                    {
                        headers: {
                            'X-CoinAPI-Key': apiKey,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`CoinAPI error: ${response.status} ${response.statusText}`);
                }

                const data: OhlcvData[] = await response.json();

                if (data && data.length > 0) {
                    // Convert to chart data format
                    const formattedData: ChartDataPoint[] = data.map((candle) => ({
                        time: Math.floor(new Date(candle.time_period_start).getTime() / 1000) as Time,
                        value: candle.price_close * USD_TO_IDR,
                    }));

                    setChartData(formattedData);

                    // Get latest price
                    const latestCandle = data[data.length - 1];
                    const latestPriceIDR = latestCandle.price_close * USD_TO_IDR;
                    setCurrentPrice(latestPriceIDR);

                    // Calculate price change (last 24h)
                    if (data.length >= 2) {
                        const previousClose = data[data.length - 2].price_close * USD_TO_IDR;
                        const change = ((latestPriceIDR - previousClose) / previousClose) * 100;
                        setPriceChange(change);
                    }
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Chart data fetch error:', err);
                setError(err instanceof Error ? err.message : 'Failed to load chart');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [symbol]);

    // Initialize chart
    useEffect(() => {
        if (!containerRef.current || chartData.length === 0) return;

        // Create chart
        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height: 300,
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

        chartRef.current = chart;

        // Add area series
        const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: '#0A98FF',
            topColor: 'rgba(10, 152, 255, 0.4)',
            bottomColor: 'rgba(10, 152, 255, 0.0)',
            lineWidth: 3,
        } as AreaSeriesOptions);

        seriesRef.current = areaSeries;

        // Set data
        areaSeries.setData(chartData);

        // Add target price line if provided
        if (targetPrice && targetPrice > 0) {
            areaSeries.createPriceLine({
                price: targetPrice,
                color: '#C15BFF',
                lineWidth: 2,
                lineStyle: 2, // Dashed
                axisLabelVisible: true,
                title: 'Target',
            });
        }

        // Fit content
        chart.timeScale().fitContent();

        // Handle resize
        const handleResize = () => {
            if (containerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: containerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, [chartData, targetPrice]);

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-white/50">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-black text-[#0A4A7C]">{symbol} Price Chart</h3>
                    <p className="text-sm text-gray-500 font-medium">90-day historical data</p>
                </div>
                {currentPrice && (
                    <div className="text-right">
                        <p className="text-2xl font-black text-[#0A4A7C]">
                            Rp {(currentPrice / 1000000).toFixed(2)}jt
                        </p>
                        <p className={`text-sm font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}% (24h)
                        </p>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-[#0A98FF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-500 font-semibold">Loading chart data...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <p className="text-red-600 font-semibold">{error}</p>
                        <p className="text-sm text-gray-500 mt-2">Please try again later</p>
                    </div>
                </div>
            )}

            <div
                ref={containerRef}
                className={`${isLoading || error ? 'hidden' : ''}`}
                style={{ width: '100%', height: 300 }}
            />

            {targetPrice && targetPrice > 0 && !isLoading && !error && (
                <div className="mt-4 p-3 bg-purple-50 border-2 border-purple-200 rounded-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-purple-700">Target Price:</span>
                        <span className="text-lg font-black text-purple-600">
                            Rp {(targetPrice / 1000000).toFixed(2)}jt
                        </span>
                    </div>
                    {currentPrice && (
                        <p className="text-xs text-purple-600 mt-1 font-semibold">
                            {((targetPrice / currentPrice - 1) * 100).toFixed(1)}% {targetPrice < currentPrice ? 'below' : 'above'} current price
                        </p>
                    )}
                </div>
            )}

            <div className="mt-4 text-xs text-gray-400 text-center font-medium">
                Powered by CoinAPI • Data updates daily
            </div>
        </div>
    );
}
