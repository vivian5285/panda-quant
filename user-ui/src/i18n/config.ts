import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      
      // Auth
      'auth.register': 'Register',
      'auth.login': 'Login',
      'auth.logout': 'Logout',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.referralCode': 'Referral Code',
      
      // Asset
      'asset.balance': 'Balance',
      'asset.deposit': 'Deposit',
      'asset.withdraw': 'Withdraw',
      'asset.hostingFee': 'Hosting Fee',
      'asset.referralReward': 'Referral Reward',
      'asset.selectChain': 'Select Chain',
      'asset.copyAddress': 'Copy Address',
      'asset.submitTxHash': 'Submit Transaction Hash',
      
      // Strategy
      'strategy.select': 'Select Strategy',
      'strategy.startHosting': 'Start Hosting',
      'strategy.stopHosting': 'Stop Hosting',
      'strategy.monthlyReturn': 'Monthly Return',
      'strategy.historicalReturn': 'Historical Return',
      'strategy.backtest': 'Backtest',
      
      // Admin
      'admin.approve': 'Approve',
      'admin.reject': 'Reject',
      'admin.pending': 'Pending',
      'admin.confirmed': 'Confirmed',
      'admin.rejected': 'Rejected'
    }
  },
  zh: {
    translation: {
      // Common
      'common.loading': '加载中...',
      'common.error': '错误',
      'common.success': '成功',
      
      // Auth
      'auth.register': '注册',
      'auth.login': '登录',
      'auth.logout': '退出',
      'auth.email': '邮箱',
      'auth.password': '密码',
      'auth.referralCode': '推荐码',
      
      // Asset
      'asset.balance': '余额',
      'asset.deposit': '充值',
      'asset.withdraw': '提现',
      'asset.hostingFee': '托管费',
      'asset.referralReward': '推荐奖励',
      'asset.selectChain': '选择链',
      'asset.copyAddress': '复制地址',
      'asset.submitTxHash': '提交交易哈希',
      
      // Strategy
      'strategy.select': '选择策略',
      'strategy.startHosting': '开始托管',
      'strategy.stopHosting': '停止托管',
      'strategy.monthlyReturn': '月度收益',
      'strategy.historicalReturn': '历史收益',
      'strategy.backtest': '回测',
      
      // Admin
      'admin.approve': '通过',
      'admin.reject': '拒绝',
      'admin.pending': '待处理',
      'admin.confirmed': '已确认',
      'admin.rejected': '已拒绝'
    }
  },
  ko: {
    translation: {
      // Common
      'common.loading': '로딩 중...',
      'common.error': '오류',
      'common.success': '성공',
      
      // Auth
      'auth.register': '등록',
      'auth.login': '로그인',
      'auth.logout': '로그아웃',
      'auth.email': '이메일',
      'auth.password': '비밀번호',
      'auth.referralCode': '추천 코드',
      
      // Asset
      'asset.balance': '잔액',
      'asset.deposit': '입금',
      'asset.withdraw': '출금',
      'asset.hostingFee': '호스팅 수수료',
      'asset.referralReward': '추천 보상',
      'asset.selectChain': '체인 선택',
      'asset.copyAddress': '주소 복사',
      'asset.submitTxHash': '트랜잭션 해시 제출',
      
      // Strategy
      'strategy.select': '전략 선택',
      'strategy.startHosting': '호스팅 시작',
      'strategy.stopHosting': '호스팅 중지',
      'strategy.monthlyReturn': '월간 수익',
      'strategy.historicalReturn': '역대 수익',
      'strategy.backtest': '백테스트',
      
      // Admin
      'admin.approve': '승인',
      'admin.reject': '거부',
      'admin.pending': '대기 중',
      'admin.confirmed': '확인됨',
      'admin.rejected': '거부됨'
    }
  },
  ja: {
    translation: {
      // Common
      'common.loading': '読み込み中...',
      'common.error': 'エラー',
      'common.success': '成功',
      
      // Auth
      'auth.register': '登録',
      'auth.login': 'ログイン',
      'auth.logout': 'ログアウト',
      'auth.email': 'メール',
      'auth.password': 'パスワード',
      'auth.referralCode': '紹介コード',
      
      // Asset
      'asset.balance': '残高',
      'asset.deposit': '入金',
      'asset.withdraw': '出金',
      'asset.hostingFee': 'ホスティング料',
      'asset.referralReward': '紹介報酬',
      'asset.selectChain': 'チェーン選択',
      'asset.copyAddress': 'アドレスをコピー',
      'asset.submitTxHash': 'トランザクションハッシュを提出',
      
      // Strategy
      'strategy.select': '戦略を選択',
      'strategy.startHosting': 'ホスティング開始',
      'strategy.stopHosting': 'ホスティング停止',
      'strategy.monthlyReturn': '月次リターン',
      'strategy.historicalReturn': '過去のリターン',
      'strategy.backtest': 'バックテスト',
      
      // Admin
      'admin.approve': '承認',
      'admin.reject': '却下',
      'admin.pending': '保留中',
      'admin.confirmed': '確認済み',
      'admin.rejected': '却下済み'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 