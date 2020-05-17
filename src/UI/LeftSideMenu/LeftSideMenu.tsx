import React, { useState } from "react";
import "./LeftSideMenu.css";
import TextureTable, { ITableItem } from "./TextureTable";
import { Button, Divider } from "semantic-ui-react";
import SettingsCard, { ISelectedProduct } from "./SettingsCard";

interface ISelectedItemProp {
  name: string;
  genislik: number;
  boy: number;
  derinlik: number;
  duzenleVisible?: boolean;
}

export default function LeftSideMenu(props: any) {
  const [selectedItemProp, setSelectedItemProp] = useState<ISelectedProduct>(props.selectedItem);

  function setSelectedItemHandle(value: ISelectedItemProp) {
    setSelectedItemProp((state) => {
      let prev = state;

      prev = value;

      if (prev.boy > 0 && prev.genislik > 0 && prev.derinlik > 0) {
        prev.duzenleVisible = true;
      }

      return prev;
    });
  }

  const testTableItems: Array<ITableItem> = [
    {
      textureName: "Wood",
      textureSrc: "https://i.pinimg.com/originals/e9/ff/92/e9ff92cba52cdbab0415c67864dc3adc.jpg",
    },
  ];
  const [hoverMenu, setHoverMenu] = useState(true);

  return (
    <div className='container leftSideMenu'>
      <Button className='textBold' primary onClick={() => setHoverMenu(!hoverMenu)}>
        Control Menu
      </Button>{" "}
      <div id={hoverMenu ? "visible" : "invisible"}>
        <div className='header menu title'></div>
        <div className='texture itemsContainer hasBorder'>
          <Divider horizontal>Texture Menu</Divider>
          <div className='texture itemrow'>
            <TextureTable tableItems={testTableItems} />
          </div>
        </div>
        <div className='hasBorder'>
          <Divider horizontal>Seçilen Ürün Özellikleri</Divider>
          <div className='selectedItems'>
            <SettingsCard
              productAttribute={selectedItemProp}
              duzenleVisible={true}
              setSelectedItemHandle={setSelectedItemHandle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
