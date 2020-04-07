import React from 'react';
import styled from '@emotion/styled';

import {tct} from 'app/locale';
import {IconEllipsis} from 'app/icons/iconEllipsis';

import {LI, IconWrapper} from './styles';

type Props = {
  onClick: () => void;
  quantity: number;
};

const BreadcrumbCollapsed = ({quantity, onClick}: Props) => (
  <StyledLI onClick={onClick}>
    <IconWrapper>
      <IconEllipsis />
    </IconWrapper>
    {tct('Show [quantity] collapsed crumbs', {quantity})}
  </StyledLI>
);

export default BreadcrumbCollapsed;

// TODO(style): color #e7e4eb is not yet in theme
const StyledLI = styled(LI)`
  background: ${p => p.theme.whiteDark};
  margin: 0 -2px;
  border: 1px solid #e7e4eb;
  border-top: none;
`;
