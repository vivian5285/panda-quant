import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
        appName: string;
        login: {
          title: string;
          username: string;
          password: string;
          submit: string;
          error: string;
        };
        dashboard: {
          title: string;
          totalUsers: string;
          activeUsers: string;
          totalChains: string;
        };
        userManagement: string;
        chainAddressManagement: string;
        userStatusManagement: string;
        strategyManagement: string;
        settings: {
          title: string;
          theme: {
            title: string;
            darkMode: string;
          };
          system: {
            title: string;
          };
          save: string;
        };
        status: {
          active: string;
          insufficient_balance: string;
          suspended: string;
        };
        actions: string;
        edit: string;
        delete: string;
        save: string;
        cancel: string;
        close: string;
        refresh: string;
        name: string;
        description: string;
        type: string;
        email: string;
        balance: string;
        deductionCredit: string;
        hostingFee: string;
        lastLogin: string;
        rechargeInfo: string;
        count: string;
        total: string;
        rechargeHistory: string;
        amount: string;
        createdAt: string;
        chainName: string;
        chainAddress: string;
        notFound: {
          title: string;
          message: string;
          backToHome: string;
        };
        error: {
          fetchingUsers: string;
          savingUser: string;
          deletingUser: string;
          fetchingChains: string;
          savingChain: string;
          deletingChain: string;
          fetchingStrategies: string;
          savingStrategy: string;
          deletingStrategy: string;
          fetchingRechargeHistory: string;
          savingUserStatus: string;
        };
        confirm: {
          deleteUser: string;
          deleteChain: string;
          deleteStrategy: string;
        };
        strategyType: {
          quantitative: string;
          technical: string;
          fundamental: string;
        };
        strategyStatus: {
          active: string;
          inactive: string;
          maintenance: string;
        };
        userStatus: {
          active: string;
          insufficient_balance: string;
          suspended: string;
        };
        rechargeStatus: {
          success: string;
          failed: string;
        };
      };
    };
  }
} 