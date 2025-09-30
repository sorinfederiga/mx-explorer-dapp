import { WebsocketSubcriptionsEnum } from 'types';
import { hasWebsocketSubscription } from './hasWebsocketSubscription';

export const addWebsocketSubscription = (
  arr: WebsocketSubcriptionsEnum[],
  subscription: WebsocketSubcriptionsEnum
) => {
  if (!hasWebsocketSubscription(arr, subscription)) {
    arr.push(subscription);
  }
};
