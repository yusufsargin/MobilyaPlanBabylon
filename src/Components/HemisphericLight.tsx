import React, { useEffect } from "react";
import { IPosition } from "./CreateSceneElement";
import * as Babylon from "@babylonjs/core";

export type LightProp = {
  intensity: number;
  position: IPosition;
  scene: Babylon.Scene;
  lightName: string;
};

export default function HemisphericLight(props: LightProp) {
  const createHemisphericLight = (
    scene: Babylon.Scene,
    intensity: number,
    position: IPosition,
    lightName: string
  ) => {
    const light = new Babylon.HemisphericLight(
      lightName,
      new Babylon.Vector3(position.x, position.y, position.z),
      scene
    );

    light.intensity = intensity || 0;
  };

  useEffect(() => {
    const { intensity, scene, lightName, position } = props;

    createHemisphericLight(scene, intensity, position, lightName);
    return () => {
      props.scene.dispose();
    };
  }, []);

  return <></>;
}
