import { useEffect, useState } from 'react';
// import WAValidator from 'multicoin-address-validator';


export const useFormInput = init => {
  const [value, setValue] = useState(init);
  const onChange = e => setValue(e.target.value);
  const reset = () => setValue('');
  return { bind: { value, onChange }, reset, setValue, value };
};

export const useFormValidation = init => {
  const [formValid, setFormValid] = useState(false);
  useEffect(() => { setFormValid(init) }, [init]);
  return formValid;
};

export const useTypeaheadInput = init => {
  const [defaultInputValue, setDefaultInputValue] = useState(init);
  const [paymentIDValue, setPaymentIDValue] = useState('');
  const onInputChange = value => setDefaultInputValue(value);
  const onChange = value => {
    if (value.length > 0) {
      value[0].address ? setDefaultInputValue(value[0].address) : setDefaultInputValue(value[0]);
      if (value[0].paymentID !== '') setPaymentIDValue(value[0].paymentID)
    }
  };
  const reset = () => setDefaultInputValue('');
  return {
    bind: { defaultInputValue, onInputChange, onChange },
    paymentIDValue,
    reset,
    setDefaultInputValue,
    value: defaultInputValue,
  };
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value) }, delay);
    return () => { clearTimeout(handler) };
  }, [delay, value],
  );
  return debouncedValue;
};

export const useCalculatedValues = (amount, marketData) => {
  const [btcValue, setBtcValue] = useState(amount);
  const [usdValue, setUsdValue] = useState(amount);

  const ccxToUSD =  marketData ? marketData.market_data.current_price.usd : 0;
  const ccxToBTC =  marketData ? marketData.market_data.current_price.btc : 0;

  useEffect(() => {
    setBtcValue(parseFloat(amount) > 0 ? amount * ccxToBTC : 0);
    setUsdValue(parseFloat(amount) > 0 ? amount * ccxToUSD : 0);
  }, [amount, ccxToBTC, ccxToUSD]);

  return { btcValue, usdValue };
};

export const useSendFormValidation = ({
  amount,
  appSettings,
  fromAddress,
  message = '',
  password = '',
  paymentID = '',
  toAddress,
  twoFACode,
  userSettings,
  wallet,
}) => {
  const { coinDecimals, defaultFee, messageLimit } = appSettings;
  const { twoFAEnabled } = userSettings;
  let isValid = false;
  const [formValid, setFormValid] = useState(isValid);

  if (wallet) {
    const parsedAmount = !Number.isNaN(parseFloat(amount)) ? parseFloat(amount) : 0;
    const totalAmount = parsedAmount > 0 ? parsedAmount + defaultFee : 0;
    const walletBalanceValid = totalAmount <= parseFloat(wallet.balance.toFixed(coinDecimals));

    isValid = (
      (fromAddress && toAddress !== fromAddress) &&
      // (WAValidator.validate(toAddress, 'CCX') || new RegExp(/^[a-z0-9]*\.conceal\.id/).test(toAddress)) &&
      totalAmount > 0 &&
      walletBalanceValid &&
      (message === '' || message.length <= messageLimit) &&
      (paymentID === '' || paymentID.length === 64) &&
      (twoFAEnabled
          ? (parseInt(twoFACode) && twoFACode.toString().length === 6)
          : (password !== '' && password.length >= 8)
      )
    );
  }

  useEffect(() => setFormValid(isValid), [isValid]);
  return formValid;
};
