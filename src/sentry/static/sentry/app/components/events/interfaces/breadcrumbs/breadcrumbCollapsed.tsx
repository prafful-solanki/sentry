import React from 'react';
import styled from '@emotion/styled';

import space from 'app/styles/space';
import {tct} from 'app/locale';
import {IconEllipsis} from 'app/icons/iconEllipsis';

type Props = {
  onClick: () => void;
  quantity: number;
};

const BreadcrumbCollapsed = ({quantity, onClick}: Props) => (
  <Wrapper onClick={onClick}>
    <IconWrapper>
      <IconEllipsis />
    </IconWrapper>
    {tct('Show [quantity] collapsed crumbs', {quantity})}
  </Wrapper>
);

export default BreadcrumbCollapsed;

// TODO(style): color #e7e4eb is not yet in theme
const Wrapper = styled('li')`
  background: ${p => p.theme.whiteDark};
  padding: ${space(1)} ${space(3)} ${space(0.5)} ${space(3)} !important;
  position: relative;
  cursor: pointer;
  margin: 0 -2px;
  display: grid;
  grid-template-columns: 26px 1fr 50px;
  grid-gap: ${space(1.5)};
  font-size: ${p => p.theme.fontSizeMedium};
  border: 1px solid #e7e4eb;
  border-top: none;
  :before {
    display: block;
    content: '';
    width: 2px;
    top: 0;
    bottom: 0;
    left: 32px;
    background: #e7eaef;
    position: absolute;
  }
`;

// TODO(style): color#968ba0 is not yet in theme
const IconWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: ${p => p.theme.white};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  border-radius: 32px;
  z-index: 1;
  position: relative;
  color: inherit;
  border: 1px solid #968ba0;
`;
