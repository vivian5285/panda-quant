import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import GlobalBackground from '@/components/common/GlobalBackground';
import { GradientTitle } from '@/components/common/GradientTitle';
import { motion } from 'framer-motion';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`doc-tabpanel-${index}`}
      aria-labelledby={`doc-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DocumentationPage: React.FC = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/v1/market/ticker',
      description: '获取市场行情数据',
      parameters: [
        { name: 'symbol', type: 'string', required: true, description: '交易对' },
        { name: 'interval', type: 'string', required: false, description: '时间间隔' }
      ]
    },
    {
      method: 'POST',
      path: '/api/v1/trade/order',
      description: '创建交易订单',
      parameters: [
        { name: 'symbol', type: 'string', required: true, description: '交易对' },
        { name: 'side', type: 'string', required: true, description: '交易方向' },
        { name: 'type', type: 'string', required: true, description: '订单类型' },
        { name: 'quantity', type: 'number', required: true, description: '数量' }
      ]
    },
    {
      method: 'GET',
      path: '/api/v1/account/balance',
      description: '查询账户余额',
      parameters: [
        { name: 'currency', type: 'string', required: false, description: '币种' }
      ]
    }
  ];

  const architecture = [
    {
      title: '前端架构',
      description: '基于 React + TypeScript 的现代化前端架构',
      components: [
        'React 18 - 核心框架',
        'Material-UI - UI组件库',
        'Redux Toolkit - 状态管理',
        'React Router - 路由管理',
        'Axios - HTTP客户端'
      ]
    },
    {
      title: '后端架构',
      description: '微服务架构，支持高并发和水平扩展',
      components: [
        'Spring Boot - 核心框架',
        'Spring Cloud - 微服务治理',
        'Redis - 缓存服务',
        'MySQL - 数据存储',
        'Kafka - 消息队列'
      ]
    },
    {
      title: '交易系统',
      description: '高性能、低延迟的交易系统',
      components: [
        '订单匹配引擎',
        '风险控制系统',
        '资金管理系统',
        '行情数据系统',
        '策略执行系统'
      ]
    }
  ];

  const developmentGuide = [
    {
      title: '环境搭建',
      steps: [
        '1. 安装 Node.js 和 npm',
        '2. 克隆项目代码',
        '3. 安装依赖包',
        '4. 配置开发环境',
        '5. 启动开发服务器'
      ]
    },
    {
      title: '开发规范',
      rules: [
        '1. 遵循 TypeScript 编码规范',
        '2. 使用 ESLint 进行代码检查',
        '3. 使用 Prettier 进行代码格式化',
        '4. 编写单元测试',
        '5. 提交代码前进行代码审查'
      ]
    },
    {
      title: '部署流程',
      steps: [
        '1. 构建生产环境代码',
        '2. 运行自动化测试',
        '3. 部署到测试环境',
        '4. 进行功能测试',
        '5. 部署到生产环境'
      ]
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="技术文档"
          subtitle="了解平台的技术架构和开发指南"
          sx={{ mb: 6 }}
        />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="documentation tabs"
            sx={{
              '& .MuiTab-root': {
                color: theme.palette.text.primary,
                '&.Mui-selected': {
                  color: '#00FFB8',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00FFB8',
              },
            }}
          >
            <Tab icon={<CodeIcon />} label="API文档" />
            <Tab icon={<ArchitectureIcon />} label="技术架构" />
            <Tab icon={<DeveloperModeIcon />} label="开发指南" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  API 接口文档
                </Typography>
                <List>
                  {apiEndpoints.map((endpoint, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <CodeIcon sx={{ color: '#00FFB8' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  bgcolor: endpoint.method === 'GET' ? '#00FFB8' : '#FF6B6B',
                                  color: 'black',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  mr: 2,
                                }}
                              >
                                {endpoint.method}
                              </Typography>
                              <Typography variant="body1">{endpoint.path}</Typography>
                            </Box>
                          }
                          secondary={endpoint.description}
                        />
                      </ListItem>
                      <Box sx={{ pl: 8, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          参数：
                        </Typography>
                        {endpoint.parameters.map((param, paramIndex) => (
                          <Typography
                            key={paramIndex}
                            variant="body2"
                            sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                          >
                            <Box
                              component="span"
                              sx={{
                                color: '#00FFB8',
                                mr: 1,
                              }}
                            >
                              •
                            </Box>
                            {param.name} ({param.type}) - {param.description}
                            {param.required && (
                              <Typography
                                component="span"
                                sx={{
                                  color: '#FF6B6B',
                                  ml: 1,
                                  fontSize: '0.75rem',
                                }}
                              >
                                required
                              </Typography>
                            )}
                          </Typography>
                        ))}
                      </Box>
                      {index < apiEndpoints.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  技术架构
                </Typography>
                {architecture.map((section, index) => (
                  <Box key={index} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      {section.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {section.description}
                    </Typography>
                    <List>
                      {section.components.map((component, compIndex) => (
                        <ListItem key={compIndex}>
                          <ListItemIcon>
                            <Box
                              component="span"
                              sx={{
                                color: '#00FFB8',
                                mr: 1,
                              }}
                            >
                              •
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={component} />
                        </ListItem>
                      ))}
                    </List>
                    {index < architecture.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  开发指南
                </Typography>
                {developmentGuide.map((section, index) => (
                  <Box key={index} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      {section.title}
                    </Typography>
                    <List>
                      {(section.steps || section.rules).map((item, itemIndex) => (
                        <ListItem key={itemIndex}>
                          <ListItemIcon>
                            <Box
                              component="span"
                              sx={{
                                color: '#00FFB8',
                                mr: 1,
                              }}
                            >
                              •
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                    {index < developmentGuide.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default DocumentationPage; 