import React, { useEffect } from "react";
import { CreateElementProps, IPosition } from "./CreateSceneElement";
import * as Babylon from "@babylonjs/core";
import WoodMaterial from "./Materials/Wood";

export default function CreateCubeObject(props: CreateElementProps) {
  const createBox = (
    scene: Babylon.Scene,
    width: number,
    height: number,
    depth: number,
    modulAdi: string,
    position: IPosition,
    UV?: { col: number; row: number },
    rotation?: { lx: number; ly: number; lz: number },
    MainNodes?: Babylon.TransformNode | any
  ) => {
    const lastObjPosition = new Babylon.Vector3(width / 2, height / 2, depth / 2);
    const lastPosition = new Babylon.Vector3(
      lastObjPosition.x + position.z,
      lastObjPosition.y + position.x,
      lastObjPosition.z + position.y
    );
    var material = WoodMaterial("default", scene, UV);

    const box = new (Babylon.MeshBuilder.CreateBox as any)(
      modulAdi,
      {
        width: width,
        height: height,
        depth: depth,
        faceUV: material?.faceUV,
      },
      scene
    );
    box.material = material?.material;
    box.position = lastPosition;
    box.rotation = new Babylon.Vector3(rotation?.lx, rotation?.ly, rotation?.lz);
    box.parent = MainNodes;
  };

  useEffect(() => {
    const { scene, meshWidth, meshHeight, meshDepth, meshName, position, UV, rotation, MainNodes } = props;

    createBox(scene, meshWidth, meshHeight || 1, meshDepth || 1, meshName, position, UV, rotation, MainNodes);

    return () => {
      scene.dispose();
    };
  }, []);
  return <></>;
}
