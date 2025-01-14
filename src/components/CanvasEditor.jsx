import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

const CanvasEditor = ({ imageUrl, onBack }) => {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize the Fabric.js canvas
        const canvasElement = document.getElementById("editor-canvas");
        if (!canvasElement) return;

        const canvas = new fabric.Canvas(canvasElement);
        canvasRef.current = canvas;

        // Load the image onto the canvas
        fabric.Image.fromURL(
            imageUrl,
            (img) => {
                img.set({
                    left: canvas.width / 2 - img.width / 2, // Center the image horizontally
                    top: canvas.height / 2 - img.height / 2, // Center the image vertically
                    selectable: false,
                });
                canvas.add(img);
                setLoading(false); // Stop loading spinner
            },
            { crossOrigin: "anonymous" }
        );

        // Event listener: Ensure text is always on top
        canvas.on("object:added", () => {
            const textObject = canvas.getObjects().find((obj) => obj.type === "textbox");
            if (textObject) {
                canvas.bringToFront(textObject); // Bring textObject to the top
            }
        });

        return () => {
            // Cleanup canvas on unmount
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
            fill: "black", // Set text color to black
        });
        canvas.add(textObject);
        canvas.bringToFront(textObject); // Ensure text stays on top
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
        link.download = "modified-image.png";
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
            {/* Header and Navigation */}
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
            <div className="w-full max-w-4xl px-6 bg-white rounded-lg shadow-lg relative pb-6">
                {/* Loading Indicator */}
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Canvas Container */}
                <div className="relative mb-8">
                    <canvas
                        id="editor-canvas"
                        className="w-full h-auto bg-transparent border border-gray-300 rounded-lg"
                        width={800}
                        height={600}
                    ></canvas>
                </div>

                {/* Toolbar (Positioned on the Right) */}
                <div className="absolute top-1/2 transform -translate-y-1/2 right-6 flex flex-col gap-4 bg-white p-4 rounded-md shadow-lg">
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


// import React, { useEffect, useRef, useState } from "react";
// import { fabric } from "fabric";

// const CanvasEditor = ({ imageUrl, onBack }) => {
//     const canvasRef = useRef(null);
//     const [loading, setLoading] = useState(true);
//     const [canvasWidth, setCanvasWidth] = useState(800); // Set default width for the canvas
//     const [canvasHeight, setCanvasHeight] = useState(600); // Set default height for the canvas

//     useEffect(() => {
//         // Function to update canvas size on window resize
//         const updateCanvasSize = () => {
//             setCanvasWidth(window.innerWidth * 0.9); // 90% of window width
//             setCanvasHeight(window.innerHeight * 0.6); // 60% of window height
//         };

//         // Listen for window resize
//         window.addEventListener("resize", updateCanvasSize);

//         // Initial size set
//         updateCanvasSize();

//         // Initialize the Fabric.js canvas
//         const canvasElement = document.getElementById("editor-canvas");
//         if (!canvasElement) return;

//         const canvas = new fabric.Canvas(canvasElement);
//         canvasRef.current = canvas;

//         // Load the image onto the canvas
//         fabric.Image.fromURL(
//             imageUrl,
//             (img) => {
//                 // Scale image to fit within canvas
//                 const scaleX = canvasWidth / img.width;
//                 const scaleY = canvasHeight / img.height;
//                 const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

//                 img.set({
//                     left: (canvasWidth - img.width * scale) / 2, // Center the image horizontally
//                     top: (canvasHeight - img.height * scale) / 2, // Center the image vertically
//                     scaleX: scale,
//                     scaleY: scale,
//                     selectable: false,
//                 });
//                 canvas.add(img);
//                 setLoading(false); // Stop loading spinner
//             },
//             { crossOrigin: "anonymous" }
//         );

//         // Event listener: Ensure text is always on top
//         canvas.on("object:added", () => {
//             const textObject = canvas.getObjects().find((obj) => obj.type === "textbox");
//             if (textObject) {
//                 canvas.bringToFront(textObject); // Bring textObject to the top
//             }
//         });

//         return () => {
//             // Cleanup canvas on unmount
//             if (canvasRef.current) {
//                 canvasRef.current.dispose();
//             }
//             window.removeEventListener("resize", updateCanvasSize);
//         };
//     }, [imageUrl, canvasWidth, canvasHeight]);

