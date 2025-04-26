import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

// 支持的 languages
const LANGUAGES = ['en', 'zh', 'ko'] as const;

// 翻译文件路径
const TRANSLATIONS_DIR = path.join(__dirname, '../src/i18n/locales');

// 确保目录存在
if (!fs.existsSync(TRANSLATIONS_DIR)) {
  fs.mkdirSync(TRANSLATIONS_DIR, { recursive: true });
}

// 检查翻译文件是否存在
function checkTranslationFile(lang: string): boolean {
  const filePath = path.join(TRANSLATIONS_DIR, lang, 'translation.json');
  return fs.existsSync(filePath);
}

// 备份现有的翻译文件
function backupTranslationFile(lang: string): void {
  const filePath = path.join(TRANSLATIONS_DIR, lang, 'translation.json');
  const backupPath = path.join(TRANSLATIONS_DIR, lang, `translation.${Date.now()}.json`);
  
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(chalk.yellow(`Backup created for ${lang}: ${backupPath}`));
  }
}

// 合并现有的翻译到新模板
function mergeTranslations(lang: string, template: any): any {
  const filePath = path.join(TRANSLATIONS_DIR, lang, 'translation.json');
  
  if (!fs.existsSync(filePath)) {
    return template;
  }

  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // 深度合并函数
  function deepMerge(target: any, source: any): any {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    
    return output;
  }

  return deepMerge(template, existing);
}

// 检查是否为对象
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// 生成空的翻译文件
function generateEmptyTranslationFile(lang: string) {
  const langDir = path.join(TRANSLATIONS_DIR, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir);
  }

  const template = {
    // 通用
    common: {
      loading: '',
      error: '',
      success: '',
      warning: '',
      confirm: '',
      cancel: '',
      save: '',
      delete: '',
      edit: '',
      search: '',
      filter: '',
      sort: '',
      refresh: '',
      back: '',
      next: '',
      previous: '',
      first: '',
      last: '',
      of: '',
      items: '',
      noData: '',
      selectAll: '',
      deselectAll: '',
      actions: '',
      status: '',
      date: '',
      time: '',
      datetime: '',
      currency: '',
      percentage: '',
      number: '',
      boolean: {
        true: '',
        false: ''
      }
    },

    // 表单
    form: {
      required: '',
      invalid: '',
      minLength: '',
      maxLength: '',
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      phone: '',
      submit: '',
      reset: '',
      validation: {
        required: '',
        email: '',
        minLength: '',
        maxLength: '',
        pattern: '',
        match: ''
      }
    },

    // 错误消息
    errors: {
      network: '',
      server: '',
      unauthorized: '',
      forbidden: '',
      notFound: '',
      timeout: '',
      unknown: '',
      retry: '',
      contactSupport: ''
    },

    // 认证
    auth: {
      login: {
        title: '',
        email: '',
        password: '',
        rememberMe: '',
        forgotPassword: '',
        submit: '',
        noAccount: '',
        signUp: ''
      },
      register: {
        title: '',
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        submit: '',
        haveAccount: '',
        signIn: ''
      },
      forgotPassword: {
        title: '',
        email: '',
        submit: '',
        backToLogin: ''
      },
      resetPassword: {
        title: '',
        newPassword: '',
        confirmPassword: '',
        submit: '',
        backToLogin: ''
      }
    },

    // 首页
    hero: {
      title: '',
      subtitle: '',
      cta: {
        primary: '',
        secondary: ''
      },
      advantages: {
        ai: {
          title: '',
          description: ''
        },
        quant: {
          title: '',
          description: ''
        },
        security: {
          title: '',
          description: ''
        }
      }
    },

    // 熊猫角色
    panda: {
      title: '',
      subtitle: '',
      cta: '',
      expressions: ['', '', '', '', '']
    },

    // 核心优势
    advantages: {
      title: '',
      items: [
        {
          title: '',
          description: ''
        },
        {
          title: '',
          description: ''
        },
        {
          title: '',
          description: ''
        },
        {
          title: '',
          description: ''
        }
      ],
      cta: ''
    },

    // 收益计算器
    profit: {
      title: '',
      subtitle: '',
      disclaimer: '',
      amount: '',
      period: '',
      calculate: '',
      result: ''
    },

    // 使用流程
    howItWorks: {
      title: '',
      steps: [
        {
          title: '',
          description: ''
        },
        {
          title: '',
          description: ''
        },
        {
          title: '',
          description: ''
        },
        {
          title: '',
          description: ''
        },
        {
          title: '',
          description: ''
        }
      ],
      cta: ''
    },

    // 页眉
    header: {
      logo: '',
      nav: {
        home: '',
        products: '',
        performance: '',
        strategies: '',
        security: '',
        referral: '',
        about: '',
        contact: ''
      },
      auth: {
        login: '',
        register: ''
      }
    },

    // 页脚
    footer: {
      company: {
        title: '',
        about: '',
        careers: '',
        press: '',
        blog: ''
      },
      product: {
        title: '',
        features: '',
        pricing: '',
        documentation: '',
        updates: ''
      },
      resources: {
        title: '',
        help: '',
        community: '',
        tutorials: '',
        api: ''
      },
      legal: {
        title: '',
        privacy: '',
        terms: '',
        security: '',
        compliance: ''
      },
      social: {
        title: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        github: ''
      },
      copyright: ''
    },

    // 仪表盘
    dashboard: {
      title: '',
      overview: '',
      performance: '',
      strategies: '',
      settings: '',
      welcome: '',
      lastLogin: '',
      totalBalance: '',
      totalProfit: '',
      activeStrategies: '',
      recentActivity: '',
      quickActions: {
        title: '',
        newStrategy: '',
        deposit: '',
        withdraw: '',
        settings: ''
      }
    },

    // 策略
    strategies: {
      title: '',
      create: '',
      edit: '',
      delete: '',
      list: '',
      details: '',
      performance: '',
      settings: '',
      status: {
        active: '',
        inactive: '',
        paused: '',
        error: ''
      },
      type: {
        ai: '',
        quant: '',
        custom: ''
      },
      risk: {
        low: '',
        medium: '',
        high: ''
      }
    },

    // 交易
    trading: {
      title: '',
      openOrders: '',
      orderHistory: '',
      positions: '',
      balance: '',
      deposit: '',
      withdraw: '',
      settings: '',
      type: {
        market: '',
        limit: '',
        stop: '',
        stopLimit: ''
      },
      side: {
        buy: '',
        sell: ''
      },
      status: {
        open: '',
        filled: '',
        canceled: '',
        rejected: ''
      }
    },

    // 设置
    settings: {
      title: '',
      profile: '',
      security: '',
      notifications: '',
      api: '',
      preferences: '',
      language: '',
      theme: '',
      timezone: '',
      currency: '',
      save: '',
      cancel: ''
    }
  };

  // 备份现有文件
  backupTranslationFile(lang);

  // 合并现有翻译
  const mergedTranslations = mergeTranslations(lang, template);

  // 写入新文件
  fs.writeFileSync(
    path.join(langDir, 'translation.json'),
    JSON.stringify(mergedTranslations, null, 2)
  );

  console.log(chalk.green(`Translation file generated for ${lang}`));
}

