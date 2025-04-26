import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Container,
  alpha,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

interface Review {
  name: string;
  country: string;
  avatar: string;
  amount: string;
  content: string;
  time: string;
}

const UserReviews = () => {
  const theme = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateRandomReviews = () => {
      const countries = [
        { 
          name: '中国', 
          flag: '🇨🇳',
          nicknames: [
            '星辰大海', '风清扬', '逍遥子', '云游四海', '笑看风云',
            '追梦人', '独行侠', '浪迹天涯', '清风徐来', '明月照我心'
          ]
        },
        { 
          name: '美国', 
          flag: '🇺🇸',
          nicknames: [
            'CryptoKing', 'BitcoinPro', 'TradingMaster', 'DigitalNomad', 'BlockchainGuru',
            'CryptoTrader', 'BitcoinHunter', 'TradingNinja', 'DigitalExplorer', 'BlockchainWizard'
          ]
        },
        { 
          name: '日本', 
          flag: '🇯🇵',
          nicknames: [
            '桜の風', '月の光', '星の海', '雲の上', '風の道',
            '花の香', '空の色', '夢の翼', '光の道', '虹の橋'
          ]
        },
        { 
          name: '韩国', 
          flag: '🇰🇷',
          nicknames: [
            '별빛', '달빛', '꿈의여행', '하늘길', '바람길',
            '별의노래', '달의노래', '꿈의노래', '하늘의노래', '바람의노래'
          ]
        },
        { 
          name: '英国', 
          flag: '🇬🇧',
          nicknames: [
            'CryptoLord', 'BitcoinBaron', 'TradingKnight', 'DigitalDuke', 'BlockchainEarl',
            'CryptoCount', 'BitcoinViscount', 'TradingBaronet', 'DigitalKnight', 'BlockchainSquire'
          ]
        },
        { 
          name: '德国', 
          flag: '🇩🇪',
          nicknames: [
            'KryptoKönig', 'BitcoinMeister', 'Handelsmeister', 'DigitalExperte', 'BlockchainProfi',
            'KryptoExperte', 'BitcoinProfi', 'Handelsprofi', 'DigitalMeister', 'BlockchainMeister'
          ]
        },
        { 
          name: '法国', 
          flag: '🇫🇷',
          nicknames: [
            'RoiCrypto', 'MaîtreBitcoin', 'MaîtreTrading', 'ExpertDigital', 'ProBlockchain',
            'ExpertCrypto', 'ProBitcoin', 'ExpertTrading', 'MaîtreDigital', 'ProDigital'
          ]
        },
        { 
          name: '俄罗斯', 
          flag: '🇷🇺',
          nicknames: [
            'КриптоКороль', 'БиткойнМастер', 'ТрейдингЭксперт', 'ЦифровойГуру', 'БлокчейнПрофи',
            'КриптоЭксперт', 'БиткойнПрофи', 'ТрейдингПрофи', 'ЦифровойПрофи', 'БлокчейнМастер'
          ]
        }
      ];

      const contents = [
        '熊猫量化真是太棒了！收益稳定，操作简单，非常适合新手。',
        '使用熊猫量化后，我的投资收益翻了一倍，感谢这个平台！',
        '作为一个上班族，熊猫量化帮我实现了财务自由的第一步。',
        '熊猫量化的策略非常稳健，让我在熊市也能保持盈利。',
        '这是我用过的最好的量化交易平台，强烈推荐！',
        '熊猫量化的客服团队非常专业，解决问题很及时。',
        '界面设计很人性化，功能也很强大，非常满意！',
        '熊猫量化的风控做得很好，让我很放心。',
      ];

      const newReviews = Array.from({ length: 20 }, (_, i) => {
        const country = countries[Math.floor(Math.random() * countries.length)];
        const isMale = Math.random() > 0.5;
        const randomAmount = (Math.random() * 10000 + 1000).toFixed(2);
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const date = new Date();
        date.setHours(randomHours);
        date.setMinutes(randomMinutes);

        const nickname = country.nicknames[Math.floor(Math.random() * country.nicknames.length)];

        return {
          name: nickname,
          country: `${country.flag} ${country.name}`,
          avatar: isMale ? '👨' : '👩',
          amount: `${randomAmount} USDT`,
          content: contents[Math.floor(Math.random() * contents.length)],
          time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };
      });

      return newReviews;
    };

    const generatedReviews = generateRandomReviews();
    setReviews(generatedReviews);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography>暂无评论</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 0.5, md: 1 },
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 255, 184, 0.02) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#00FFB8',
              fontWeight: 700,
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #00FFB8, transparent)',
                borderRadius: '2px',
              },
            }}
          >
            用户评价
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666666',
              textAlign: 'center',
              mb: 1,
              fontSize: '1.2rem',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            听听用户怎么说
          </Typography>
        </motion.div>

        <Box
          sx={{
            height: '300px',
            overflow: 'hidden',
            position: 'relative',
            width: '100%',
          }}
        >
          <motion.div
            animate={{
              x: [0, -2000],
            }}
            transition={{ 
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                gap: 3,
                width: 'max-content',
                padding: '0 20px',
              }}
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ minWidth: '300px' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(0, 255, 184, 0.1)',
                      borderRadius: '24px',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(45deg, transparent, rgba(0,255,184,0.05), transparent)',
                        transform: 'translateX(-100%)',
                        transition: 'transform 0.6s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0, 255, 184, 0.15)',
                        border: '1px solid rgba(0, 255, 184, 0.2)',
                        '&::before': {
                          transform: 'translateX(100%)',
                        },
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            fontSize: '1.5rem',
                            mr: 2,
                            background: 'linear-gradient(135deg, #00FFB8 0%, #00B8FF 100%)',
                            color: '#FFFFFF',
                            boxShadow: '0 0 10px rgba(0, 255, 184, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          {review.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              background: 'linear-gradient(135deg, #00FFB8 0%, #00B8FF 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {review.name}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#666666',
                            }}
                          >
                            {review.country}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          color: '#333333',
                          mb: 2,
                          lineHeight: 1.6,
                        }}
                      >
                        {review.content}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          sx={{
                            color: '#00FFB8',
                            fontWeight: 500,
                          }}
                        >
                          {review.amount}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#666666',
                          }}
                        >
                          {review.time}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default UserReviews; 