import React from 'react';
import styled from '@emotion/styled';

import EventDataSection from 'app/components/events/eventDataSection';
import GuideAnchor from 'app/components/assistant/guideAnchor';
import EmptyStateWarning from 'app/components/emptyStateWarning';
import {t} from 'app/locale';
import {SentryEventBase} from 'app/types';
import space from 'app/styles/space';

import {PlatformContextProvider} from './platformContext';
import BreadCrumbsSearch from './breadcrumbsSearch';
import Breadcrumb from './breadcrumb';
import BreadcrumbCollapsed from './breadcrumbCollapsed';
import {Crumb} from './types';

const MAX_CRUMBS_WHEN_COLLAPSED = 10;

type State = {
  isCollapsed: boolean;
  searchTerm: string;
  crumbs: Array<Crumb>;
  filteredCrumbs: Array<Crumb>;
};

type Props = {
  event: SentryEventBase;
  type: string;
  data: {
    values: Array<Crumb>;
  };
};

class BreadcrumbsContainer extends React.Component<Props, State> {
  state: State = {
    isCollapsed: true,
    searchTerm: '',
    crumbs: [],
    filteredCrumbs: [],
  };

  componentDidMount() {
    this.loadCrumbs();
  }

  loadCrumbs = () => {
    const {data} = this.props;
    let crumbs = data.values;

    // Add the error event as the final (virtual) breadcrumb
    const virtualCrumb = this.getVirtualCrumb();
    if (virtualCrumb) {
      crumbs = [...data.values, virtualCrumb];
    }

    this.setState({
      crumbs,
      filteredCrumbs: crumbs,
    });
  };

  moduleToCategory = (module: any) => {
    if (!module) {
      return undefined;
    }
    const match = module.match(/^.*\/(.*?)(:\d+)/);
    if (!match) {
      return module.split(/./)[0];
    }
    return match[1];
  };

  getVirtualCrumb = (): Crumb | undefined => {
    const {event} = this.props;

    const exception = event.entries.find(entry => entry.type === 'exception');

    if (!exception && !event.message) {
      return undefined;
    }

    if (exception) {
      const {type, value, module: mdl} = exception.data.values[0];
      return {
        type: 'error',
        level: 'error',
        category: this.moduleToCategory(mdl) || 'exception',
        data: {
          type,
          value,
        },
        timestamp: event.dateCreated,
      };
    }

    const levelTag = (event.tags || []).find(tag => tag.key === 'level');

    return {
      type: 'message',
      level: levelTag?.value as Crumb['level'],
      category: 'message',
      message: event.message,
      timestamp: event.dateCreated,
    };
  };

  getCollapsedCrumbQuantity = (): {
    filteredCollapsedCrumbs: Array<Crumb>;
    collapsedQuantity: number;
  } => {
    const {isCollapsed, filteredCrumbs} = this.state;

    let filteredCollapsedCrumbs = filteredCrumbs;

    if (isCollapsed && filteredCollapsedCrumbs.length > MAX_CRUMBS_WHEN_COLLAPSED) {
      filteredCollapsedCrumbs = filteredCollapsedCrumbs.slice(-MAX_CRUMBS_WHEN_COLLAPSED);
    }

    return {
      filteredCollapsedCrumbs,
      collapsedQuantity: filteredCrumbs.length - filteredCollapsedCrumbs.length,
    };
  };

  handleChangeSearchTerm = (searchTerm: string) => {
    const {crumbs} = this.state;

    const filteredCrumbs = crumbs.filter(
      item =>
        // return true if any of category, message, or level contain queryValue
        !!['category', 'message', 'level'].find(prop => {
          const propValue = (item[prop] || '').toLowerCase();
          return propValue.includes(searchTerm);
        })
    );

    this.setState({
      searchTerm,
      filteredCrumbs,
    });
  };

  handleCollapseToggle = () => {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  };

  handleCleanSearch = () => {
    this.setState({
      searchTerm: '',
      isCollapsed: true,
    });
  };

  render() {
    const {event, type} = this.props;
    const {searchTerm} = this.state;
    const {collapsedQuantity, filteredCollapsedCrumbs} = this.getCollapsedCrumbQuantity();

    return (
      <EventDataSection
        type={type}
        title={
          <h3>
            <GuideAnchor target="breadcrumbs" position="bottom">
              {t('Breadcrumbs')}
            </GuideAnchor>
          </h3>
        }
        actions={
          <BreadCrumbsSearch
            searchTerm={searchTerm}
            onChangeSearchTerm={this.handleChangeSearchTerm}
            onClearSearchTerm={this.handleCleanSearch}
          />
        }
        wrapTitle={false}
      >
        <Content>
          {filteredCollapsedCrumbs.length > 0 ? (
            <PlatformContextProvider value={{platform: event.platform}}>
              <BreadCrumbs className="crumbs">
                {collapsedQuantity > 0 && (
                  <BreadcrumbCollapsed
                    onClick={this.handleCollapseToggle}
                    quantity={collapsedQuantity}
                  />
                )}
                {filteredCollapsedCrumbs.map((item, idx) => (
                  <Breadcrumb key={idx} crumb={item} />
                ))}
              </BreadCrumbs>
            </PlatformContextProvider>
          ) : (
            <EmptyStateWarning small>
              {t('Sorry, no breadcrumbs match your search query.')}
            </EmptyStateWarning>
          )}
        </Content>
      </EventDataSection>
    );
  }
}

export default BreadcrumbsContainer;

const BreadCrumbs = styled('ul')`
  padding-left: 0;
  list-style: none;
  margin-bottom: 0;
`;

// TODO(style): color #e7eaef is not yet in theme
const Content = styled('div')`
  border: 1px solid #e7eaef;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  margin-bottom: ${space(3)};
`;
