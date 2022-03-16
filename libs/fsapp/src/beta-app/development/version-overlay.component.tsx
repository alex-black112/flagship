import React, { FC, useCallback, useContext, useMemo, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useApp } from '../app/context';
import { useModals } from '../modal';

import { DevMenu } from './dev-menu.component';
import { styles } from './version-overlay.styles';
import { IsDevMenuShown, ToggleDevMenu } from './show-dev-menu.context';
import { shouldShowDevMenu } from './utils';

const Version: FC = () => {
  const app = useApp();
  const modals = useModals();
  const toggleDevMenu = useContext(ToggleDevMenu);

  const openDevMenu = useCallback(() => {
    modals
      .showModal(DevMenu)
      .then((shouldHide) => {
        if (shouldHide === 'hide') {
          toggleDevMenu();
        }
      })
      .catch(() => undefined);
  }, [modals, toggleDevMenu]);

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={'development menu'}
      style={styles.devNoteContainer}
      onPress={openDevMenu}
    >
      <Text style={styles.devNote}>{app?.version}</Text>
    </TouchableOpacity>
  );
};

export const VersionOverlay: FC = ({ children }) => {
  const [showDevMenu, setShowDevMenu] = useState(() => shouldShowDevMenu());
  const toggleDevMenu = useCallback(() => {
    setShowDevMenu((value) => !value);
  }, [setShowDevMenu]);

  return (
    <IsDevMenuShown.Provider value={showDevMenu}>
      <ToggleDevMenu.Provider value={toggleDevMenu}>
        {children}
        {showDevMenu && <Version />}
      </ToggleDevMenu.Provider>
    </IsDevMenuShown.Provider>
  );
};
