import React, { useState, useEffect } from "react";
import { Card, Button, Image, Input } from "semantic-ui-react";
import "./LeftSideMenu.css";

export interface ISelectedProduct {
  name: string;
  value: number;
  isDeletable?: boolean;
  description: string;
  setFunction?: any;
  genislik?: number;
  derinlik?: number;
  boy?: number;
}

export type SelectedProduct = {
  productAttribute?: Array<ISelectedProduct>;
};

export default function SettingsCard(props: SelectedProduct) {
  const [inputVal, setInputVal] = useState({
    genislik: 0,
    boy: 0,
    derinlik: 0,
  });

  const products = props.productAttribute;

  function setItemValue(item: ISelectedProduct, type: string, value: number) {
    if (type.indexOf("genislik") !== -1) {
      item.genislik = value;
      setInputVal((state) => {
        let prev = state;

        state.genislik = value;

        return prev;
      });
    }
    if (type.indexOf("boy") !== -1) {
      item.boy = value;
      setInputVal((state) => {
        let prev = state;

        state.boy = value;

        return prev;
      });
    }
    if (type.indexOf("deinlik") !== -1) {
      item.derinlik = value;
      setInputVal((state) => {
        let prev = state;

        state.derinlik = value;

        return prev;
      });
    }
  }

  return (
    <Card.Group className='containerScroll center-col'>
      {products &&
        products.map((item: ISelectedProduct) => {
          return (
            <Card>
              <Card.Content>
                <Card.Header>{item.name}</Card.Header>
                <Card.Description>
                  <p>{item.description}</p>
                  <Input
                    label={{ basic: true, content: "CM" }}
                    labelPosition='right'
                    type='text'
                    placeholder={"Genislik"}
                    value={item.genislik || inputVal.genislik}
                    onChange={(e) => setItemValue(item, "genislik", parseInt(e.target.value.replace(/[^0-9]/g, "")))}
                  />
                  <Input
                    label={{ basic: true, content: "CM" }}
                    labelPosition='right'
                    type='text'
                    placeholder={"Boy"}
                    value={item.boy || inputVal.boy}
                    onChange={(e) => setItemValue(item, "boy", parseInt(e.target.value.replace(/[^0-9]/g, "")))}
                  />
                  <Input
                    label={{ basic: true, content: "CM" }}
                    labelPosition='right'
                    type='text'
                    placeholder={"Derinlik"}
                    value={item.derinlik || inputVal.derinlik}
                    onChange={(e) => setItemValue(item, "derinlik", parseInt(e.target.value.replace(/[^0-9]/g, "")))}
                  />
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button color='red'>Sil</Button>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      <Card>
        <Card.Content>
          <Card.Header>Sol Yan</Card.Header>
          <Card.Description>
            <p>Değiştirmek için değer giriniz</p>
            <Input label={{ basic: true, content: "CM" }} labelPosition='right' type='text' placeholder='Username' />
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            <Button color='red'>Sil</Button>
          </div>
        </Card.Content>
      </Card>
    </Card.Group>
  );
}
