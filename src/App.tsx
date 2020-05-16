import React, { useState, useRef, useEffect, lazy } from "react";
import * as Babylon from "@babylonjs/core";
import "./App.css";
import HemisphericLight from "./Components/HemisphericLight";
import CreateCubeObject from "./Components/CreateCubeObject";
import DataParser from "./SarginDrawApi/DataParser";
import TESTDATA from "./testJsonData/test.json";
import SarginDrawEngine, { ICizimChild } from "./SarginDrawApi/SarginDrawEngine";
import LeftSideMenu from "./UI/LeftSideMenu/LeftSideMenu";

interface IMousePosition {
  x: number;
  y: number;
}

interface IWallObject {
  transformNode: Babylon.TransformNode;
}

function App() {
  const [canvasSizes, setCanvasSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mousePositions, setMousePositions] = useState<IMousePosition | any>();
  const [MaintransformNodesFirstWall, setMaintransformNodesFirstWall] = useState<Array<Babylon.TransformNode | any>>();
  const [MaintransformNodesSecondWall, setMaintransformNodesSecondWall] = useState<
    Array<Babylon.TransformNode | any>
  >();
  const [lastPosition, setLastPosition] = useState<Babylon.Vector3>();
  const [cizim, setCizim] = useState<any>();
  const canvasElement = useRef<any>();
  //Yeni Component içerisine gönderileceği zaman state olmalı. Şuan Var kullanmamın sebebi main içerisinden componente göndermediğim için
  const [scene, setScene] = useState<Babylon.Scene>();
  const [loaded, setLoaded] = useState<boolean>(false);

  function setMousePostionsWithEvent(e: EventListenerOrEventListenerObject | any) {
    setMousePositions({ x: e.clientX, y: e.clientY });
  }
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

  useEffect(() => {
    if (MaintransformNodesFirstWall) {
      MaintransformNodesFirstWall.map((item: any) => {
        const transformNode: Babylon.TransformNode | any = Object.values(item)[0];

        transformNode.rotation.x = Math.PI / 2;
        transformNode.rotation.y = Math.PI / 2;
        transformNode.position.y = 100;
        transformNode.position.x = -50;
      });
    }
  }, [MaintransformNodesFirstWall]);

  function findMaxPointScene(elements: Array<IWallObject>) {
    let maxPoints = { x: 0, y: 0, z: 0 };

    elements.map((item: IWallObject) => {
      const transformNode: Babylon.TransformNode | any = Object.values(item)[0];
      const maxPointTrasnformNodes = findMaxPointElement(transformNode.getChildren());

      if (maxPointTrasnformNodes.x > maxPoints.x) {
        maxPoints.x = maxPointTrasnformNodes.x;
      }
      if (maxPointTrasnformNodes.y > maxPoints.y) {
        maxPoints.y = maxPointTrasnformNodes.y;
      }
      if (maxPointTrasnformNodes.z > maxPoints.z) {
        maxPoints.z = maxPointTrasnformNodes.z;
      }
    });

    return maxPoints;
  }
  function findMinPointScene(elements: Array<IWallObject>) {
    let maxPoints = { x: 0, y: 0, z: 0 };

    elements.map((item: IWallObject) => {
      const transformNode: Babylon.TransformNode | any = Object.values(item)[0];
      const minPointTransformNode = findMinPointElement(transformNode.getChildren());

      if (minPointTransformNode.x < maxPoints.x) {
        maxPoints.x = minPointTransformNode.x;
      }
      if (minPointTransformNode.y < maxPoints.y) {
        maxPoints.y = minPointTransformNode.y;
      }
      if (minPointTransformNode.z < maxPoints.z) {
        console.log("TEST: " + minPointTransformNode.z);
        maxPoints.z = minPointTransformNode.z;
      }
    });

    return maxPoints;
  }

  function moveTrasnformNodeExactPosition(
    transformNodes: Array<IWallObject>,
    whichAxis = "XYZ",
    position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
  ) {
    transformNodes.map((item: IWallObject) => {
      const { x, y, z } = position;
      const transformNode: Babylon.TransformNode = Object.values(item)[0];
      if (whichAxis.indexOf("X") !== -1) {
        transformNode.position.x = x;
      }
      if (whichAxis.indexOf("Y") !== -1) {
        transformNode.position.y = y;
      }
      if (whichAxis.indexOf("Z") !== -1) {
        transformNode.position.z = z;
      }
    });
  }

  function findMaxPointElement(mesh: Array<Babylon.Mesh>) {
    let maxPoints = {
      x: 0,
      y: 0,
      z: 0,
    };

    mesh.map((item: Babylon.Mesh) => {
      const { x, y, z } = item.getAbsolutePosition();

      if (x > maxPoints.x) {
        maxPoints.x = x;
      }

      if (y > maxPoints.y) {
        maxPoints.y = y;
      }

      if (z > maxPoints.z) {
        maxPoints.z = z;
      }
    });
    return maxPoints;
  }

  function findMinPointElement(mesh: Array<Babylon.Mesh>) {
    let minPoints = {
      x: 0,
      y: 0,
      z: 0,
    };

    mesh.map((item: Babylon.Mesh) => {
      const { x, y, z } = item.getAbsolutePosition();

      if (x < minPoints.x) {
        minPoints.x = x;
      }

      if (y < minPoints.y) {
        minPoints.y = y;
      }

      if (z < minPoints.z) {
        minPoints.z = z;
      }
    });

    return minPoints;
  }

  function moveTransformNodes() {}

  function createFloor() {
    if (MaintransformNodesFirstWall && MaintransformNodesSecondWall) {
      const maxPointsSecond = findMaxPointScene(MaintransformNodesSecondWall);
      const maxPointsFirst = findMaxPointScene(MaintransformNodesFirstWall);
      const minPointFirstWall = findMinPointScene(MaintransformNodesFirstWall);
      const minPointSecondWall = findMinPointScene(MaintransformNodesSecondWall);

      console.log(maxPointsSecond);
      const movePointSecond = {
        x: maxPointsSecond.x - minPointSecondWall.x,
        y: maxPointsSecond.y - minPointSecondWall.y,
        z: maxPointsSecond.z - minPointSecondWall.z,
      };
      const movePointFirst = {
        x: maxPointsFirst.x - minPointFirstWall.x,
        y: maxPointsFirst.y - minPointFirstWall.y,
        z: -(maxPointsFirst.z - minPointFirstWall.z),
      };
      console.log(movePointFirst, movePointSecond);
      //2. duvarı -> birinci duvarın son noktasına taşı
      moveTrasnformNodeExactPosition(MaintransformNodesFirstWall, "Z", movePointSecond);
      //moveTrasnformNodeExactPosition(MaintransformNodesSecondWall, "Z", movePointFirst);
    }
  }

  useEffect(() => {
    MaintransformNodesSecondWall &&
      MaintransformNodesFirstWall &&
      MaintransformNodesSecondWall.map((item) => {
        const transformNode: any = Object.values(item)[0];
        transformNode.rotation.x = Math.PI / 2;
        transformNode.position.y = 100;
        transformNode.position.x = -50;
      });

    createFloor();
  }, [MaintransformNodesSecondWall, MaintransformNodesFirstWall]);

  useEffect(() => {
    if (cizim) {
      (Object.values(cizim) || []).map((item: any, index) => {
        if (item[0].duvarNo === 1) {
          setMaintransformNodesFirstWall((state) => {
            let prevState = state || [];
            let eklenecekObj: any = {};
            eklenecekObj[Object.keys(cizim)[index]] = new Babylon.TransformNode(Object.keys(cizim)[index]);

            prevState.push(eklenecekObj);

            return prevState;
          });
        } else {
          setMaintransformNodesSecondWall((state) => {
            let prev = state || [];

            let eklenecekObj: any = {};
            eklenecekObj[Object.keys(cizim)[index]] = new Babylon.TransformNode(Object.keys(cizim)[index]);

            prev.push(eklenecekObj);

            return prev;
          });
        }
      });
    }
  }, [cizim]);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      const engine = new Babylon.Engine(canvasElement.current, true);
      const scene = new Babylon.Scene(engine);
      createCamera(scene, canvasElement.current);
      setScene(scene);

      if (scene.isReady()) {
        setCizim(DataParser(TESTDATA));
      } else {
        scene.onReadyObservable.addOnce((scene) => renderLoopElements(engine, scene));
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
  return (
    <div className='App'>
      <div>
        <canvas width={canvasSizes.width} height={canvasSizes.height} ref={canvasElement}></canvas>
        <LeftSideMenu></LeftSideMenu>
      </div>
      {scene && (
        <HemisphericLight intensity={10} lightName='FirstLight' position={{ x: 10, y: 10, z: 2 }} scene={scene} />
      )}
      {/* {scene && (
        <CreateCubeObject
          meshWidth={20}
          meshDepth={20}
          meshHeight={0.5}
          meshName='floor'
          scene={scene}
          position={{ x: 0, y: 0, z: 10 }}
          UV={{ col: 1, row: 0.5 }}
        />
      )} */}
      {scene &&
        cizim &&
        MaintransformNodesFirstWall &&
        Object.values(cizim).map((collection: any, index: number) => {
          if (collection[0].duvarNo === 1) {
            const cizimHeader: any = Object.keys(cizim)[index];
            const MainNodes: any = Object.values(
              MaintransformNodesFirstWall.filter((el: any) => el[cizimHeader])[0]
            )[0];
            return (
              <SarginDrawEngine
                collection={collection}
                key={index + Math.random()}
                scene={scene}
                collectionName={Object.keys(cizim)[index]}
                MainNodes={MainNodes}
                duvarFilter={1}
              />
            );
          }
        })}
      {scene &&
        cizim &&
        MaintransformNodesSecondWall &&
        Object.values(cizim).map((collection: any, index: number) => {
          if (collection[0].duvarNo === 0) {
            const cizimHeader: any = Object.keys(cizim)[index];
            const MainNodes: any = Object.values(
              MaintransformNodesSecondWall.filter((el: any) => el[cizimHeader])[0]
            )[0];
            return (
              <SarginDrawEngine
                collection={collection}
                key={index + Math.random()}
                scene={scene}
                collectionName={Object.keys(cizim)[index]}
                MainNodes={MainNodes}
                duvarFilter={0}
              />
            );
          }
        })}
      {scene && MaintransformNodesFirstWall && (
        <button
          onClick={() => {
            MaintransformNodesFirstWall[0].position.x = 500;
          }}>
          CLIKCME
        </button>
      )}
    </div>
  );
}

export default App;
