"use client";
import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Progress, Alert, List, Typography } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { JournalEntryType } from "@/app/types/accounting";

const { Title, Text } = Typography;

interface HealthMetrics {
  profitMargin: number;
  cashFlow: number;
  assetTurnover: number;
  debtRatio: number;
  workingCapital: number;
}

interface HealthAnalysisProps {
  entries: JournalEntryType[];
}

export const HealthAnalysis = ({ entries }: HealthAnalysisProps) => {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // 计算健康度指标
    const calculateMetrics = () => {
      // 这里应该根据实际的会计分录计算各项指标
      return {
        profitMargin: 15.8,
        cashFlow: 85000,
        assetTurnover: 4.2,
        debtRatio: 45,
        workingCapital: 120000,
      };
    };

    const metrics = calculateMetrics();
    setMetrics(metrics);

    // 生成警告和建议
    const generateWarningsAndSuggestions = (metrics: HealthMetrics) => {
      const warnings = [];
      const suggestions = [];

      if (metrics.profitMargin < 20) {
        warnings.push("毛利率低于行业平均水平");
        suggestions.push("建议优化产品结构，提高高毛利产品的销售比例");
      }

      if (metrics.debtRatio > 40) {
        warnings.push("负债率偏高");
        suggestions.push("建议控制新增债务，加快应收账款回收");
      }

      // 添加更多的分析规则...

      return { warnings, suggestions };
    };

    const { warnings, suggestions } = generateWarningsAndSuggestions(metrics);
    setWarnings(warnings);
    setSuggestions(suggestions);
  }, [entries]);

  const getHealthScore = () => {
    if (!metrics) return 0;
    // 根据各项指标计算综合健康分数
    return 75; // 示例分数
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={4}>经营健康综合评分</Title>
            <Row align="middle" justify="space-between">
              <Col span={6}>
                <Progress
                  type="circle"
                  percent={getHealthScore()}
                  format={(percent) => `${percent}分`}
                  status={getHealthScore() >= 60 ? "success" : "exception"}
                />
              </Col>
              <Col span={18}>
                {warnings.length > 0 && (
                  <Alert
                    message="需要关注的问题"
                    type="warning"
                    showIcon
                    description={
                      <List
                        size="small"
                        dataSource={warnings}
                        renderItem={(item) => (
                          <List.Item>
                            <WarningOutlined style={{ marginRight: 8 }} />
                            {item}
                          </List.Item>
                        )}
                      />
                    }
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="关键指标分析">
            <Row gutter={16}>
              {metrics && (
                <>
                  <Col span={8}>
                    <Statistic
                      title="毛利率"
                      value={metrics.profitMargin}
                      suffix="%"
                      valueStyle={{
                        color: metrics.profitMargin >= 20 ? "#3f8600" : "#cf1322",
                      }}
                      prefix={
                        metrics.profitMargin >= 20 ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="经营现金流"
                      value={metrics.cashFlow}
                      prefix="¥"
                      valueStyle={{
                        color: metrics.cashFlow >= 0 ? "#3f8600" : "#cf1322",
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="资产周转率"
                      value={metrics.assetTurnover}
                      suffix="次/年"
                    />
                  </Col>
                </>
              )}
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="优化建议">
            <List
              dataSource={suggestions}
              renderItem={(item) => (
                <List.Item>
                  <CheckCircleOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                  {item}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}; 