import React, {Children, Fragment} from 'react';
import Box from '../Box';
import type {BoxProps} from '../Box';
import type {Theme} from '../../theme';

export interface GroupProps extends BoxProps {
  /** 子元素间距，对应 theme.spacing 的键 */
  spacing?: keyof Theme['spacing'];
  /** 排列方向，默认 row */
  direction?: 'row' | 'column';
}

/**
 * 分组容器
 * 子元素之间自动添加间距，默认水平排列
 */
function Group({
  spacing = 's',
  direction = 'row',
  children,
  ...rest
}: GroupProps) {
  const isRow = direction === 'row';
  const validChildren = Children.toArray(children).filter(Boolean);

  return (
    <Box
      flexDirection={direction}
      alignItems={isRow ? 'center' : undefined}
      {...rest}>
      {validChildren.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <Box
              marginLeft={isRow ? spacing : undefined}
              marginTop={!isRow ? spacing : undefined}
            />
          )}
          {child}
        </Fragment>
      ))}
    </Box>
  );
}

export default Group;
