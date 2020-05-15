import * as Babylon from "@babylonjs/core";
import React from "react";
import CreateCubeObject from "../Components/CreateCubeObject";

export interface ICizimChild {
  adi: "";
  boy: number;
  derinlik: number;
  en: number;
  x_1: number;
  y_1: number;
  z_1: number;
  marka: "";
  image: "";
  kalinlik: number;
  duvarNo: number;
  modulAdi: "";
  modulEn: number;
  modulDerinlik: number;
  modulX1: number;
  modulY1: number;
  modulZ1: number;
  modulYukseklik: number;
  tip: number;
  extra?: { cekmecekontrol?: false };
}

export type ICizim = {
  collection: any;
  scene: Babylon.Scene | any;
  collectionName: string;
  MainNodes?: Babylon.TransformNode | any;
  ChildNodes?: Babylon.TransformNode | any;
  SIZERATIO?: number;
  duvarFilter?: number;
};

export default function SarginDrawEngine(props: ICizim) {
  const { collection, SIZERATIO, MainNodes, duvarFilter } = props;
  const result = collection.map((item: ICizimChild, index: number) => {
    let location = { lx: 0, ly: 0, lz: 0 };
    if (item.duvarNo === 1) {
      location = { lx: 0, ly: 0, lz: Math.PI };
    }

    var position = {
      x: (item.x_1 + item.modulX1) * (SIZERATIO || 1),
      y: (item.y_1 + item.modulY1) * (SIZERATIO || 1),
      z: (item.z_1 + item.modulZ1) * (SIZERATIO || 1),
    };
    let en = 0;
    let boy = 0;
    let kalinlik = 0;

    if (item.tip === 2) {
      if ((item.extra || {}).cekmecekontrol || false) {
        en = item.boy;
        boy = item.kalinlik;
        kalinlik = item.en;
      } else {
        //sağ sol yan
        en = item.en;
        boy = item.kalinlik;
        kalinlik = item.boy;
      }
    } else if (item.tip === 3) {
      if ((item.extra || {}).cekmecekontrol || false) {
        en = item.boy;
        boy = item.en;
        kalinlik = item.kalinlik || 1.8;
      } else {
        //raf üst alt
        en = item.en;
        boy = item.boy;
        kalinlik = item.kalinlik || 1.8;
      }
    } else if (item.tip === 1 || item.tip === 4) {
      if (((item.extra || {}).cekmecekontrol || false) && item.adi.indexOf("kapak") === -1) {
        en = item.kalinlik;
        boy = item.boy;
        kalinlik = item.en;
      } else {
        //Kapak çizimi
        if (item.adi.indexOf("baza") !== -1 || item.adi.indexOf("arka kuşak") !== -1) {
          en = item.kalinlik;
          boy = item.boy;
          kalinlik = item.en;
        } else {
          en = item.kalinlik;
          boy = item.en;
          kalinlik = item.boy;
        }
      }
    }

    if (
      (item.duvarNo || 0) === (duvarFilter || 0) &&
      item.marka === "" &&
      item.adi.indexOf("raf") === -1 &&
      item.tip !== 0
    ) {
      return (
        <CreateCubeObject
          scene={props.scene}
          meshWidth={en}
          meshHeight={boy}
          meshDepth={kalinlik}
          meshName={item.adi}
          position={position}
          rotation={location}
          key={index + Math.random()}
          MainNodes={MainNodes}
        />
      );
    } else {
      return <></>;
    }
  });

  return <>{result}</>;
}
