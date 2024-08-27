import React, { useEffect, useState } from 'react';

const gridStyle = {
    display: 'grid',
    gridTemplateRows: 'repeat(15, 1fr)',
    gridTemplateColumns: 'repeat(20, 1fr)',
    gap: '2px',
    padding: "5px",
    borderRadius: "10px",
    backgroundColor: "black",
};

const gridItemStyle = {
    width: '20px',
    height: '20px',
    border: '1px solid #1717179b',
};

const DROP_LENGTH = 6;

const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return [r, g, b];
    }
    throw new Error('Invalid hex color format');
};

const rgbToHex = (r, g, b) => {
    return `#${[r, g, b].map(value => {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
};

const adjustColor = (rgb, factor) => {
    return rgb.map(channel => Math.min(255, Math.max(0, Math.round(channel * factor))));
};

const generateColorShades = (hex) => {
    const rgb = hexToRgb(hex);
    const shades = [];
    const numShades = DROP_LENGTH + 1;

    for (let i = numShades - 1; i >= 0; i--) {
        const factor = 1 - (i / (numShades - 1));
        const adjustedRgb = adjustColor(rgb, factor);
        shades.push(rgbToHex(...adjustedRgb));
    }
    return shades;
};

const colorArray = ["FF0000", "00FF00", "0000FF", "00FFFF", "FF00FF"];

const RainFall = () => {
    const [hexColor, setHexColor] = useState("#FF0000");
    const gradientColors = generateColorShades(hexColor);

    useEffect(() => {
        const getRandomColor = () => `#${colorArray[Math.floor(Math.random() * colorArray.length)]}`;

        const intervalId = setInterval(() => {
            setHexColor(getRandomColor());
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const rows = 15;
    const columns = 20;
    const gridItems = Array.from({ length: rows * columns }, (_, index) => index);

    const [rainPositions, setRainPositions] = useState(
        Array.from({ length: columns }, () => Math.floor(Math.random() * rows))
    );



    useEffect(() => {
        const updateRain = () => {
            setRainPositions(prevPositions => {
                return prevPositions.map(position => {
                    return (position + 1) % rows;
                });
            });
        };

        const interval = setInterval(updateRain, 50);

        return () => clearInterval(interval);
    }, [rows]);

    return (
        <div style={gridStyle}>
            {gridItems.map((item) => {
                const row = Math.floor(item / columns);
                const col = item % columns;
                const position = rainPositions[col];
                const isInDrop = row >= position && row < position + DROP_LENGTH;
                const gradientIndex = isInDrop ? row - position : -1;
                const backgroundColor = gradientIndex >= 0 ? gradientColors[gradientIndex] : 'black';
                return (
                    <div
                        key={item}
                        style={{
                            ...gridItemStyle,
                            backgroundColor,
                        }}
                    ></div>
                );
            })}
        </div>
    );
};

export default RainFall;
