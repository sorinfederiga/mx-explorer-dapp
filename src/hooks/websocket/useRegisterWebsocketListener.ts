import { useEffect } from 'react';

import { websocketConnection } from 'appConstants';
import {
  addWebsocketSubscription,
  hasWebsocketSubscription,
  removeWebsocketSubscription
} from 'helpers';
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

    const hasSubscription = hasWebsocketSubscription(
      websocketConnection.subscriptions,
      subscription
    );
    const hasPendingSubscription = hasWebsocketSubscription(
      websocketConnection.pendingSubscriptions,
      subscription
    );
    const hasActiveSubscription = hasWebsocketSubscription(
      websocketConnection.activeSubscriptions,
      subscription
    );

    if (!websocket || !websocket?.active || hasUrlParams) {
      return;
    }

    addWebsocketSubscription(websocketConnection.subscriptions, subscription);
    if (!hasActiveSubscription) {
      addWebsocketSubscription(
        websocketConnection.pendingSubscriptions,
        subscription
      );
    }

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
            websocketConnection.pendingSubscriptions,
            subscription
          );
        }
      });
    }

    if (hasActiveSubscription || hasPendingSubscription) {
      return;
    }

    websocket.on(event, (response: any) => {
      const hasPendingSubscription = hasWebsocketSubscription(
        websocketConnection.pendingSubscriptions,
        subscription
      );
      if (hasPendingSubscription) {
        removeWebsocketSubscription(
          websocketConnection.pendingSubscriptions,
          subscription
        );
        addWebsocketSubscription(
          websocketConnection.activeSubscriptions,
          subscription
        );
      }
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
  }, [websocketConnection, hasWebsocketUrl, event, subscription, hasUrlParams]);
}
