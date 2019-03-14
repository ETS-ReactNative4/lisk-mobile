import React from 'react';
import { View } from 'react-native';
import connect from 'redux-connect-decorator';
import { translate } from 'react-i18next';
import withTheme from '../withTheme';
import { P } from '../toolBox/typography';
import Icon from '../toolBox/icon';
import transactions from '../../constants/transactions';
import { transactions as transactionsAPI } from '../../utilities/api';
import getStyles from './styles';
import { colors } from '../../constants/styleGuide';

const Row = ({
  styles, theme, t, icon, title, children,
}) => (
  <View style={[styles.detailRow, styles.theme.detailRow]}>
    <Icon
      name={icon}
      size={22}
      style={styles.rowIcon}
      color={colors[theme].gray2}
    />
    <View style={styles.rowContent}>
      <P style={[styles.label, styles.theme.label]}>{t(title)}</P>
      <View style={styles.addressContainer}>
        {children}
      </View>
    </View>
  </View>
);

export default withTheme(translate()(Row), getStyles());
