import * as Babylon from "@babylonjs/core";
import Texture from "../../assets/Texture/01.jpg";
export default function WoodMaterial(
  materialName: string,
  scene: Babylon.Scene | any,
  UV?: { col: number; row: number }
) {
  if (materialName.indexOf("default") !== -1) {
    var material = new Babylon.StandardMaterial(materialName, scene);
    material.diffuseTexture = new Babylon.Texture(Texture, scene);
    // new Babylon.Color3(0.05, 0.1, 0.05);
    //  || new Babylon.Texture(Texture, scene);
    var columns = UV?.col || 1; // 6 columns
    var rows = UV?.row || 1; // 4 rows

    var faceUV = new Array(6);

    for (var i = 0; i < 6; i++) {
      faceUV[i] = new Babylon.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
    }

    return { material: material, faceUV: faceUV };
  }
}
