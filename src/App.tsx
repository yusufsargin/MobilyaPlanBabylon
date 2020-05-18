import React, { useState, useRef, useEffect, lazy, useCallback } from "react";
import * as Babylon from "@babylonjs/core";
import "./App.css";
import HemisphericLight from "./Components/HemisphericLight";
import CreateCubeObject from "./Components/CreateCubeObject";
import DataParser from "./SarginDrawApi/DataParser";
import TESTDATA from "./testJsonData/test.json";
import SarginDrawEngine, { ICizimChild } from "./SarginDrawApi/SarginDrawEngine";
import LeftSideMenu from "./UI/LeftSideMenu/LeftSideMenu";
import { Button } from "semantic-ui-react";
import MainScene from "./Scene/MainScene";

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
  const [scene, setScene] = useState<Babylon.Scene>();
  const [cizim, setCizim] = useState<any>();
  const [selectedItem, setSelectedItem] = useState<any>();
  const [AllElementsTrasnformNodesFirstWall, setAllElementsTrasnformNodesFirstWall] = useState<
    Array<ITransformNodes>
  >();
  const [AllElementsTrasnformNodesSecondWall, setAllElementsTrasnformNodesSecondWall] = useState<
    Array<ITransformNodes>
  >();
  const setEvent = useCallback((evt, value) => {
    console.log(value);
    setSelectedItem(value);
  }, []);

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

  let selectedItemLocal: any = {
    duzenleVisible: true,
    name: "mesh.name",
    genislik: 200,
    boy: 15,
    derinlik: 44,
  };

  useEffect(() => {
    scene && scene.render();

    return () => {
      scene?.dispose();
    };
  }, [selectedItem]);

  useEffect(() => {
    if (scene && AllElementsTrasnformNodesFirstWall) {
      AllElementsTrasnformNodesFirstWall.map((item: ITransformNodes) => {
        const meshes: Array<Babylon.Mesh> | any = item.node.transformNode.getChildMeshes();
        meshes.map((mesh: Babylon.Mesh) => {
          mesh.isPickable = true;
          mesh.actionManager = new Babylon.ActionManager(scene);
          mesh.actionManager.registerAction(
            new Babylon.ExecuteCodeAction(
              {
                trigger: Babylon.ActionManager.OnPickTrigger,
              },
              function (evt) {
                const data = {
                  duzenleVisible: true,
                  name: "mesh.name",
                  genislik: 200,
                  boy: 15,
                  derinlik: 44,
                };

                setEvent(evt, data);
              }
            )
          );
        });
      });
    }

    AllElementsTrasnformNodesFirstWall && nodeTrasnformStartPoint(AllElementsTrasnformNodesFirstWall);
    AllElementsTrasnformNodesSecondWall && nodeTrasnformStartPoint(AllElementsTrasnformNodesSecondWall, 1);
    AllElementsTrasnformNodesSecondWall && AllElementsTrasnformNodesFirstWall && setOptimumPosition();
  }, [AllElementsTrasnformNodesFirstWall, AllElementsTrasnformNodesSecondWall]);

  const onSceneReady = (scene: Babylon.Scene) => {
    scene && setScene(scene);
    console.log(scene);

    setCizim(DataParser(TESTDATA));
  };

  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  const onRender = (scene: Babylon.Scene) => {
    scene.render();
  };

  return (
    <div className='App'>
      {<MainScene onSceneReady={onSceneReady} onRender={onRender} selectedItem={selectedItem} />}
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
      {<LeftSideMenu selectedItem={selectedItemLocal}></LeftSideMenu>}
    </div>
  );
}

export default App;
