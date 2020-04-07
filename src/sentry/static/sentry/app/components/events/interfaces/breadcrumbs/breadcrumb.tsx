import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

import HttpRenderer from 'app/components/events/interfaces/breadcrumbs/httpRenderer';
import ErrorRenderer from 'app/components/events/interfaces/breadcrumbs/errorRenderer';
import DefaultRenderer from 'app/components/events/interfaces/breadcrumbs/defaultRenderer';
import {IconInfo} from 'app/icons/iconInfo';
import {IconWarning} from 'app/icons/iconWarning';
import {IconLocation} from 'app/icons/iconLocation';
import {IconUser} from 'app/icons/iconUser';
import {IconRefresh} from 'app/icons/iconRefresh';
import {Color} from 'app/utils/theme';
import space from 'app/styles/space';

import BreadcrumbTime from './breadcrumbTime';
import {Crumb, CrumbType} from './types';

type Props = {
  crumb: Crumb;
};

const BreadCrumbContent = ({crumb: {type = 'default', ...rest}}: Props) => {
  const crumb = {type, ...rest} as Crumb;

  const getCrumbType = (): CrumbType => {
    // special case for 'ui.' and `sentry.` category breadcrumbs
    // TODO: find a better way to customize UI around non-schema data
    if (crumb.type === 'default' && crumb.category) {
      const [category, subcategory] = crumb.category.split('.');
      if (category === 'ui') {
        return 'user';
      }

      if (category === 'console' || category === 'navigation') {
        return 'debug';
      }

      if (
        category === 'sentry' &&
        (subcategory === 'transaction' || subcategory === 'event')
      ) {
        return 'error';
      }
    }

    return crumb.type;
  };

  switch (getCrumbType()) {
    case 'user': {
      return (
        <Wrapper>
          <IconWrapper color="purple">
            <IconUser />
          </IconWrapper>
          <DefaultRenderer crumb={crumb} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </Wrapper>
      );
    }
    case 'navigation': {
      return (
        <Wrapper>
          <IconWrapper color="blue">
            <IconLocation />
          </IconWrapper>
          <DefaultRenderer crumb={crumb} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </Wrapper>
      );
    }
    case 'debug': {
      return (
        <Wrapper>
          <IconWrapper>
            <span className="icon-console" />
          </IconWrapper>
          <DefaultRenderer crumb={crumb} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </Wrapper>
      );
    }
    case 'info': {
      return (
        <Wrapper>
          <IconWrapper color="blue">
            <IconInfo />
          </IconWrapper>
          <DefaultRenderer crumb={crumb} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </Wrapper>
      );
    }
    case 'message':
    case 'error': {
      return (
        <Wrapper error>
          <IconWrapper color="red">
            {
              // TODO(style): add warning solid option
            }
            <IconWarning />
          </IconWrapper>
          <ErrorRenderer crumb={crumb} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </Wrapper>
      );
    }
    case 'http': {
      return (
        <Wrapper>
          <IconWrapper color="green">
            <IconRefresh />
          </IconWrapper>
          <HttpRenderer crumb={crumb} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </Wrapper>
      );
    }
    default:
      return null;
  }
};

export default BreadCrumbContent;

// TODO(style): color #e7eaef and #e7c0bc are not yet in theme
const Wrapper = styled('li')<{error?: boolean}>`
  position: relative;
  padding: ${space(1)} ${space(3)} ${space(0.5)} ${space(3)} !important;
  margin: 0 -1px;
  display: grid;
  grid-template-columns: 26px 1fr 50px;
  grid-gap: ${space(1.5)};
  :before {
    content: '';
    display: block;
    width: 2px;
    top: 0;
    bottom: 0;
    left: 32px;
    background: #e7eaef;
    position: absolute;
  }
  border-bottom: 1px solid #e7e4eb;
  ${p =>
    p.error &&
    css`
      background: #fffcfb;
      border: 1px solid #e7c0bc;
      margin: -2px;
    `}
`;

// TODO(style): color #968ba0 is not yet in theme
const IconWrapper = styled('div')<{color?: Color}>`
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
  color: ${p => (p.color ? p.theme[p.color] : 'inherit')};
  border: 1px solid ${p => (p.color ? p.theme[p.color] : '#968ba0')};
`;
