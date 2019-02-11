import Color from 'color';

export const getWindowData = (x, y, w, h, border, color, lighted = false) => {
    const glassSize = {
        w: Math.round((w - border * 3) / 2),
        h: Math.round((h - border * 3) / 2)
    };
    return [
        {
            type: 'rect',
            x,
            y,
            w: w,
            h: h,
            color,
            config: {
                colorVariety: 0.1,
                shadow: true
            }
        },
        {
            type: 'rect',
            x: x + border,
            y: y + border,
            w: glassSize.w,
            h: glassSize.h,
            color: lighted ? '#bba83a' : '#39363d',
            config: {
                colorVariety: 0.05,
                shadow: false
            }
        },
        {
            type: 'rect',
            x: glassSize.w + x + border * 2,
            y: y + border,
            w: glassSize.w,
            h: glassSize.h,
            color: lighted ? '#bba83a' : '#39363d',
            config: {
                colorVariety: 0.05,
                shadow: false
            }
        },
        {
            type: 'rect',
            x: x + border,
            y: glassSize.h + y + border * 2,
            w: glassSize.w,
            h: glassSize.h,
            color: lighted ? '#bba83a' : '#39363d',
            config: {
                colorVariety: 0.05,
                shadow: false
            }
        },
        {
            type: 'rect',
            x: glassSize.w + x + border * 2,
            y: glassSize.h + y + border * 2,
            w: glassSize.w,
            h: glassSize.h,
            color: lighted ? '#bba83a' : '#39363d',
            config: {
                colorVariety: 0.05,
                shadow: false
            }
        },
        {
            type: 'rect',
            x: x - border / 2,
            y: h + y,
            w: w + border,
            h: border * 2,
            color: Color(color).darken(0.1).hsl().string(),
            config: {
                colorVariety: 0.05,
                shadow: true
            }
        },
    ]
};
