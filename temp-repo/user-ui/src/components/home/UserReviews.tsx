import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Container,
  alpha,
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
  const [reviews, setReviews] = useState<Review[]>([]);

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

      setReviews(newReviews);
    };

    generateRandomReviews();
    const interval = setInterval(generateRandomReviews, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        py: 8,
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
        background: `linear-gradient(135deg, ${alpha(themeUtils.palette.background.paper, 0.9)} 0%, ${alpha(themeUtils.palette.background.default, 0.9)} 100%)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              textAlign: 'center',
              mb: 3,
              ...themeUtils.createTextGradient(
                themeUtils.palette.primary.main,
                themeUtils.palette.secondary.main
              ),
              textShadow: `0 0 10px ${alpha(themeUtils.palette.primary.main, 0.3)}`,
            }}
          >
            用户评价
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: themeUtils.palette.text.secondary,
              textAlign: 'center',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            听听用户怎么说
          </Typography>
        </motion.div>

        <Box
          sx={{
            height: '400px',
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
                  <Box
                    sx={{
                      p: 4,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${alpha(themeUtils.palette.background.paper, 0.9)} 0%, ${alpha(themeUtils.palette.background.default, 0.9)} 100%)`,
                      boxShadow: `0 4px 20px ${alpha(themeUtils.palette.primary.main, 0.1)}`,
                      height: '100%',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(themeUtils.palette.divider, 0.1)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(themeUtils.palette.primary.main, 0.1)} 0%, ${alpha(themeUtils.palette.secondary.main, 0.1)} 100%)`,
                        transform: 'translateY(-5px)',
                        boxShadow: `0 8px 30px ${alpha(themeUtils.palette.primary.main, 0.2)}`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          fontSize: '1.5rem',
                          mr: 2,
                          background: themeUtils.createGradient(
                            themeUtils.palette.primary.main,
                            themeUtils.palette.secondary.main
                          ),
                          color: themeUtils.palette.background.paper,
                          boxShadow: `0 0 10px ${alpha(themeUtils.palette.primary.main, 0.5)}`,
                        }}
                      >
                        {review.avatar}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            ...themeUtils.createTextGradient(
                              themeUtils.palette.primary.main,
                              themeUtils.palette.secondary.main
                            ),
                          }}
                        >
                          {review.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: themeUtils.palette.text.secondary,
                          }}
                        >
                          {review.country}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        color: themeUtils.palette.text.primary,
                        mb: 2,
                        lineHeight: 1.6,
                      }}
                    >
                      {review.content}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          color: themeUtils.palette.primary.main,
                          fontWeight: 500,
                        }}
                      >
                        {review.amount}
                      </Typography>
                      <Typography
                        sx={{
                          color: themeUtils.palette.text.secondary,
                        }}
                      >
                        {review.time}
                      </Typography>
                    </Box>
                  </Box>
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