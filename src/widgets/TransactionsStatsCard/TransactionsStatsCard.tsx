import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { formatBigNumber } from 'helpers';
import { useGetNewTransactionsToday, useHasGrowthWidgets } from 'hooks';
import { faCirclePlus } from 'icons/solid';
import { statsSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const TransactionsStatsCard = ({
  className
}: {
  className?: string;
}) => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { stats } = useSelector(statsSelector);
  const { transactions } = stats;

  const newTransactionsToday = useGetNewTransactionsToday();

  return (
    <StatsCard
      title='Total Transactions'
      value={transactions}
      className={className}
    >
      {hasGrowthWidgets && (
        <>
          <FontAwesomeIcon icon={faCirclePlus} className='me-2' />
          {formatBigNumber({
            value: newTransactionsToday,
            showEllipsisIfZero: true
          })}{' '}
          today
        </>
      )}
    </StatsCard>
  );
};
