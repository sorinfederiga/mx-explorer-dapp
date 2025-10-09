import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { InfoTooltip } from 'components';
import { formatBigNumber } from 'helpers';
import { useGetNewAccountsToday, useHasGrowthWidgets } from 'hooks';
import { faCircleBolt } from 'icons/solid';
import { statsSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const AccountsStatsCard = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const { stats } = useSelector(statsSelector);
  const { accounts } = stats;

  const newAccountsToday = useGetNewAccountsToday();

  return (
    <StatsCard title='Total Accounts' value={accounts}>
      {hasGrowthWidgets && (
        <>
          <FontAwesomeIcon icon={faCircleBolt} className='me-2' />
          {formatBigNumber({
            value: newAccountsToday,
            showEllipsisIfZero: true
          })}{' '}
          active today
          <InfoTooltip
            title='Number of accounts that have sent or received transactions in the last 24 hours'
            className='d-inline-flex text-primary'
            persistent
          />
        </>
      )}
    </StatsCard>
  );
};
