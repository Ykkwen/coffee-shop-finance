"use client";
import { Layout, Menu } from "antd";
import {
  AccountBookOutlined,
  BarChartOutlined,
  FileTextOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { AccountingModule } from "./components/Accounting/AccountingModule";
import { AnalysisModule } from "./components/Analysis/AnalysisModule";
import { ReportsModule } from "./components/Reports/ReportsModule";
import type { JournalEntryType } from "@/app/types/accounting";

const { Header, Sider, Content } = Layout;

// 生成模拟数据
const generateMockData = (): JournalEntryType[] => {
  const mockEntries: JournalEntryType[] = [];
  const startDate = new Date("2024-01-01");
  const accounts = {
    assets: ["现金", "银行存款", "应收账款", "库存商品"],
    liabilities: ["应付账款", "预收账款"],
    income: ["营业收入"],
    expenses: ["营业成本", "费用"],
  };

  // 生成30天的数据
  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    // 每天生成2-5条记录
    const entriesCount = Math.floor(Math.random() * 4) + 2;

    for (let j = 0; j < entriesCount; j++) {
      // 随机生成不同类型的业务
      const transactionType = Math.floor(Math.random() * 5);
      let entry: JournalEntryType;

      switch (transactionType) {
        case 0: // 现金收入
          entry = {
            key: Date.now() + i + j,
            debitAccount: "现金",
            debitAmount: Math.floor(Math.random() * 1000) + 100,
            creditAccount: "营业收入",
            creditAmount: Math.floor(Math.random() * 1000) + 100,
            description: "收到现金收入",
            date: currentDate.toISOString(),
          };
          break;

        case 1: // 银行收款
          entry = {
            key: Date.now() + i + j,
            debitAccount: "银行存款",
            debitAmount: Math.floor(Math.random() * 2000) + 500,
            creditAccount: "营业收入",
            creditAmount: Math.floor(Math.random() * 2000) + 500,
            description: "收到银行转账",
            date: currentDate.toISOString(),
          };
          break;

        case 2: // 采购支出
          entry = {
            key: Date.now() + i + j,
            debitAccount: "库存商品",
            debitAmount: Math.floor(Math.random() * 3000) + 1000,
            creditAccount: "应付账款",
            creditAmount: Math.floor(Math.random() * 3000) + 1000,
            description: "采购咖啡豆",
            date: currentDate.toISOString(),
          };
          break;

        case 3: // 费用支出
          entry = {
            key: Date.now() + i + j,
            debitAccount: "费用",
            debitAmount: Math.floor(Math.random() * 500) + 100,
            creditAccount: "现金",
            creditAmount: Math.floor(Math.random() * 500) + 100,
            description: "支付水电费",
            date: currentDate.toISOString(),
          };
          break;

        default: // 应收账款收回
          entry = {
            key: Date.now() + i + j,
            debitAccount: "银行存款",
            debitAmount: Math.floor(Math.random() * 1500) + 500,
            creditAccount: "应收账款",
            creditAmount: Math.floor(Math.random() * 1500) + 500,
            description: "收回应收账款",
            date: currentDate.toISOString(),
          };
      }

      // 确保借贷金额相等
      entry.creditAmount = entry.debitAmount;
      mockEntries.push(entry);
    }
  }

  return mockEntries;
};

export default function Home() {
  const [selectedKey, setSelectedKey] = useState("1");
  const [allEntries, setAllEntries] = useState<JournalEntryType[]>([]);

  // 在组件加载时生成模拟数据
  useEffect(() => {
    const mockData = generateMockData();
    setAllEntries(mockData);
  }, []);

  // 处理新增分录的函数
  const handleNewEntry = (entry: JournalEntryType) => {
    setAllEntries((prev) => [...prev, entry]);
  };

  const menuItems = [
    {
      key: "1",
      icon: <AccountBookOutlined />,
      label: "记账对账",
    },
    {
      key: "2",
      icon: <BarChartOutlined />,
      label: "数据分析",
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: "财务报表",
    },
    {
      key: "4",
      icon: <RobotOutlined />,
      label: "AI分析建议",
    },
  ];

  // 根据选中的菜单项返回对应的报表类型
  const getInitialReportTab = () => {
    switch (selectedKey) {
      case "3":
        return "1"; // 默认显示资产负债表
      default:
        return "1";
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ padding: 0, background: "#fff" }}>
        <div
          style={{ padding: "0 24px", fontSize: "20px", fontWeight: "bold" }}
        >
          咖啡店财务管理系统
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems}
            onSelect={({ key }) => setSelectedKey(key)}
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#fff",
            }}
          >
            {selectedKey === "1" && (
              <AccountingModule
                entries={allEntries}
                onNewEntry={handleNewEntry}
              />
            )}
            {selectedKey === "2" && <AnalysisModule entries={allEntries} />}
            {selectedKey === "3" && (
              <ReportsModule
                entries={allEntries}
                defaultActiveKey={getInitialReportTab()}
              />
            )}
            {selectedKey === "4" && <div>AI分析建议模块</div>}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
