import { useCallback, useState } from 'react';

import { PAGE_SIZE, websocketConnection } from 'appConstants';
import { removeWebsocketSubscription } from 'helpers';
import { useGetPage, useRegisterWebsocketListener } from 'hooks';
import {
  ApiAdapterResponseType,
  WebsocketEventsEnum,
  WebsocketSubcriptionsEnum
} from 'types';

export interface FetchApiDataProps {
  onApiData: (response: any) => void;
  dataPromise: (params?: any) => Promise<ApiAdapterResponseType>;
  dataCountPromise?: (params?: any) => Promise<ApiAdapterResponseType>;
  onWebsocketData?: (response: any) => void;
  filters?: Record<string, any>;
  subscription?: WebsocketSubcriptionsEnum;
  event?: WebsocketEventsEnum;
  config?: Record<string, any>;
  urlParams?: Record<string, any>;
  isActiveWebsocket?: boolean;
}

export const useFetchApiData = ({
  dataPromise,
  dataCountPromise,
  onWebsocketData,
  onApiData,
  filters = {},
  subscription,
  event,
  config = {},
  urlParams = {}
}: FetchApiDataProps) => {
  const { page, size } = useGetPage();
  const [dataChanged, setDataChanged] = useState(false);

  let isCalled = false;

  const hasUrlParams =
    Object.keys(urlParams).length > 0 || page !== 1 || size !== PAGE_SIZE;

  const isActiveWebsocketSubscription =
    subscription &&
    websocketConnection.activeSubscriptions.includes(subscription);

  const onWebsocketEvent = useCallback(
    (event: any[]) => {
      if (hasUrlParams || !onWebsocketData) {
        return;
      }

      onWebsocketData(event);
    },
    [urlParams, onWebsocketData]
  );

  useRegisterWebsocketListener({
    subscription,
    event,
    config: { from: 0, size: PAGE_SIZE, ...config },
    onEvent: onWebsocketEvent,
    hasUrlParams
  });

  const fetchData = useCallback(
    (paramsChange = false) => {
      if (isCalled) {
        return;
      }

      if (isActiveWebsocketSubscription && hasUrlParams) {
        websocketConnection?.instance?.off(event);
        removeWebsocketSubscription(
          websocketConnection.activeSubscriptions,
          subscription
        );
      }

      if (
        subscription &&
        websocketConnection.activeSubscriptions.includes(subscription) &&
        !paramsChange
      ) {
        return;
      }

      isCalled = true;

      if (hasUrlParams && paramsChange) {
        setDataChanged(true);
      }

      const promises = [
        dataPromise({
          ...filters
        }),
        ...(dataCountPromise ? [dataCountPromise({ ...filters })] : [])
      ];

      Promise.all(promises)
        .then(onApiData)
        .finally(() => {
          if (paramsChange) {
            isCalled = false;
            setDataChanged(false);
          }
        });
    },
    [
      websocketConnection,
      subscription,
      hasUrlParams,
      isActiveWebsocketSubscription,
      isCalled,
      onApiData
    ]
  );

  return {
    fetchData,
    dataChanged
  };
};
