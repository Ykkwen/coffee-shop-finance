"use client";
import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';
import type { JournalEntryType } from '@/app/types/accounting';

interface TrendChartProps {
  entries: JournalEntryType[];
}

export const TrendChart = ({ entries }: TrendChartProps) => {
  // 处理数据
  const processData = () => {
    const dailyData = new Map<string, { date: string; income: number; expense: number }>();

    entries.forEach(entry => {
      const date = dayjs(entry.date).format('YYYY-MM-DD');
      if (!dailyData.has(date)) {
        dailyData.set(date, { date, income: 0, expense: 0 });
      }
      
      const data = dailyData.get(date)!;
      
      // 收入科目：营业收入
      if (entry.creditAccount === '营业收入') {
        data.income += entry.creditAmount;
      }
      // 支出科目：费用、营业成本
      if (entry.debitAccount === '费用' || entry.debitAccount === '营业成本') {
        data.expense += entry.debitAmount;
      }
    });

    return Array.from(dailyData.values())
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const data = processData();

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  // 转换数据格式为折线图所需的格式
  const chartData = data.reduce((acc: any[], curr) => {
    acc.push(
      { date: curr.date, type: '收入', value: curr.income },
      { date: curr.date, type: '支出', value: curr.expense }
    );
    return acc;
  }, []);

  return <Line {...config} data={chartData} />;
}; 