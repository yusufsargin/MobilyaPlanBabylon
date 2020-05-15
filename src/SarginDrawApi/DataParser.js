export default function DataParser(props) {
  const addToArray = (
    item,
    urun,
    kalinlik,
    extra = {
      cekmecekontrol: false,
    }
  ) => {
    const { adı, boy, derinlik, en, image, marka, x_1, y_1, z_1, tip } = urun;

    if (Object.values(extra).length !== 0) {
      return {
        adi: adı || "",
        boy: parseFloat(boy || 0),
        derinlik: parseFloat(derinlik || 0),
        en: parseFloat(en || 0),
        x_1: parseFloat(x_1 || 0),
        y_1: parseFloat(y_1 || 0),
        z_1: parseFloat(z_1 || 0),
        marka: marka || "",
        image: image || "",
        kalinlik: parseFloat(kalinlik || 0),
        duvarNo: parseFloat(item.duvar_no || 0),
        modulAdi: item.modül_adı || "",
        modulEn: parseFloat(item.eni || 0),
        modulDerinlik: parseFloat(item.derinlik || 0),
        modulX1: parseFloat(item.x1 || 0),
        modulY1: parseFloat(item.y1 || 0),
        modulZ1: parseFloat(item.z1 || 0),
        modulYukseklik: parseFloat(item.yükseklik || 0),
        tip: tip || 0,
        extra,
      };
    }

    return {
      adi: adı || "",
      boy: parseFloat(boy || 0),
      derinlik: parseFloat(derinlik || 0),
      en: parseFloat(en || 0),
      x_1: parseFloat(x_1 || 0),
      y_1: parseFloat(y_1 || 0),
      z_1: parseFloat(z_1 || 0),
      marka: marka || "",
      image: image || "",
      kalinlik: parseFloat(kalinlik || 0),
      duvarNo: parseFloat(item.duvar_no || 0),
      modulAdi: item.modül_adı || "",
      modulEn: parseFloat(item.eni || 0),
      modulDerinlik: parseFloat(item.derinlik || 0),
      modulX1: parseFloat(item.x1 || 0),
      modulY1: parseFloat(item.y1 || 0),
      modulZ1: parseFloat(item.z1 || 0),
      modulYukseklik: parseFloat(item.yükseklik || 0),
      tip: tip || 0,
    };
  };

  const renderedItems = Object.values(props.wixData)
    .filter((item) => item.rendered)
    .sort((a, b) => {
      return a.time - b.time;
    });

  const cizim = renderedItems[0].cizim || {};

  let lastData = {};

  cizim.map((item, index) => {
    const getCollectionName = (item) => {
      let modulName = item["modül_adı"] || "";
      const isHave = Object.keys(lastData).filter((listItem) => listItem !== modulName).length > 0;
      if (isHave) {
        return (modulName = modulName + "_" + Math.floor(Math.random() * 100));
      }
      return modulName;
    };
    const collectionName = getCollectionName(item);

    let toLastData = [];

    const collectionMainItem = Object.values(item)
      .filter((el) => typeof el === "object")
      .filter((el) => typeof Object.values(el)[0] !== "object")
      .filter((el) => el.dahil);

    const collectionTopBottomItem = Object.values(item)
      .filter((el) => typeof el === "object")
      .filter((el) => typeof Object.values(el)[0] === "object");

    collectionMainItem.map((urun) => {
      const kalinlik = parseFloat(((urun || {}).malzeme || {}).kalınlık) || 1.8;

      toLastData.push(addToArray(item, urun, kalinlik));
    });

    Object.values(collectionTopBottomItem).map((el) => {
      Object.values(el).map((subEl) => {
        if (subEl.adı && subEl.dahil) {
          const kalinlik = (subEl.malzeme || {}).kalınlık || 1.8;

          toLastData.push(addToArray(item, subEl, kalinlik));
        }
      });
    });

    lastData[collectionName] = toLastData;
  });

  Object.keys(lastData).map((listItem) => {
    Object.keys(lastData[listItem]).map((subItem) => {
      if (lastData[listItem][subItem].adi && lastData[listItem][subItem].adi.indexOf("çekmece") !== -1) {
        delete lastData[listItem][subItem];
      }
    });
    // if (listItem.indexOf('çekmece') !== -1) {
    //   delete lastData[listItem];
    // }
  });

  //Çekmece
  cizim.map((item) => {
    const getCollectionName = (item) => {
      let modulName = item["modül_adı"] || "";
      const isHave = Object.keys(lastData).filter((listItem) => listItem !== modulName).length > 0;
      if (isHave) {
        return (modulName = modulName + "_" + Math.floor(Math.random() * 100));
      }
      return modulName;
    };
    const collectionName = getCollectionName(item);

    let toLastData = [];

    if (item.çekmece_var) {
      item.çk.map((ckItem) => {
        const objectItem = Object.values(ckItem).filter((el) => typeof el === "object" && el.dahil);

        objectItem.map((el) => {
          const kalinlik = (el.malzeme || {}).kalınlık || 1.8;

          toLastData.push(
            addToArray(item, el, kalinlik, {
              cekmecekontrol: true,
            })
          );
        });
      });

      lastData[collectionName] = toLastData;
    }
  });

  return lastData || [];
}