// 检查缺失的翻译键
function checkMissingTranslations(): void {
  console.log(chalk.blue('\nChecking for missing translations...'));
  
  const referenceLang = 'en';
  const referencePath = path.join(TRANSLATIONS_DIR, referenceLang, 'translation.json');
  const reference = JSON.parse(fs.readFileSync(referencePath, 'utf8'));

  LANGUAGES.forEach(lang => {
    if (lang === referenceLang) return;

    const filePath = path.join(TRANSLATIONS_DIR, lang, 'translation.json');
    const translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    function findMissingKeys(obj1: any, obj2: any, path: string = ''): string[] {
      const missing: string[] = [];

      Object.keys(obj1).forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;

        if (!(key in obj2)) {
          missing.push(currentPath);
        } else if (typeof obj1[key] === 'object' && !Array.isArray(obj1[key])) {
          missing.push(...findMissingKeys(obj1[key], obj2[key], currentPath));
        }
      });

      return missing;
    }

    const missing = findMissingKeys(reference, translations);
    if (missing.length > 0) {
      console.log(chalk.yellow(`\nMissing translations in ${lang}:`));
      missing.forEach(key => console.log(chalk.red(`  - ${key}`)));
    }
  });
}

// 主函数
function main() {
  console.log(chalk.blue('Starting translation file generation...'));

  // 生成所有语言的翻译文件
  LANGUAGES.forEach(lang => {
    generateEmptyTranslationFile(lang);
  });

  // 检查缺失的翻译
  checkMissingTranslations();

  // 更新类型定义
  console.log(chalk.blue('\nUpdating type definitions...'));
  execSync('npm run build:types', { stdio: 'inherit' });

  console.log(chalk.green('\nTranslation files generated successfully!'));
}

// 运行主函数
main(); 