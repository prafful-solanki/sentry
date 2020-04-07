type CrumbCategory =
  | 'started'
  | 'UIViewController'
  | 'touch'
  | 'message'
  | 'ui.click'
  | 'xhr'
  | 'console';

type CrumbLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

type CrumbTypeBase = {
  timestamp?: string; //it's recommended
  category?: CrumbCategory;
  message?: string;
  level?: CrumbLevel;
  event_id?: string;
};

type CrumbTypeNavigation = {
  type: 'navigation';
  data?: {
    to: string;
    from: string;
  };
} & CrumbTypeBase;

type CrumbTypeHTTP = {
  type: 'http';
  data?: {
    url?: string;
    method?:
      | 'POST'
      | 'PUT'
      | 'GET'
      | 'HEAD'
      | 'DELETE'
      | 'CONNECT'
      | 'OPTIONS'
      | 'TRACE'
      | 'PATCH';
    status_code?: number;
    reason?: string;
  };
} & CrumbTypeBase;

type CrumbTypeDefault = {
  type: 'error' | 'info' | 'debug' | 'message' | 'default' | 'user';
  data?: {[key: string]: any};
} & CrumbTypeBase;

export type Crumb = CrumbTypeNavigation | CrumbTypeHTTP | CrumbTypeDefault;
export type CrumbType = Crumb['type'];
