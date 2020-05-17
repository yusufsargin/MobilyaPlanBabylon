import React, { useState, useRef, useEffect, lazy } from "react";
import * as Babylon from "@babylonjs/core";
import "./App.css";
import HemisphericLight from "./Components/HemisphericLight";
import CreateCubeObject from "./Components/CreateCubeObject";
import DataParser from "./SarginDrawApi/DataParser";
import TESTDATA from "./testJsonData/test.json";
import SarginDrawEngine, { ICizimChild } from "./SarginDrawApi/SarginDrawEngine";
import LeftSideMenu from "./UI/LeftSideMenu/LeftSideMenu";
import { Button } from "semantic-ui-react";

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

function App() {
  const [selectedItem, setSelectedItem] = useState<ISelectedItem>();
  const [canvasSizes, setCanvasSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [AllElementsTrasnformNodesFirstWall, setAllElementsTrasnformNodesFirstWall] = useState<
    Array<ITransformNodes>
  >();
  const [AllElementsTrasnformNodesSecondWall, setAllElementsTrasnformNodesSecondWall] = useState<
    Array<ITransformNodes>
  >();

  const [cizim, setCizim] = useState<any>();
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

  function findMaxPointScene(elements: Array<ITransformNodes> | any) {
    let maxPoints = { x: 0, y: 0, z: 0 };

    elements.map((item: ITransformNodes) => {
      const transformNode: Babylon.TransformNode | any = item.node.transformNode;
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
  function findMinPointScene(elements: Array<ITransformNodes>) {
    let maxPoints = { x: 0, y: 0, z: 0 };

    elements.map((item: ITransformNodes) => {
      const transformNode: Babylon.TransformNode | any = item.node.transformNode;
      const minPointTransformNode = findMinPointElement(transformNode.getChildren());

      if (minPointTransformNode.x < maxPoints.x) {
        maxPoints.x = minPointTransformNode.x;
      }
      if (minPointTransformNode.y < maxPoints.y) {
        maxPoints.y = minPointTransformNode.y;
      }
      if (minPointTransformNode.z < maxPoints.z) {
        maxPoints.z = minPointTransformNode.z;
      }
    });

    return maxPoints;
  }

  function moveTrasnformNodeExactPosition(
    transformNodes: Array<ITransformNodes>,
    whichAxis = "XYZ",
    position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }
  ) {
    transformNodes.map((item: ITransformNodes) => {
      const { x, y, z } = position;
      const transformNode: Babylon.TransformNode = item.node.transformNode;
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

  function moveTransformNodes(transformNode: Babylon.TransformNode, shiftPosition = new Babylon.Vector3(0, 0, 0)) {
    const { x, y, z } = transformNode.getAbsolutePosition();

    const newPosition = new Babylon.Vector3(x + shiftPosition.x, y + shiftPosition.y, z + shiftPosition.z);

    transformNode.setAbsolutePosition(newPosition);
  }

  function setOptimumPosition() {
    if (AllElementsTrasnformNodesSecondWall && AllElementsTrasnformNodesFirstWall) {
      const maxPointsSecond = findMaxPointScene(AllElementsTrasnformNodesSecondWall);
      const maxPointsFirst = findMaxPointScene(AllElementsTrasnformNodesFirstWall);
      const minPointFirstWall = findMinPointScene(AllElementsTrasnformNodesFirstWall);
      const minPointSecondWall = findMinPointScene(AllElementsTrasnformNodesSecondWall);

      const movePointSecond = {
        x: maxPointsSecond.x - minPointSecondWall.x,
        y: maxPointsSecond.y - minPointSecondWall.y,
        z: maxPointsSecond.z - minPointSecondWall.z,
      };
      const movePointFirst = {
        x: maxPointsFirst.x - minPointFirstWall.x,
        y: maxPointsFirst.y - minPointFirstWall.y,
        z: maxPointsFirst.z - minPointFirstWall.z,
      };
      //2. duvarı -> birinci duvarın son noktasına taşı
      moveTrasnformNodeExactPosition(AllElementsTrasnformNodesSecondWall, "Z", movePointFirst);
      moveTransformNodes(AllElementsTrasnformNodesFirstWall[0].node.transformNode, new Babylon.Vector3(50, 0, 0));
      //moveTrasnformNodeExactPosition(MaintransformNodesSecondWall, "Z", movePointFirst);
    }
  }

  //---------------------------

  function nodeTrasnformStartPoint(trasnformNode: Array<ITransformNodes>, wallNo: number = 0) {
    if (wallNo !== 0) {
      trasnformNode.map((item: ITransformNodes) => {
        const transformNode: Babylon.TransformNode = item.node.transformNode;

        transformNode.rotation.x = Math.PI / 2;
        transformNode.rotation.y = Math.PI / 2;
        transformNode.position.y = 100;
        transformNode.position.x = -50;
      });
    } else {
      trasnformNode.map((item: ITransformNodes) => {
        const position = { x: -50, y: 100 };
        const rotation = { x: Math.PI / 2 };

        const node = item.node.transformNode;
        node.rotation.x = rotation.x;
        node.position.y = position.y;
        node.position.x = position.x;
      });
    }
  }

  useEffect(() => {
    AllElementsTrasnformNodesFirstWall && nodeTrasnformStartPoint(AllElementsTrasnformNodesFirstWall);
    AllElementsTrasnformNodesSecondWall && nodeTrasnformStartPoint(AllElementsTrasnformNodesSecondWall, 1);
    AllElementsTrasnformNodesSecondWall && AllElementsTrasnformNodesFirstWall && setOptimumPosition();
  }, [AllElementsTrasnformNodesFirstWall, AllElementsTrasnformNodesSecondWall]);

  //---------------------------

  useEffect(() => {
    if (cizim) {
      (Object.values(cizim) || []).map((item: any, index) => {
        if (item[0].duvarNo === 1) {
          setAllElementsTrasnformNodesSecondWall((state: Array<ITransformNodes> | undefined) => {
            let prevState = state || [];

            prevState.push({
              node: {
                name: Object.keys(cizim)[index],
                transformNode: new Babylon.TransformNode(Object.keys(cizim)[index]),
              },
            });

            return prevState;
          });
        } else {
          setAllElementsTrasnformNodesFirstWall((state: Array<ITransformNodes> | undefined) => {
            let prevState = state || [];

            prevState.push({
              node: {
                name: Object.keys(cizim)[index],
                transformNode: new Babylon.TransformNode(Object.keys(cizim)[index]),
              },
            });

            return prevState;
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
        scene.onReadyObservable.addOnce((scene) => {
          renderLoopElements(engine, scene);
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

  const [testDATA, setTestDATA] = useState({
    name: "TEST",
    genislik: 10,
    boy: 0,
    derinlik: 0,
    duzenleVisible: false,
  });

  useEffect(() => {
    if (scene && scene.meshes.length > 0) {
      const sceneCopy = scene;
      const mesh = scene.meshes[0];
      mesh.isPickable = true;
      mesh.actionManager = new Babylon.ActionManager(scene);
      console.log(mesh);
      mesh.actionManager.registerAction(
        new Babylon.ExecuteCodeAction(Babylon.ActionManager.OnPickTrigger, function (e) {
          debugger;
          const { x, y, z } = mesh.getAbsolutePosition();
          let dataDDD = {
            duzenleVisible: true,
            name: mesh.name,
            genislik: x,
            boy: y,
            derinlik: z,
          };
          console.log(dataDDD);
          debugger;
          setTestDATA(dataDDD);
        })
      );
    }
  }, [scene, AllElementsTrasnformNodesFirstWall]);

  useEffect(() => {
    // if (scene && AllElementsTrasnformNodesFirstWall && canvasElement.current) {
    //   AllElementsTrasnformNodesFirstWall.map((item: ITransformNodes) => {
    //     const meshes: Array<Babylon.Mesh> | any = item.node.transformNode.getChildMeshes();
    //     meshes.map((mesh: Babylon.Mesh) => {
    //       scene.onAfterRenderObservable.add(() => {
    //         mesh.isPickable = true;
    //         mesh.actionManager = new Babylon.ActionManager(scene);
    //         mesh.actionManager.registerAction(
    //           new Babylon.ExecuteCodeAction(Babylon.ActionManager.OnPickTrigger, function (e) {
    //             const { x, y, z } = mesh.getAbsolutePosition();
    //             let dataDDD = {
    //               duzenleVisible: true,
    //               name: mesh.name,
    //               genislik: x,
    //               boy: y,
    //               derinlik: z,
    //             };
    //             console.log(dataDDD);
    //             debugger;
    //             setTestDATA(dataDDD);
    //           })
    //         );
    //       });
    //     });
    //   });
    // }
  }, [AllElementsTrasnformNodesFirstWall]);

  return (
    <div className='App'>
      <div>
        <canvas width={canvasSizes.width} height={canvasSizes.height} ref={canvasElement}></canvas>
      </div>
      {scene && <LeftSideMenu selectedItem={testDATA}></LeftSideMenu>}
      {scene && (
        <HemisphericLight intensity={10} lightName='FirstLight' position={{ x: 10, y: 10, z: 2 }} scene={scene} />
      )}
      {scene &&
        cizim &&
        AllElementsTrasnformNodesSecondWall &&
        Object.values(cizim).map((collection: any, index: number) => {
          if (collection[0].duvarNo === 1) {
            const cizimHeader: any = Object.keys(cizim)[index];
            const transformNode = (
              (AllElementsTrasnformNodesSecondWall.filter((item) => item.node.name === cizimHeader)[0] || {}).node || {}
            ).transformNode;
            return (
              <SarginDrawEngine
                collection={collection}
                key={index + Math.random()}
                scene={scene}
                collectionName={Object.keys(cizim)[index]}
                MainNodes={transformNode}
                duvarFilter={1}
              />
            );
          }
        })}
      {scene &&
        cizim &&
        AllElementsTrasnformNodesFirstWall &&
        Object.values(cizim).map((collection: any, index: number) => {
          if (collection[0].duvarNo === 0) {
            const cizimHeader: any = Object.keys(cizim)[index];
            const transformNode =
              (
                (AllElementsTrasnformNodesFirstWall.filter((item) => item.node.name === cizimHeader)[0] || {}).node ||
                {}
              ).transformNode || {};
            return (
              <SarginDrawEngine
                collection={collection}
                key={index + Math.random()}
                scene={scene}
                collectionName={Object.keys(cizim)[index]}
                MainNodes={transformNode}
                duvarFilter={0}
              />
            );
          }
        })}
    </div>
  );
}

export default App;
