import { ReactNode } from 'react';
import classNames from 'classnames';

import { WithClassnameType } from 'types';

export interface PreviewPanelCardUIType extends WithClassnameType {
  title?: ReactNode;
  children?: ReactNode;
  featured?: boolean;
}

export const PreviewPanelCard = ({
  title,
  children,
  featured,
  className
}: PreviewPanelCardUIType) => {
  if (!(title || children)) {
    return null;
  }

  return (
    <div
      className={classNames('preview-panel-card', className, {
        featured: featured
      })}
    >
      {title && <dt>{title}</dt>}
      {children && <dd>{children}</dd>}
    </div>
  );
};
