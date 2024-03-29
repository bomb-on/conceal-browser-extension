import React, { useContext, useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import { AppContext } from '../ContextProvider';
import { useFormInput, useSendFormValidation, useTypeaheadInput } from '../../helpers/hooks';
import { maskAddress } from '../../helpers/utils';


const Send = props => {
  const { actions, state } = useContext(AppContext);
  const { sendTx } = actions;
  const { appSettings, layout, user, userSettings, wallets } = state;
  const { coinDecimals, defaultFee, messageLimit } = appSettings;
  const { formSubmitted } = layout;
  const { wallet } = props;

  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(wallets[wallet] || { balance: 0 });

  const { value: address, bind: bindAddress, reset: resetAddress, paymentIDValue } = useTypeaheadInput(props.contact ? props.contact.address : '');
  const { value: paymentID, bind: bindPaymentID, setValue: setPaymentIDValue, reset: resetPaymentID } = useFormInput(props.contact ? props.contact.paymentID : '');
  const { value: amount, bind: bindAmount, setValue: setAmountValue, reset: resetAmount } = useFormInput('');
  const { value: message, bind: bindMessage, setValue: setMessageValue, reset: resetMessage } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode, reset: resetTwoFACode } = useFormInput('');
  const { value: password, bind: bindPassword, reset: resetPassword } = useFormInput('');
  const { value: label, bind: bindLabel, setValue: setLabelValue, reset: resetLabel } = useFormInput('');

  const parsedAmount = !Number.isNaN(parseFloat(amount)) ? parseFloat(amount) : 0;
  const totalAmount = parsedAmount > 0 ? parseFloat((parsedAmount + defaultFee).toFixed(coinDecimals)) : 0;
  const [maxValue, setMaxValue] = useState((selectedWallet.balance - defaultFee).toFixed(coinDecimals));
  const calculateMax = () => setAmountValue(maxValue);

  useEffect(() => {
    if (selectedWallet) {
      setMaxValue((selectedWallet.balance - defaultFee).toFixed(coinDecimals));
    }
  }, [coinDecimals, defaultFee, wallet]);

  useEffect(() => {
    setPaymentIDValue(paymentIDValue);
  }, [paymentIDValue, setPaymentIDValue]);

  const formValid = useSendFormValidation({
    amount,
    appSettings,
    fromAddress: wallet,
    message,
    password,
    paymentID,
    toAddress: address,
    twoFACode,
    userSettings,
    wallet: selectedWallet,
  });

  return (
    <div className="send">

      <form
        className="form"
        onSubmit={e =>
          sendTx(
            {
              e,
              wallet,
              address,
              paymentID,
              amount,
              message,
              twoFACode,
              password,
              label,
              id: 'sendForm',
            },
            [
              resetAddress,
              resetPaymentID,
              resetAmount,
              resetMessage,
              resetTwoFACode,
              resetPassword,
              resetLabel,
            ],
          )
        }
      >

        <div className="form-layout">
          <div>
            <div className="form-label">
              Address
            </div>
            <div>
              <Typeahead
                {...bindAddress}
                id="address"
                labelKey="address"
								className="form-control"
                filterBy={['address', 'label', 'paymentID']}
                options={user.addressBook}
                placeholder="Address"
                emptyLabel="No records in Address Book"
                highlightOnlyResult
                shouldSelect
                minLength={1}
                renderMenuItemChildren={option =>
                  <><div className="contacts">
										  <div className="addrDropdownName" key="name">{option.label}</div>
											<div className="addrDropdownLabel" key="address">
													<span className="addrDropdownAddress">{maskAddress(option.address)}</span>
													{option.paymentID &&
													<span> (<span className="addrDropdownPaymentId">{maskAddress(option.paymentID)}</span>)</span>
													}
											</div>
										</div>
                  </>
                }
              />
            </div>
          </div>

          <div>
						<div className="form-label">
              Amount
            </div>
            <div>
              <input
                {...bindAmount}
                size={2}
                placeholder="Amount"
                className="form-control"
                name="amount"
                type="number"
                min={0}
                max={maxValue}
                step={Math.pow(10, -coinDecimals).toFixed(coinDecimals)}
              />
            </div>
          </div>

          <div>
						<div className="form-label">
              Payment ID (optional)
            </div>
            <div>
              <input
                {...bindPaymentID}
                size={6}
                placeholder="Payment ID"
                className="form-control"
                name="paymentID"
                type="text"
                minLength={64}
                maxLength={64}
              />
            </div>
          </div>

          <div>
						<div className="form-label">
              Message (optional)
            </div>
            <div>
              <input
                {...bindMessage}
                size={6}
                placeholder="Message"
                className="form-control"
                name="message"
                type="text"
                maxLength={messageLimit}
              />
            </div>
          </div>

          <div>
						<div className="form-label">
              Label (optional)
            </div>
            <div>
              <input
                {...bindLabel}
                size={6}
                placeholder="Label"
                className="form-control"
                name="label"
                type="text"
                minLength={1}
              />
            </div>
          </div>

          {userSettings.twoFAEnabled
            ? <div>
                <div className="form-label">
                  2FA Code
                </div>
                <div>
                  <input
                    {...bindTwoFACode}
                    size={6}
                    placeholder="2 Factor Authentication"
                    className="form-control"
                    name="twoFACode"
                    type="number"
                    minLength={6}
                    maxLength={6}
                  />
                </div>
              </div>
            : <div>
                <div className="form-label">
                  Password
                </div>
                <div>
                  <input
                    {...bindPassword}
                    size={6}
                    placeholder="Password"
                    className="form-control"
                    name="password"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
              </div>
          }

          <div>
            <button className="send-button" type="submit" disabled={formSubmitted || !formValid} >
              {formSubmitted ? 'Sending' : 'Send'}
            </button>
          </div>
        </div>

      </form>
    </div>
  )
};

export default Send;
