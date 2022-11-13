import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCrop } from 'react-icons/fa';

import { primaryTextColor } from '../colors';
import useUserSettings from '../hooks/useUserSettings';


const CropModeButton = memo(({ size = 20, style }) => {
  const { t } = useTranslation();
  const { cropMode, toggleCropMode } = useUserSettings();

  return (
    <FaCrop
      title={t('Toggle crop mode')}
      size={size}
      style={{ color: cropMode ? primaryTextColor : 'white', ...style }}
      onClick={toggleCropMode}
    />
  );
});

export default CropModeButton;
