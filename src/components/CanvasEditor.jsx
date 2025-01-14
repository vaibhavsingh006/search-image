import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

const CanvasEditor = ({ imageUrl, onBack }) => {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const canvasElement = document.getElementById("editor-canvas");
        if (!canvasElement) return;

        const canvas = new fabric.Canvas(canvasElement);
        canvasRef.current = canvas;

        fabric.Image.fromURL(
            imageUrl,
            (img) => {
                img.set({
                    left: canvas.width / 2 - img.width / 2,
                    top: canvas.height / 2 - img.height / 2,
                    selectable: false,
                });
                canvas.add(img);
                setLoading(false);
            },
            { crossOrigin: "anonymous" }
        );

        canvas.on("object:added", () => {
            const textObject = canvas.getObjects().find((obj) => obj.type === "textbox");
            if (textObject) {
                canvas.bringToFront(textObject);
            }
        });

        return () => {
            if (canvasRef.current) {
                canvasRef.current.dispose();
            }
        };
    }, [imageUrl]);

    const addText = () => {
        const canvas = canvasRef.current;
        const textObject = new fabric.Textbox("Add your text here", {
            left: 100,
            top: 100,
            width: 200,
            selectable: true,
            hasControls: true,
            fill: "black",
        });
        canvas.add(textObject);
        canvas.bringToFront(textObject);
    };

    const addRectangle = () => {
        const canvas = canvasRef.current;
        const rect = new fabric.Rect({
            left: 150,
            top: 150,
            width: 100,
            height: 100,
            fill: "blue",
            selectable: true,
        });
        canvas.add(rect);
    };

    const addCircle = () => {
        const canvas = canvasRef.current;
        const circle = new fabric.Circle({
            left: 150,
            top: 150,
            radius: 50,
            fill: "red",
            selectable: true,
        });
        canvas.add(circle);
    };

    const addTriangle = () => {
        const canvas = canvasRef.current;
        const triangle = new fabric.Triangle({
            left: 150,
            top: 150,
            width: 100,
            height: 100,
            fill: "green",
            selectable: true,
        });
        canvas.add(triangle);
    };

    const deleteObject = () => {
        const canvas = canvasRef.current;
        const activeObject = canvas.getActiveObject();

        if (activeObject) {
            canvas.remove(activeObject);
        } else {
            alert("No object selected to delete");
        }
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL({
            format: "png",
            quality: 1,
        });

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "VS-modified-image.png";
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
            {/* Header */}
            <div className="w-full max-w-4xl px-6 py-4 mb-3 flex justify-between items-center bg-white shadow-lg rounded-md">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition"
                >
                    Back
                </button>
                <h2 className="text-2xl font-semibold text-gray-700">Image Editor</h2>
                <button
                    onClick={downloadImage}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none transition"
                >
                    Download
                </button>
            </div>

            {/* Canvas Editor Section */}
            <div className="w-full max-w-4xl px-6 bg-white rounded-lg shadow-lg">
                {/* Loading Indicator */}
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Canvas */}
                <div className="relative mb-4 aspect-w-4 aspect-h-3">
                    <canvas
                        id="editor-canvas"
                        className="w-full h-full bg-transparent border border-gray-300 rounded-lg"
                        width={800}
                        height={600}
                    ></canvas>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-100 rounded-lg shadow-lg">
                    <button
                        onClick={addText}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none transition disabled:opacity-50"
                        disabled={loading}
                    >
                        Add Text
                    </button>
                    <button
                        onClick={addRectangle}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition disabled:opacity-50"
                        disabled={loading}
                    >
                        Add Rectangle
                    </button>
                    <button
                        onClick={addCircle}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none transition disabled:opacity-50"
                        disabled={loading}
                    >
                        Add Circle
                    </button>
                    <button
                        onClick={addTriangle}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none transition disabled:opacity-50"
                        disabled={loading}
                    >
                        Add Triangle
                    </button>
                    <button
                        onClick={deleteObject}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none transition disabled:opacity-50"
                        disabled={loading}
                    >
                        Delete Object
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CanvasEditor;
