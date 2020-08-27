import React, { useContext, useEffect, useState } from 'react';
import QRCode from 'qrcode.react';

import { AppContext } from '../ContextProvider';
import { useFormInput } from '../../helpers/hooks';


const Receive = props => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  const { currentWallet } = props;

  const [qrCodeLarge, setQRCodeLarge] = useState(false);
  const [qrCodeString, setQrCodeString] = useState(`${appSettings.qrCodePrefix}:${props.address}`);
  const { value: amount, bind: bindAmount } = useFormInput('');
  const { value: paymentID, bind: bindPaymentID } = useFormInput('');
  const { value: message, bind: bindMessage } = useFormInput('');
  const { value: label, bind: bindLabel } = useFormInput('');

  useEffect(() => {
    const paramsObject = {};
    if (amount !== '' && parseFloat(amount)) paramsObject.tx_amount = amount;
    if (paymentID !== '') paramsObject.tx_payment_id = paymentID;
    if (message !== '') paramsObject.tx_message = message;
    if (label !== '') paramsObject.tx_label = label;
    const params = Object.keys(paramsObject).length > 0
      ? `?${Object.keys(paramsObject).map(param => `${param}=${paramsObject[param]}`).join('&')}`
      : '';
    setQrCodeString(`${appSettings.qrCodePrefix}:${currentWallet}${params}`);
  }, [amount, appSettings.qrCodePrefix, label, message, paymentID, currentWallet]);

  return (
    <div className="receive">
      <div className="element-header">
        <h4>Receive</h4>
      </div>

      <div  className={`form-layout ${qrCodeLarge ? 'hidden' : ''}`}>
        <div>
          <div className="form-label">
            Current wallet address
          </div>
          <div>
            <input
              value={currentWallet}
              readOnly
              className="form-control"
            />
          </div>
        </div>

        <div>
          <div>
            Amount to receive
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
              step={Math.pow(10, -(appSettings.coinDecimals - 1))}
            />
          </div>
        </div>

        <div>
          <div>
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
          <div>
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
            />
          </div>
        </div>

        <div>
          <div>
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
            />
          </div>
        </div>
      </div>

      <div className="qr-code">
        <QRCode
          value={qrCodeString}
          size={qrCodeLarge ? 256 : 128}
          onClick={() => setQRCodeLarge(!qrCodeLarge)}
        />
      </div>
    </div>
  )
};

export default Receive;
