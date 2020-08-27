import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

import Tooltip from '../Tooltip';

export const Input = styled(TextField)`
  background: #f1f1f1;
  border-radius: 10px;
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  position: absolute;
  top: 37px;
  right: 20px;
  z-index: 2;

  svg {
    margin-right: 0px;
  }
  span {
    background: #c53030;
    color: #fff;
    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
