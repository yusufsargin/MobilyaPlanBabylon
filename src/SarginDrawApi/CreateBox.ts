import * as Babylon from "@babylonjs/core";
import { IPosition } from "../Components/CreateSceneElement";

export default class CreateBox {
  private _modulAdi: string;
  private _en: number;
  private _boy: number;
  private _derinlik: number;
  private _scene: Babylon.Scene | any;
  private _position: IPosition;

  constructor(en: number, boy: number, derinlik: number, modulAdi: string, scene: Babylon.Scene | any, position: IPosition) {
    this._en = en;
    this._boy = boy;
    this._derinlik = derinlik;
    this._modulAdi = modulAdi;
    this._scene = scene;
    this._position = position;
  }

  /**
   * Getter en
   * @return {number}
   */
  public get en(): number {
    return this._en;
  }

  /**
   * Getter position
   * @return {IPosition}
   */
  public get position(): IPosition {
    return this._position;
  }

  /**
   * Setter position
   * @param {IPosition} value
   */
  public set position(value: IPosition) {
    this._position = value;
  }

  /**
   * Getter boy
   * @return {number}
   */
  public get boy(): number {
    return this._boy;
  }

  /**
   * Getter derinlik
   * @return {number}
   */
  public get derinlik(): number {
    return this._derinlik;
  }

  /**
   * Setter en
   * @param {number} value
   */
  public set en(value: number) {
    this._en = value;
  }

  /**
   * Setter boy
   * @param {number} value
   */
  public set boy(value: number) {
    this._boy = value;
  }

  /**
   * Setter derinlik
   * @param {number} value
   */
  public set derinlik(value: number) {
    this._derinlik = value;
  }

  /**
   * Getter modulAdi
   * @return {String}
   */
  public get modulAdi(): string {
    return this._modulAdi;
  }

  /**
   * Setter modulAdi
   * @param {String} value
   */
  public set modulAdi(value: string) {
    this._modulAdi = value;
  }

  /**
   * Getter scene
   * @return {Babylon.Scene }
   */
  public get scene(): Babylon.Scene {
    return this._scene;
  }

  /**
   * Setter scene
   * @param {Babylon.Scene } value
   */
  public set scene(value: Babylon.Scene) {
    this._scene = value;
  }

  public generateObject(): Babylon.Mesh | any {
    const box = new (Babylon.MeshBuilder.CreateBox as Babylon.MeshBuilder | any)(
      this._modulAdi || "",
      {
        width: this.en,
        height: this.boy,
        depth: this._derinlik,
      },
      this._scene
    );

    box.position = new Babylon.Vector3(this._position.x || 0, this._position.y || 0, this._position.z || 0);

    return box;
  }
}
