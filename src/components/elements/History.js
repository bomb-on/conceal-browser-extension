import React from 'react';
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import Moment from 'react-moment';

import { CCXExplorerLink, FormattedAmount } from '../../helpers/utils';


const History = props => {
  const { currentWallet, wallets } = props;

  return (
    <>
      <h4>History</h4>

      <div className="wallet-history">
        {currentWallet && wallets[currentWallet].transactions
          .sort((a, b) => (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
          .map(tx =>
            <div className={`tx ${tx.type === 'received' ? 'tx-incoming-bg' : 'tx-outgoing-bg'}`} key={tx.hash}>
              <div className="tx-icon">
                {tx.type === 'received'
                  ? <FiArrowDownLeft className="tx-incoming" />
                  : <FiArrowUpRight className="tx-outgoing" />
                }
              </div>
              <div className="tx-details">
                <p className="tx-date">
                  <Moment>{tx.timestamp}</Moment>
                </p>
                <p className={tx.type === 'received' ? 'tx-incoming' : 'tx-outgoing'}>
                  <FormattedAmount amount={tx.amount} />
                </p>
                <p className="tx-fee">
                  FEE: <FormattedAmount amount={tx.fee} />
                </p>
                <p className="tx-hash">
                  <CCXExplorerLink hash={tx.hash} maskHash />
                </p>
                {tx.status === 'pending' &&
                  <p>
                    [PENDING]
                  </p>
                }
              </div>
            </div>
          )}
      </div>
    </>
  )
};

export default History;
