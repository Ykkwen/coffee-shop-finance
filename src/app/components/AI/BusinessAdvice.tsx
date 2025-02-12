"use client";
import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Timeline, Tag, Button, Modal } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  CloudOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import type { JournalEntryType } from "@/app/types/accounting";

interface BusinessAdviceProps {
  entries: JournalEntryType[];
}

interface PromotionSuggestion {
  title: string;
  reason: string;
  expectedGrowth: number;
  startDate: string;
  endDate: string;
  type: "holiday" | "weather" | "competition";
}

export const BusinessAdvice = ({ entries }: BusinessAdviceProps) => {
  const [weather, setWeather] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<PromotionSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<PromotionSuggestion | null>(null);

  useEffect(() => {
    // 模拟获取天气数据
    const mockWeather = {
      temperature: 35,
      condition: "晴天",
      forecast: "明天持续高温",
    };
    setWeather(mockWeather);

    // 模拟生成促销建议
    const mockSuggestions: PromotionSuggestion[] = [
      {
        title: "玫瑰拉花咖啡套餐",
        reason: "情人节前三天，去年同期该品类销量增长150%",
        expectedGrowth: 150,
        startDate: "2024-02-12",
        endDate: "2024-02-14",
        type: "holiday",
      },
      {
        title: "冷萃咖啡限时折扣",
        reason: "明天高温35℃，附近3家竞品已有2家推出类似活动",
        expectedGrowth: 80,
        startDate: "2024-02-01",
        endDate: "2024-02-03",
        type: "weather",
      },
    ];
    setSuggestions(mockSuggestions);
  }, []);

  const showSuggestionDetail = (suggestion: PromotionSuggestion) => {
    setSelectedSuggestion(suggestion);
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="天气情况">
            {weather && (
              <>
                <Statistic
                  title="当前温度"
                  value={weather.temperature}
                  suffix="°C"
                  prefix={<CloudOutlined />}
                />
                <div style={{ marginTop: 16 }}>
                  <Tag color="blue">{weather.condition}</Tag>
                  <div style={{ marginTop: 8 }}>{weather.forecast}</div>
                </div>
              </>
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="竞品动态">
            <Statistic
              title="周边竞品数量"
              value={5}
              prefix={<ShopOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Tag color="orange">2家推出夏季促销</Tag>
              <Tag color="green">1家新开业</Tag>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="节假日提醒">
            <Statistic
              title="距离情人节"
              value={14}
              suffix="天"
              prefix={<CalendarOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Tag color="pink">情人节促销准备建议</Tag>
            </div>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            title="促销建议"
            extra={
              <Button type="link" onClick={() => {}}>
                查看更多
              </Button>
            }
          >
            <Timeline
              items={suggestions.map((suggestion) => ({
                color: suggestion.type === "holiday" ? "red" : "blue",
                children: (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => showSuggestionDetail(suggestion)}
                  >
                    <div>
                      <strong>{suggestion.title}</strong>
                      <Tag
                        color="green"
                        style={{ marginLeft: 8 }}
                      >{`预期增长 ${suggestion.expectedGrowth}%`}</Tag>
                    </div>
                    <div style={{ color: "#666" }}>{suggestion.reason}</div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="促销方案详情"
        open={!!selectedSuggestion}
        onCancel={() => setSelectedSuggestion(null)}
        footer={[
          <Button key="back" onClick={() => setSelectedSuggestion(null)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            采纳建议
          </Button>,
        ]}
      >
        {selectedSuggestion && (
          <div>
            <h3>{selectedSuggestion.title}</h3>
            <p>建议原因：{selectedSuggestion.reason}</p>
            <p>
              活动时间：{selectedSuggestion.startDate} 至{" "}
              {selectedSuggestion.endDate}
            </p>
            <p>预期销售增长：{selectedSuggestion.expectedGrowth}%</p>
            {/* 可以添加更多详细信息，如具体执行方案、所需资源等 */}
          </div>
        )}
      </Modal>
    </div>
  );
}; 