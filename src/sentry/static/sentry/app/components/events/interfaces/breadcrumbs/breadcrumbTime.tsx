import React from 'react';
import styled from '@emotion/styled';
import moment from 'moment';

import {defined} from 'app/utils';
import Tooltip from 'app/components/tooltip';
import getDynamicText from 'app/utils/getDynamicText';

type Props = {
  timestamp?: string;
};

const BreadcrumbTime = ({timestamp}: Props) => {
  const getTooltipTitle = () => {
    const parsedTimestamp = moment(timestamp);
    const timestampFormat = parsedTimestamp.milliseconds() ? 'll H:mm:ss.SSS A' : 'lll';
    return parsedTimestamp.format(timestampFormat);
  };

  return defined(timestamp) ? (
    <Tooltip title={getTooltipTitle()}>
      <Time>
        {getDynamicText({
          value: moment(timestamp).format('HH:mm:ss'),
          fixed: '00:00:00',
        })}
      </Time>
    </Tooltip>
  ) : null;
};

export default BreadcrumbTime;

const Time = styled('div')`
  font-size: 12px;
  color: #493e54;
`;
