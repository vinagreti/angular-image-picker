/*
* Built in canvas filters
*/
export const Filters = {
    effects: {},
    ensureRGBRange: (v): number => {
        if (isNaN(v)) {
            console.log('V is undefined', v)
        }
        if (v < 0) {
            return 0;
        } else if (v > 255) {
            return 255;
        }
        return v;
    }
};

Filters.effects['Gray'] = (imageData) => {
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const v = 0.2126 * r  +  0.7152 * g  +  0.0722 * b;
      d[i] = d[i + 1] = d[i + 2] = v
    }
};

Filters.effects['Light-Gray'] = (imageData) => {
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const v = 0.2126 * r  +  0.7152 * g  +  0.0722 * b;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i] += d[i];
      d[i + 1] += d[i + 1];
      d[i + 2] += d[i + 2];
    }
};

Filters.effects['Redscale'] = (imageData, adjustment) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    d[i] = Filters.ensureRGBRange(r + adjustment);
    d[i + 1] += d[i + 1];
    d[i + 2] += d[i + 2]
  }
};

Filters.effects['Greenscale'] = (imageData, adjustment) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const g = d[i + 1];
    d[i] = d[i];
    d[i + 1] += Filters.ensureRGBRange(g + adjustment);
    d[i + 2] += d[i + 2];
  }
};

Filters.effects['Bluescale'] = (imageData, adjustment) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const b = d[i + 2];
    d[i] = d[i];
    d[i + 1] += d[i + 1];
    d[i + 2] += Filters.ensureRGBRange(b + adjustment);
  }
};

Filters.effects['Brightness'] = (imageData, adjustment) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    d[i] += Filters.ensureRGBRange(r + adjustment);
    d[i + 1] += Filters.ensureRGBRange(g + adjustment);
    d[i + 2] += Filters.ensureRGBRange(b + adjustment);
  }
};

Filters.effects['Manual'] = (imageData, adjustment, blueScaleAdjustment = 0, greenScaleAdjustment = 0, redScaleAdjustment = 0) => {
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    d[i] += Filters.ensureRGBRange(r + redScaleAdjustment);
    d[i + 1] += Filters.ensureRGBRange(r + greenScaleAdjustment);
    d[i + 2] += Filters.ensureRGBRange(r + blueScaleAdjustment);
  }
};
