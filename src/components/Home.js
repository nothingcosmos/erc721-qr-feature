// @flow
import * as React from 'react';

import { Row } from 'reactstrap';

type Props = {
  children?: React.Node,
};

export default ({ children }: Props) => <Row>{children}</Row>;
