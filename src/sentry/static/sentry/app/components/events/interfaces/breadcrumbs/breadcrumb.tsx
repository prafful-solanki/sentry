import React from 'react';

import HttpRenderer from 'app/components/events/interfaces/breadcrumbs/httpRenderer';
import ErrorRenderer from 'app/components/events/interfaces/breadcrumbs/errorRenderer';
import DefaultRenderer from 'app/components/events/interfaces/breadcrumbs/defaultRenderer';
import {IconInfo} from 'app/icons/iconInfo';
import {IconWarning} from 'app/icons/iconWarning';
import {IconLocation} from 'app/icons/iconLocation';
import {IconUser} from 'app/icons/iconUser';
import {IconRefresh} from 'app/icons/iconRefresh';

import BreadcrumbTime from './breadcrumbTime';
import {
  Crumb,
  CrumbType,
  CrumbTypeHTTP,
  CrumbTypeNavigation,
  CrumbTypeDefault,
} from './types';
import {LI, IconWrapper} from './styles';

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
        <LI>
          <IconWrapper color="purple">
            <IconUser />
          </IconWrapper>
          <DefaultRenderer crumb={crumb as CrumbTypeDefault} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </LI>
      );
    }
    case 'navigation': {
      return (
        <LI>
          <IconWrapper color="blue">
            <IconLocation />
          </IconWrapper>
          <DefaultRenderer crumb={crumb as CrumbTypeNavigation} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </LI>
      );
    }
    case 'debug': {
      return (
        <LI>
          <IconWrapper>
            <span className="icon-console" />
          </IconWrapper>
          <DefaultRenderer crumb={crumb as CrumbTypeDefault} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </LI>
      );
    }
    case 'info': {
      return (
        <LI>
          <IconWrapper color="blue">
            <IconInfo />
          </IconWrapper>
          <DefaultRenderer crumb={crumb as CrumbTypeDefault} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </LI>
      );
    }
    case 'message':
    case 'error': {
      return (
        <LI error>
          <IconWrapper color="red">
            {
              // TODO(style): add warning solid option
            }
            <IconWarning />
          </IconWrapper>
          <ErrorRenderer crumb={crumb as CrumbTypeDefault} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </LI>
      );
    }
    case 'http': {
      return (
        <LI>
          <IconWrapper color="green">
            <IconRefresh />
          </IconWrapper>
          <HttpRenderer crumb={crumb as CrumbTypeHTTP} />
          <BreadcrumbTime timestamp={crumb.timestamp} />
        </LI>
      );
    }
    default:
      return null;
  }
};

export default BreadCrumbContent;
