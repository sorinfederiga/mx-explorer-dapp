import { ReactNode, useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import { Loader } from 'components';
import { WithClassnameType, ApiAdapterResponseType } from 'types';

export interface PreviewPanelWrapperUIType extends WithClassnameType {
  preview: ReactNode;
  children: ReactNode;
  fetchData: () => Promise<ApiAdapterResponseType>;
  onApiData: (response: any) => void;
  cachedPreviews: Record<string, any>;
  hash: string;
}

export const PreviewPanelWrapper = ({
  preview,
  children,
  fetchData,
  onApiData,
  cachedPreviews = {},
  hash = ''
}: PreviewPanelWrapperUIType) => {
  const [show, setShow] = useState(false);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [previewDetails, setPreviewDetails] = useState<any | undefined>();

  const fetchDetails = () => {
    if (!hash) {
      return;
    }

    if (cachedPreviews?.[hash]) {
      setPreviewDetails(cachedPreviews[hash]);
      setDataReady(true);
      return;
    }

    fetchData().then(({ data, success }) => {
      if (!data || !success) {
        return;
      }

      onApiData(data);
      setPreviewDetails(data);
      setDataReady(data && success);
    });
  };

  const handleOnMouseEnter = () => {
    setShow(true);
  };
  const handleOnMouseLeave = () => {
    setShow(false);
  };

  return (
    <OverlayTrigger
      key='popover'
      trigger={['click', 'hover']}
      placement='top'
      delay={{ show: 100, hide: 400 }}
      rootClose
      onToggle={(show) => {
        if (!show) {
          return;
        }

        fetchDetails();
      }}
      show={show}
      overlay={
        <Popover
          id='popover-positioned-bottom'
          className='preview-panel-wrapper'
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        >
          {dataReady && previewDetails ? (
            <>{preview}</>
          ) : (
            <Loader className='px-5' />
          )}
        </Popover>
      }
    >
      <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
        {children}
      </div>
    </OverlayTrigger>
  );
};
