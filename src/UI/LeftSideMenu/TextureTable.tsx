import React, { useState } from "react";
import "./LeftSideMenu.css";
import { Table, Label } from "semantic-ui-react";

export interface ITableItem {
  textureName: string;
  textureSrc?: string;
}

export type TextureTable = {
  tableItems: Array<ITableItem>;
};

export default function TextureTable(props: TextureTable) {
  const [tableItems, settableItems] = useState<Array<ITableItem>>(props.tableItems);
  const imageSize = 60;

  return (
    <div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>TextureName</Table.HeaderCell>
            <Table.HeaderCell>Texture</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tableItems?.map((item: ITableItem, index) => {
            return (
              <>
                <Table.Row>
                  <Table.Cell>
                    <Label ribbon>{item.textureName}</Label>
                  </Table.Cell>
                  <Table.Cell>
                    <img width={imageSize} src={item.textureSrc} alt={item.textureName} />
                  </Table.Cell>
                </Table.Row>
              </>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
