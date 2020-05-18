import React, { useState, useRef, useEffect } from "react";
import * as Babylon from "@babylonjs/core";
import "../App.css";
import HemisphericLight from "../Components/HemisphericLight";
import SarginDrawEngine from "../SarginDrawApi/SarginDrawEngine";

interface IMousePosition {
  x: number;
  y: number;
}

interface ITransformNodes {
  node: {
    name: string;
    transformNode: Babylon.TransformNode;
  };
}

interface ISelectedItem {
  mesh: Babylon.Mesh;
  transformNode: Babylon.TransformNode;
  position: Babylon.Vector3;
  name: string;
}

interface IMainScene {
  onSceneReady(scene: Babylon.Scene): void;
  onRender(scene: Babylon.Scene): void;
  AllElementsTrasnformNodesFirstWall?: Array<ITransformNodes>;
  AllElementsTrasnformNodesSecondWall?: Array<ITransformNodes>;
  cizim?: any;
  selectedItem?: ISelectedItem;
}

function MainScene(props: IMainScene) {
  const [canvasSizes, setCanvasSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const canvasElement = useRef<any>();
  //Yeni Component içerisine gönderileceği zaman state olmalı. Şuan Var kullanmamın sebebi main içerisinden componente göndermediğim için
  const [scene, setScene] = useState<Babylon.Scene>();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    function resizeWindow() {
      if (scene) {
        setCanvasSizes({ width: window.innerWidth, height: window.innerHeight });
        scene.getEngine().resize();
      }
    }

    window.addEventListener("resize", resizeWindow);
    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  }, [scene]);

  const createCamera = (scene: Babylon.Scene, canvas: HTMLCanvasElement, paddingSensibilty?: number) => {
    if (scene && canvas) {
      const COT = new Babylon.TransformNode("cameraRoot");
      const camera = new Babylon.ArcRotateCamera("Camera", 0, 0, 100, new Babylon.Vector3(0, 0, 0), scene);
      camera.parent = COT;
      // This targets the camera to scene origin
      camera.setPosition(new Babylon.Vector3(50, -100, -100));
      camera.setTarget(Babylon.Vector3.Zero());
      camera.panningSensibility = 50;
      camera.zoomOnFactor = 10;

      // This attaches the camera to the canvas
      camera.attachControl(canvas, true);
      //Camera Sensibility
    }
  };

  //---------------------------

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      const engine = new Babylon.Engine(canvasElement.current, true);
      const scene = new Babylon.Scene(engine);
      createCamera(scene, canvasElement.current);
      setScene(scene);

      if (scene.isReady()) {
        props.onSceneReady(scene);
      } else {
        scene.onReadyObservable.addOnce((scene) => {
          props.onSceneReady(scene);
        });
      }

      renderLoopElements(engine, scene);
    }
    return () => {
      scene?.dispose();
    };
  }, [canvasElement]);

  function renderLoopElements(engineScene: Babylon.Engine, sceneElement: Babylon.Scene) {
    if (engineScene && sceneElement) {
      engineScene.runRenderLoop(() => {
        sceneElement.render();
      });
    }
  }

  //   useEffect(() => {
  //     // if (scene && AllElementsTrasnformNodesFirstWall && canvasElement.current) {
  //     //   AllElementsTrasnformNodesFirstWall.map((item: ITransformNodes) => {
  //     //     const meshes: Array<Babylon.Mesh> | any = item.node.transformNode.getChildMeshes();
  //     //     meshes.map((mesh: Babylon.Mesh) => {
  //     //       scene.onAfterRenderObservable.add(() => {
  //     //         mesh.isPickable = true;
  //     //         mesh.actionManager = new Babylon.ActionManager(scene);
  //     //         mesh.actionManager.registerAction(
  //     //           new Babylon.ExecuteCodeAction(Babylon.ActionManager.OnPickTrigger, function (e) {
  //     //             const { x, y, z } = mesh.getAbsolutePosition();
  //     //             let dataDDD = {
  //     //               duzenleVisible: true,
  //     //               name: mesh.name,
  //     //               genislik: x,
  //     //               boy: y,
  //     //               derinlik: z,
  //     //             };
  //     //             console.log(dataDDD);
  //     //             debugger;
  //     //             setTestDATA(dataDDD);
  //     //           })
  //     //         );
  //     //       });
  //     //     });
  //     //   });
  //     // }
  //   }, [AllElementsTrasnformNodesFirstWall]);

  return (
    <div className='App'>
      <div>
        <canvas width={canvasSizes.width} height={canvasSizes.height} ref={canvasElement}></canvas>
      </div>
    </div>
  );
}

export default MainScene;
