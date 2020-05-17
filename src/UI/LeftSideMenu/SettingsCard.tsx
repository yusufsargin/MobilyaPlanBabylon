import React, { useState, useEffect } from "react";
import { Card, Button, Image, Input } from "semantic-ui-react";
import "./LeftSideMenu.css";

export interface ISelectedProduct {
  name: string;
  value?: number;
  isDeletable?: boolean;
  description?: string;
  setFunction?: any;
  genislik: number;
  derinlik: number;
  boy: number;
  duzenleVisible?: boolean;
}

export type SelectedProduct = {
  productAttribute?: ISelectedProduct;
  duzenleVisible?: boolean;
  setSelectedItemHandle?(value: ISelectedProduct): void;
};

export default function SettingsCard(props: SelectedProduct) {
  const products = props.productAttribute;

  function setItemValue(item: ISelectedProduct, type: string, value: number) {
    if (type.indexOf("genislik") !== -1) {
      item.genislik = value;
    }
    if (type.indexOf("boy") !== -1) {
      item.boy = value;
    }
    if (type.indexOf("derinlik") !== -1) {
      item.derinlik = value;
    }

    props.setSelectedItemHandle && props.setSelectedItemHandle(item);
  }

  return (
    <Card.Group className='containerScroll center-col'>
      {products && (
        <Card>
          <Card.Content>
            <Card.Header>{products.name}</Card.Header>
            <Card.Description>
              <p>{products.description}</p>
              <Input
                label={{ basic: true, content: "CM" }}
                labelPosition='right'
                type='text'
                placeholder={"Genislik -" + products.genislik}
                onChange={(e) => setItemValue(products, "genislik", parseInt(e.target.value.replace(/[^0-9]/g, "")))}
              />
              <Input
                label={{ basic: true, content: "CM" }}
                labelPosition='right'
                type='text'
                placeholder={"Boy -" + products.boy}
                onChange={(e) => setItemValue(products, "boy", parseInt(e.target.value.replace(/[^0-9]/g, "")))}
              />
              <Input
                label={{ basic: true, content: "CM" }}
                labelPosition='right'
                placeholder={"Derinlik -" + products.derinlik}
                onChange={(e) => setItemValue(products, "derinlik", parseInt(e.target.value.replace(/[^0-9]/g, "")))}
              />
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              {products.duzenleVisible === true ? <Button color='orange'>Düzenle</Button> : ""}
              <Button color='red'>Sil</Button>
            </div>
          </Card.Content>
        </Card>
      )}
    </Card.Group>
  );
}
