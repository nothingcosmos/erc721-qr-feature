// @flow
import React from 'react';
import {
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
  CardImg,
} from 'reactstrap';

type Props = {
  name: string,
  createdAt: string,
  image: string,
  onClick: () => void,
};

export default (props: Props) => (
  <Col lg={{ size: 4 }} md={{ size: 6 }} className="pb-3">
    <Card>
      <CardImg
        top
        src={props.image}
        onClick={() => props.onClick()}
        style={{ cursor: 'pointer' }}
      />
      <CardBody>
        <CardTitle>{props.name}</CardTitle>
        <CardText>
          <small className="text-muted">{props.createdAt}</small>
        </CardText>
        <CardLink
          onClick={e => {
            e.preventDefault();
            props.onClick();
          }}
          href="#"
        >
          detail
        </CardLink>
      </CardBody>
    </Card>
  </Col>
);
