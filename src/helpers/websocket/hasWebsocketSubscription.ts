import { WebsocketSubcriptionsEnum } from 'types';

export const hasWebsocketSubscription = (
  arr: WebsocketSubcriptionsEnum[],
  subscription: WebsocketSubcriptionsEnum
) => {
  return arr.indexOf(subscription) !== -1;
};
