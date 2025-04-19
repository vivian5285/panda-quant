import React from 'react';
import { useTranslation } from 'react-i18next';

export const withLanguageChange = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithLanguageChangeComponent(props: P) {
    const { i18n } = useTranslation();
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    React.useEffect(() => {
      const handleLanguageChange = () => {
        forceUpdate();
      };

      // 只在组件挂载时添加监听器
      i18n.on('languageChanged', handleLanguageChange);

      return () => {
        i18n.off('languageChanged', handleLanguageChange);
      };
    }, [i18n]);

    return <WrappedComponent {...props} />;
  };
};

export default withLanguageChange; 