//     const addText = () => {
//         const canvas = canvasRef.current;
//         const textObject = new fabric.Textbox("Add your text here", {
//             left: 100,
//             top: 100,
//             width: 200,
//             selectable: true,
//             hasControls: true,
//             fill: "black", // Set text color to black
//         });
//         canvas.add(textObject);
//         canvas.bringToFront(textObject); // Ensure text stays on top
//     };

//     const addRectangle = () => {
//         const canvas = canvasRef.current;
//         const rect = new fabric.Rect({
//             left: 150,
//             top: 150,
//             width: 100,
//             height: 100,
//             fill: "blue",
//             selectable: true,
//         });
//         canvas.add(rect);
//     };

//     const addCircle = () => {
//         const canvas = canvasRef.current;
//         const circle = new fabric.Circle({
//             left: 150,
//             top: 150,
//             radius: 50,
//             fill: "red",
//             selectable: true,
//         });
//         canvas.add(circle);
//     };

//     const addTriangle = () => {
//         const canvas = canvasRef.current;
//         const triangle = new fabric.Triangle({
//             left: 150,
//             top: 150,
//             width: 100,
//             height: 100,
//             fill: "green",
//             selectable: true,
//         });
//         canvas.add(triangle);
//     };

//     const deleteObject = () => {
//         const canvas = canvasRef.current;
//         const activeObject = canvas.getActiveObject();

//         if (activeObject) {
//             canvas.remove(activeObject);
//         } else {
//             alert("No object selected to delete");
//         }
//     };

//     const downloadImage = () => {
//         const canvas = canvasRef.current;
//         const dataURL = canvas.toDataURL({
//             format: "png",
//             quality: 1,
//         });

//         const link = document.createElement("a");
//         link.href = dataURL;
//         link.download = "modified-image.png";
//         link.click();
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
//             {/* Header and Navigation */}
//             <div className="w-full max-w-4xl px-6 py-4 mb-3 flex justify-between items-center bg-white shadow-lg rounded-md">
//                 <button
//                     onClick={onBack}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition"
//                 >
//                     Back
//                 </button>
//                 <h2 className="text-2xl font-semibold text-gray-700">Image Editor</h2>
//                 <button
//                     onClick={downloadImage}
//                     className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none transition"
//                 >
//                     Download
//                 </button>
//             </div>

//             {/* Canvas Editor Section */}
//             <div className="w-full max-w-4xl px-6 bg-white rounded-lg shadow-lg relative pb-6">
//                 {/* Loading Indicator */}
//                 {loading && (
//                     <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
//                         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
//                     </div>
//                 )}

//                 {/* Canvas Container */}
//                 <div className="relative mb-8">
//                     <canvas
//                         id="editor-canvas"
//                         className="w-full h-auto bg-transparent border border-gray-300 rounded-lg"
//                         style={{ maxHeight: `${canvasHeight}px` }}
//                     ></canvas>
//                 </div>

//                 {/* Toolbar (Positioned on the Bottom for Mobile) */}
//                 <div className="absolute bottom-6 left-0 right-0 mx-auto flex justify-between flex-wrap gap-4 p-4 bg-white rounded-md shadow-lg z-10">
//                     <button
//                         onClick={addText}
//                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none transition disabled:opacity-50 w-full sm:w-auto"
//                         disabled={loading}
//                     >
//                         Add Text
//                     </button>
//                     <button
//                         onClick={addRectangle}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none transition disabled:opacity-50 w-full sm:w-auto"
//                         disabled={loading}
//                     >
//                         Add Rectangle
//                     </button>
//                     <button
//                         onClick={addCircle}
//                         className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none transition disabled:opacity-50 w-full sm:w-auto"
//                         disabled={loading}
//                     >
//                         Add Circle
//                     </button>
//                     <button
//                         onClick={addTriangle}
//                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none transition disabled:opacity-50 w-full sm:w-auto"
//                         disabled={loading}
//                     >
//                         Add Triangle
//                     </button>
//                     <button
//                         onClick={deleteObject}
//                         className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none transition disabled:opacity-50 w-full sm:w-auto"
//                         disabled={loading}
//                     >
//                         Delete Object
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CanvasEditor;
