import { themes, colors, fonts } from '../../constants/styleGuide';

export default () => ({
  common: {
    container: {
      paddingRight: 20,
      paddingLeft: 20,
      paddingTop: 20,
    },
    itemContainer: {
      width: '100%',
      height: 90,
      paddingTop: 20,
      paddingBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      borderBottomColor: colors.light.gray5,
      borderBottomWidth: 1,
    },
    innerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    title: {
      marginBottom: 15,
    },
    nativeList: {
      marginTop: 0,
      borderTopWidth: 0,
    },
    amountWrapper: {
      // flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    amount: {
      paddingTop: 4,
      width: '100%',
      textAlign: 'right',
    },
    address: {
      paddingTop: 4,
      paddingBottom: 4,
    },
    avatar: {
      paddingRight: 15,
      borderWidth: 1,
    },
    emptyState: {
      width: '100%',
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noActivity: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 10,
    },
    empty: {
      width: 222,
      height: 109,
    },
    loading: {
      width: 237,
      height: 220,
    },
    noTxTitle: {
      paddingTop: 10,
      color: colors.light.gray2,
    },
    pendingIcon: {
      width: 18,
      height: 18,
    },
    initContainer: {
      flexDirection: 'row',
      paddingBottom: 22,
      borderBottomWidth: 1,
      borderBottomColor: colors.light.gray5,
    },
    initText: {
      marginLeft: 7,
    },
    link: {
      fontSize: fonts.size.small,
      color: colors.light.blue,
    },
    footer: {
      height: 90,
      width: '100%',
    },
    image: {
      width: 50,
      height: 50,
    },
    incoming: {
      paddingRight: 10,
      paddingLeft: 10,
      paddingBottom: 3,
      borderRadius: 2,
      overflow: 'hidden',
    },
  },
  [themes.light]: {
    itemContainer: {
      borderBottomColor: colors.light.gray5,
    },
    emptyState: {
      backgroundColor: colors.light.white,
    },
    date: {
      color: colors.light.gray1,
    },
    avatar: {
      borderColor: colors.light.white,
    },
    incoming: {
      color: colors.light.green,
      backgroundColor: colors.light.incomingBg,
    },
  },
  [themes.dark]: {
    title: {
      color: colors.dark.white,
    },
    itemContainer: {
      borderBottomColor: colors.dark.gray5,
    },
    emptyState: {
      backgroundColor: colors.dark.gray5,
    },
    address: {
      color: colors.dark.white,
    },
    date: {
      color: colors.dark.gray4,
    },
    amount: {
      color: colors.dark.white,
    },
    avatar: {
      borderColor: colors.dark.gray5,
    },
    incoming: {
      color: colors.dark.green,
      backgroundColor: colors.dark.incomingBg,
    },
  },
});
