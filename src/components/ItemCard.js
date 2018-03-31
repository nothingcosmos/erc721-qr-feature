import React from 'react';
import {
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  CardLink,
  CardImg,
} from 'reactstrap';

type Props = {
  name: string,
  address: string,
  description: string,
  createdAt: string,
  image: string,
  onClick: () => void,
};

export default (props: Props) => (
  <Col lg={{ size: 4 }} md={{ size: 6 }} className="pb-3">
    <Card>
      <CardImg top src={props.image} />
      <CardBody>
        <CardTitle>{props.name}</CardTitle>
        <CardSubtitle>{props.address}</CardSubtitle>
        <CardText>{props.description}</CardText>
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
