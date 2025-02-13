"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Input,
  Button,
  List,
  Typography,
  Space,
  Divider,
  message,
  Tag,
  Card,
  Alert,
} from "antd";
import {
  SendOutlined,
  SmileOutlined,
  UserOutlined,
  InboxOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;
const { Title, Paragraph, Text } = Typography;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UploadedFile {
  name: string;
  type: "账簿" | "报表" | "凭证" | "其他";
  uploadTime: Date;
}

export const AIChatModule = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "你好！我是 AI 小鲸，你的智能财务助手。我可以帮你：\n1. 分析财务数据和报表\n2. 解答会计处理问题\n3. 提供经营建议\n4. 进行风险预警\n\n请上传相关文件或直接提问，我很乐意帮助你！",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 添加滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 当消息列表更新时，滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 处理文件上传
  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      const fileType = getFileType(info.file.name);
      const newFile: UploadedFile = {
        name: info.file.name,
        type: fileType,
        uploadTime: new Date(),
      };

      setUploadedFiles((prev) => [...prev, newFile]);
      message.success(`${info.file.name} 上传成功`);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `我已经分析了${fileType}「${info.file.name}」，发现以下要点：\n\n1. 收入结构分析\n   - 主要收入来源\n   - 增长趋势\n\n2. 成本分析\n   - 主要成本构成\n   - 优化空间\n\n3. 风险提示\n   - 潜在风险点\n   - 改进建议\n\n请问您想了解哪方面的具体信息？`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  // 判断文件类型
  const getFileType = (fileName: string): UploadedFile["type"] => {
    if (fileName.includes("账")) return "账簿";
    if (fileName.includes("报表")) return "报表";
    if (fileName.includes("凭证")) return "凭证";
    return "其他";
  };

  // 处理发送消息
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // 模拟 AI 响应
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: "assistant",
        content: generateAIResponse(inputValue, selectedFile),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  // 生成 AI 响应
  const generateAIResponse = (
    question: string,
    currentFile: string | null
  ): string => {
    const fileContext = currentFile ? `根据「${currentFile}」，` : "";
    const responses = [
      `${fileContext}我的分析如下：\n\n1. 财务状况\n   - 收入结构合理\n   - 成本控制有优化空间\n\n2. 关键指标\n   - 应收账款周转率：12次/年\n   - 毛利率：35%\n\n3. 建议措施\n   - 加强应收账款管理\n   - 优化库存水平`,
      `${fileContext}从专业角度建议：\n\n1. 内控制度\n   - 完善审批流程\n   - 规范费用报销\n\n2. 预算管理\n   - 制定详细预算\n   - 定期跟踪分析\n\n3. 风险防范\n   - 关注现金流\n   - 防范坏账风险`,
      `${fileContext}我发现以下趋势：\n\n1. 业务发展\n   - 营收同比增长10%\n   - 新业务占比上升\n\n2. 成本结构\n   - 原材料成本稳定\n   - 人工成本上升\n\n3. 改进方向\n   - 提升运营效率\n   - 加强成本管控`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={4}>
            <SmileOutlined style={{ marginRight: 8 }} />
            AI 小鲸助手
          </Title>
          <Alert
            message="智能助手使用说明"
            description={
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                <li>
                  上传财务文件（账簿、报表、凭证等），AI
                  小鲸会自动分析并提供见解
                </li>
                <li>可以直接询问任何财务相关问题，包括会计处理、经营分析等</li>
                <li>支持多轮对话，帮助你更好地理解财务数据和经营状况</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <div style={{ display: "flex", gap: "16px" }}>
        {/* 左侧文件列表 */}
        <Card style={{ width: 300 }}>
          <Dragger
            name="file"
            multiple
            action="/api/upload"
            onChange={handleUpload}
            showUploadList={false}
            style={{ marginBottom: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传文件</p>
            <p className="ant-upload-hint">支持账簿、报表、凭证等文件</p>
          </Dragger>

          <Divider>已上传文件</Divider>
          <List
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
            size="small"
            dataSource={uploadedFiles}
            renderItem={(file) => (
              <List.Item
                onClick={() => setSelectedFile(file.name)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedFile === file.name ? "#e6f4ff" : undefined,
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                <Space>
                  <FileTextOutlined />
                  <div>
                    <div>{file.name}</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      <Tag color="blue" style={{ marginRight: 4 }}>
                        {file.type}
                      </Tag>
                      {file.uploadTime.toLocaleTimeString()}
                    </div>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        {/* 右侧对话区域 */}
        <Card
          style={{
            flex: 1,
          }}
          bodyStyle={{
            padding: 0,
            height: "calc(100vh - 300px)", // 设置固定高度
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 对话记录区域 */}
          <List
            className="chat-list"
            style={{
              flex: 1,
              height: "calc(100% - 64px)", // 减去输入框的高度
              overflowY: "auto",
              padding: "16px",
              backgroundColor: "rgba(0,0,0,0.02)",
            }}
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item
                style={{
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  padding: "8px 0",
                  border: "none",
                }}
              >
                <Space
                  align="start"
                  style={{
                    maxWidth: "80%",
                    backgroundColor:
                      msg.role === "assistant" ? "#fff" : "#e6f4ff",
                    padding: "12px 16px",
                    borderRadius: 8,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <SmileOutlined style={{ color: "#1677ff" }} />
                  ) : (
                    <UserOutlined />
                  )}
                  <div>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#999",
                        display: "block",
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString()}
                    </Text>
                    <Text style={{ whiteSpace: "pre-wrap" }}>
                      {msg.content}
                    </Text>
                  </div>
                </Space>
              </List.Item>
            )}
          >
            {/* 添加一个空的 div 作为滚动目标 */}
            <div ref={messagesEndRef} />
          </List>

          {/* 底部输入区域 */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #f0f0f0",
              backgroundColor: "#fff",
            }}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSend}
                placeholder={
                  selectedFile
                    ? `询问关于「${selectedFile}」的问题...`
                    : "请输入您的问题..."
                }
                disabled={isLoading}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={isLoading}
              >
                发送
              </Button>
            </Space.Compact>
          </div>
        </Card>
      </div>
    </div>
  );
};
