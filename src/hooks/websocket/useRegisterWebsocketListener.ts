import { useEffect } from 'react';

import { websocketConnection } from 'appConstants';
import { addWebsocketSubscription, removeWebsocketSubscription } from 'helpers';
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

    const subscriptionIndex =
      websocketConnection.subscriptions.indexOf(subscription);
    const activeSubscriptionIndex =
      websocketConnection.activeSubscriptions.indexOf(subscription);
    const hasSubscription = subscriptionIndex !== -1;
    const hasActiveSubscription = activeSubscriptionIndex !== -1;

    if (!websocket || !websocket?.active || hasUrlParams) {
      return;
    }

    addWebsocketSubscription(websocketConnection.subscriptions, subscription);
    addWebsocketSubscription(
      websocketConnection.activeSubscriptions,
      subscription
    );

    if (!hasSubscription) {
      websocket.emit(subscription, websocketConfig, (response: any) => {
        console.info(
          `Websocket New Subscription ${subscription} with options`,
          websocketConfig,
          response
        );
        if (response?.status !== 'success') {
          removeWebsocketSubscription(
            websocketConnection.subscriptions,
            subscription
          );
          removeWebsocketSubscription(
            websocketConnection.activeSubscriptions,
            subscription
          );
        }
      });
    }

    if (hasActiveSubscription) {
      return;
    }

    websocket.on(event, (response: any) => {
      console.info(`Client ${event}:`, response);
      onEvent(response);
    });

    return () => {
      websocket?.off(event);
      removeWebsocketSubscription(
        websocketConnection.activeSubscriptions,
        subscription
      );
    };
  }, [
    websocketConnection,
    hasWebsocketUrl,
    event,
    subscription,
    onEvent,
    hasUrlParams
  ]);
}
