import { useEffect } from 'react';

import {
  websocketConnection,
  websocketActiveSubscriptions,
  websocketPendingSubscriptions,
  websocketSubscriptions,
  WebsocketConnectionStatusEnum
} from 'appConstants';
import { useInitWebsocket } from 'hooks/layout';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';
import { useHasWebsocketUrl } from './useHasWebsocketUrl';

export interface RegisterWebsocketListenerType {
  onEvent: (response: any) => void;
  subscription?: WebsocketSubcriptionsEnum;
  event?: WebsocketEventsEnum;
  config?: Record<string, any>;
  hasUrlParams?: boolean;
}

export function useRegisterWebsocketListener({
  subscription,
  event,
  config,
  onEvent,
  hasUrlParams
}: RegisterWebsocketListenerType) {
  const hasWebsocketUrl = useHasWebsocketUrl();

  useInitWebsocket();

  useEffect(() => {
    const websocketConfig = config ?? true;
    if (!subscription || !event) {
      return;
    }

    const websocket = websocketConnection.instance;

    const hasSubscription = websocketSubscriptions.has(subscription);
    const hasPendingSubscription =
      websocketPendingSubscriptions.has(subscription);
    const hasActiveSubscription =
      websocketActiveSubscriptions.has(subscription);

    if (
      !websocket ||
      !websocket?.active ||
      hasUrlParams ||
      websocketConnection.status !== WebsocketConnectionStatusEnum.COMPLETED
    ) {
      return;
    }

    websocketSubscriptions.add(subscription);

    if (!hasActiveSubscription) {
      websocketPendingSubscriptions.add(subscription);
    }

    if (!hasSubscription) {
      websocket.emit(subscription, websocketConfig, (response: any) => {
        console.info(
          `Websocket New Subscription ${subscription} with options`,
          websocketConfig,
          response
        );
        if (response?.status !== 'success') {
          websocketSubscriptions.delete(subscription);
          websocketPendingSubscriptions.delete(subscription);
        }
      });
    }

    if (hasActiveSubscription || hasPendingSubscription) {
      return;
    }

    websocket.on(event, (response: any) => {
      if (websocketPendingSubscriptions.has(subscription)) {
        websocketPendingSubscriptions.delete(subscription);
        websocketActiveSubscriptions.add(subscription);
      }
      console.info(`Client ${event}:`, response);
      onEvent(response);
    });

    return () => {
      websocket?.off(event);
      websocketActiveSubscriptions.delete(subscription);
    };
  }, [
    websocketConnection,
    websocketSubscriptions,
    websocketActiveSubscriptions,
    websocketPendingSubscriptions,
    websocketConnection.status,
    hasWebsocketUrl,
    event,
    subscription,
    hasUrlParams
  ]);
}
