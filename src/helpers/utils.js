import React, { useContext } from 'react';
// import { store } from 'react-notifications-component';
// import { FaExternalLinkAlt } from 'react-icons/fa';

import { AppContext } from '../components/ContextProvider';


export const maskAddress = (address, maskingChar='.', maskedChars=8, charsPre=7, charsPost=7) => {
  const pre = address.substring(0, charsPre);
  const post = address.substring(address.length - charsPost);
  return `${pre}${maskingChar.repeat(maskedChars)}${post}`;
};

export const showNotification = options => {
  const {
    dismiss = { duration: 60 * 1000 }, // Dismiss after 10 minutes
    message,
    title = 'ERROR',
    type = 'danger',
  } = options;

  /*store.addNotification({
    message,
    title,
    type,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animated', 'fadeIn'],
    animationOut: ['animated', 'fadeOut'],
    dismiss,
  });*/
};

export const formattedStringAmount = ({
  amount,
  currency = 'CCX',
  formatOptions = { minimumFractionDigits: 5, maximumFractionDigits: 5 },
  showCurrency,
  useSymbol,
}) => {
  let c = '';
  const symbols = { USD: '$', BTC: 'B' };
  if (showCurrency || useSymbol) {
    c = useSymbol
      ? symbols[currency]
      : currency;
  }
  return `${useSymbol ? `${c} ` : ''}${parseFloat(amount).toLocaleString(undefined, formatOptions)}${!useSymbol ? ` ${c}` : ''}`;
};

export const FormattedAmount = props => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  const { amount, currency = 'CCX', showCurrency = true, useSymbol = false } = props;

  let minimumFractionDigits;
  let maximumFractionDigits;

  switch (currency) {
    case 'BTC':
      minimumFractionDigits = 8;
      maximumFractionDigits = 8;
      break;
    case 'USD':
      minimumFractionDigits = 2;
      maximumFractionDigits = 2;
      break;
    default:
      minimumFractionDigits = appSettings.coinDecimals;
      maximumFractionDigits = appSettings.coinDecimals;
      break;
  }

  const formatOptions = { minimumFractionDigits, maximumFractionDigits };

  return (
    <>
      {formattedStringAmount({ amount, currency, formatOptions, showCurrency, useSymbol })}
    </>
  );
};

export const CCXExplorerLink = props => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  const {
    hash,
    type = 'transaction',
    maskHash = false,
  } = props;

  return (
    <a
      href={`${appSettings.explorerURL}/index.html?hash=${hash}#blockchain_${type}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {maskHash ? maskAddress(hash) : hash} {/*<FaExternalLinkAlt className="tx-link-icon"/>*/}
    </a>
  );
};
