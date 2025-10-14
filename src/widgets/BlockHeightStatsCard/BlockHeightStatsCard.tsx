import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { statsSelector } from 'redux/selectors';
import { pageHeadersBlocksStatsSelector } from 'redux/selectors';
import { StatsCard } from 'widgets';

export const BlockHeightStatsCard = () => {
  const { unprocessed } = useSelector(statsSelector);
  const { blockHeight } = useSelector(pageHeadersBlocksStatsSelector);

  const displayValue = useMemo(() => {
    const bNBlocks = new BigNumber(unprocessed?.blocks ?? 0);
    if (bNBlocks.isInteger() && bNBlocks.isGreaterThan(0)) {
      return bNBlocks.toFormat(0);
    }

    const bNToolsBlocks = new BigNumber(blockHeight ?? 0);
    if (bNToolsBlocks.isInteger() && bNToolsBlocks.isGreaterThan(0)) {
      return bNToolsBlocks.toFormat(0);
    }

    return ELLIPSIS;
  }, [blockHeight, unprocessed.blocks]);

  return (
    <StatsCard
      title='Block Height'
      value={displayValue}
      className='card-solitary'
    />
  );
};
