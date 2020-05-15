import React, { useEffect } from "react";
import * as Babylon from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

export interface IPosition {
  x: number;
  y: number;
  z: number;
}

export type CreateElementProps = {
  meshName: string;
  meshType?: string;
  meshWidth: number;
  meshHeight?: number;
  meshDepth?: number;
  scene: Babylon.Scene;
  material?: Babylon.Material;
  position: IPosition;
  UV?: { col: number; row: number };
  parentTransformNode?: Babylon.TransformNode | any;
  rotation?: { lx: number; ly: number; lz: number };
  MainNodes?: Babylon.TransformNode | any;
};

export default function CreateSceneElement(props: CreateElementProps) {
  useEffect(() => {
    const { scene, meshType, meshWidth, meshName, position } = props;

    if (meshType?.indexOf("sphere") !== -1 && (meshName || "") !== "") {
      var light = new Babylon.HemisphericLight("light1", new Babylon.Vector3(0, 1, 0), scene);

      // Default intensity is 1. Let's dim the light a small amount
      light.intensity = 0.7;
      var material = new GridMaterial("grid", scene);
      var myMaterial = new Babylon.StandardMaterial("myMaterial", scene);

      myMaterial.diffuseColor = new Babylon.Color3(1, 0, 1);
      myMaterial.specularColor = new Babylon.Color3(0.5, 0.6, 0.87);
      myMaterial.emissiveColor = new Babylon.Color3(1, 1, 1);
      myMaterial.ambientColor = new Babylon.Color3(0.23, 0.98, 0.53);
      myMaterial.alpha = 0.5;

      var sphere = Babylon.Mesh.CreateSphere(meshName, 16, meshWidth, scene);

      sphere.position.y = position.y;
      sphere.material = material;

      var ground = Babylon.Mesh.CreateGround("ground1", 6, 6, 2, scene);

      // Affect a material
      ground.material = myMaterial;
    }
  }, []);

  return <></>;
}
