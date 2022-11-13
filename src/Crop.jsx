import React, { useState, useEffect } from 'react';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { parseCropString } from './segments';


const globalToLocalCrop = (c, ratio) => {
  if (ratio) {
    return {
      x: c.x / ratio,
      y: c.y / ratio,
      width: c.width / ratio,
      height: c.height / ratio,
    }
  };
};

const localToGlobalCrop = (c, ratio) => {
  if (ratio) {
    return {
      x: Math.round(c.x * ratio),
      y: Math.round(c.y * ratio),
      width: Math.round(c.width * ratio),
      height: Math.round(c.height * ratio),
    }
  }
}

const Crop = (props) => {
  const [crop, setCrop] = useState({ unit: "px", aspect: 16 / 9 });

  useEffect(() => {
    if (props.crop) { 
      const ratio = calculateRatio(props.stream, props.viewport);
      const globalCrop = parseCropString(props.crop);
      const newCrop = {
        ...globalToLocalCrop(globalCrop, ratio),
        unit: "px",
        aspect: 16 / 9,
      };
      if (!crop || (crop.x !== newCrop.x || crop.y !== newCrop.y || crop.width !== newCrop.width || crop.height !== newCrop.height)) {
        setCrop(newCrop);
      } 
    } else {
      setCrop(undefined);
    }
  }, [props.crop]);

  const handleCropChange = (c, ratio) => {
    if (c.width < 1 || c.height < 1) {
      return props.onCrop(undefined);
    }
    const globalCrop = localToGlobalCrop(c, ratio);
    props.onCrop(`${globalCrop.width}:${globalCrop.height}:${globalCrop.x}:${globalCrop.y}`);
  }

  const calculateRatio = (stream, viewport) => {
    if (stream && viewport) {
      const xRatio = stream.width / viewport.width;
      const yRatio = stream.height / viewport.height;

      return xRatio > yRatio ? xRatio : yRatio;
    }
  }
  
  const calculateCropArea = (stream, viewport, ratio) => {
    let cropArea = { width: 0, height: 0, x: 0, y: 0 };

    if (stream && viewport && ratio) {
      cropArea.width = stream.width / ratio;
      cropArea.height = stream.height / ratio;
      cropArea.x = (viewport.width - cropArea.width) / 2;
      cropArea.y = (viewport.height - cropArea.height) / 2;
    }
    
    return cropArea;
  }

  const decodeCropParam = (c, ratio) => {
    if (c && ratio) {
      const globalCrop = parseCropString(c);
      return {
        ...globalToLocalCrop(globalCrop, ratio),
        unit: "px",
        aspect: 16 / 9,
      }
    }
  }

  const ratio = calculateRatio(props.stream, props.viewport);
  const cropArea = calculateCropArea(props.stream, props.viewport, ratio);

  return (
    <div className="no-user-select" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
      <ReactCrop 
        unit="px" 
        aspect={16 / 9} 
        crop={crop} 
        onComplete={c => handleCropChange(c, ratio)}
        onChange={(c) => setCrop(c)}
        style={{ zIndex: 1, position: 'absolute', top: cropArea.y, left: cropArea.x, width: cropArea.width, height: cropArea.height  }}
      >
        <div style={{ display: 'block', position: 'relative', width: cropArea.width, height: cropArea.height }} />
      </ReactCrop>
      <div style={{ zIndex: 0, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
        {props.children}
      </div>
    </div>
  );
}

export default Crop;