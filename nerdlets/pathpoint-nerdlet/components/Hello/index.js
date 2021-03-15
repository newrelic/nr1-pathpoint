import { useI18n } from 'react-simple-i18n';
import React from 'react';

const MyComponent = ({ data }) => {
  const { t } = useI18n();
  return <div>{t('MyComponent.hello')}</div>;
};

export default MyComponent;