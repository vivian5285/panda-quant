import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
        name: string;
        type: string;
        appName: string;
        userManagement: string;
        chainAddressManagement: string;
        userStatusManagement: string;
        strategyManagement: string;
        actions: string;
        edit: string;
        delete: string;
        save: string;
        cancel: string;
        close: string;
        refresh: string;
        addChain: string;
        editChain: string;
        logManagement: string;
        log: {
          management: string;
          timestamp: string;
          level: string;
          user: string;
          action: string;
          message: string;
          startDate: string;
          endDate: string;
        };
        all: string;
        search: string;
        addStrategy: string;
        editStrategy: string;
        status: string;
        settings: {
          maintenanceMode: string;
          enabled: string;
          disabled: string;
          maxUsers: string;
          defaultBalance: string;
          hostingFee: string;
          save: string;
        };
        username: string;
        email: string;
        balance: string;
        hostingFee: string;
        deductionCredit: string;
        addUser: string;
        editUser: string;
        editUserStatus: string;
        amount: string;
        createdAt: string;
        strategyType: {
          arbitrage: string;
          market_making: string;
          trend_following: string;
        };
        strategyStatus: {
          active: string;
          inactive: string;
          pending: string;
        };
        userStatus: {
          active: string;
          inactive: string;
          suspended: string;
        };
        rechargeStatus: {
          success: string;
          failed: string;
          pending: string;
        };
        dashboard: {
          retry: string;
          refresh: string;
        };
        logout: string;
        footer: {
          copyright: string;
        };
        navigation: {
          dashboard: string;
          settings: string;
        };
      };
    };
  }

  interface TFunction {
    <T extends string>(key: T | T[], options?: any): string;
  }
} 