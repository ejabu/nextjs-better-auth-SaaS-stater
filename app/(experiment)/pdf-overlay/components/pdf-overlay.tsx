"use client";

import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

type Annotation = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type Props = {
	pdfUrl: string;
	annotations: Annotation[];
	pythonWidth: number;
	pythonHeight: number;
};

const PdfOverlay: React.FC<Props> = ({
	pdfUrl,
	annotations,
	pythonWidth,
	pythonHeight,
}) => {
	const [pdfSize, setPdfSize] = useState({ width: 1, height: 1 });
	const pageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (pageRef.current) {
			const { offsetWidth, offsetHeight } = pageRef.current;
			setPdfSize({ width: offsetWidth, height: offsetHeight });
		}
	}, []);

	const remapCoordinates = (ann: Annotation) => ({
		x: (ann.x / pythonWidth) * pdfSize.width,
		y: (ann.y / pythonHeight) * pdfSize.height,
		width: (ann.width / pythonWidth) * pdfSize.width,
		height: (ann.height / pythonHeight) * pdfSize.height,
	});

	const [numPages, setNumPages] = useState<number | null>(null);
	return (
		<div style={{ width: "100%", height: "100vh" }}>
			<div className="relative inline-block">
				<div className="relative inline-block">
					<Document
						file={pdfUrl}
						onLoadSuccess={({ numPages }) => setNumPages(numPages)}
					>
						{/* {Array.from(new Array(numPages), (_, index) => ( */}
						<Page
							renderAnnotationLayer={false}
							renderTextLayer={false}
							key={1}
							pageNumber={0 + 1}
						/>
						{/* ))} */}
					</Document>
				</div>
				<div className="absolute top-0">
					<div>HAHAHA</div>
					<div>HAHAHA</div>
					<svg width="200" height="200" viewBox="0 0 200 200">
						<polygon
							points="50,50 150,50 150,150 50,150"
							fill="blue"
							stroke="darkblue"
							strokeWidth="4"
						/>
					</svg>

					<svg
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: pdfSize.width,
							height: pdfSize.height,
						}}
					>
						{annotations.map((ann, index) => {
							const mapped = remapCoordinates(ann);
							console.log("mapped =>\n", mapped);
							return (
								<rect
									key={index}
									x={mapped.x}
									y={mapped.y}
									width={mapped.width}
									height={mapped.height}
									fill="none"
									stroke="red"
									strokeWidth="2"
								/>
							);
						})}
					</svg>
				</div>
			</div>
			{/* <Document
				file={pdfUrl}
				onLoadSuccess={({ numPages }) => setNumPages(numPages)}
			>
				{Array.from(new Array(numPages), (_, index) => (
					<Page
						renderAnnotationLayer={false}
						renderTextLayer={false}
						key={index}
						pageNumber={index + 1}
					/>
				))}
			</Document> */}
		</div>
	);
	// return (
	// 	<div style={{ width: "100%", height: "100vh" }}>
	// 		<Document
	// 			file={pdfUrl}
	// 			onLoadSuccess={({ numPages }) => setNumPages(numPages)}
	// 		>
	// 			{Array.from(new Array(numPages), (_, index) => (
	// 				<Page
	// 					renderAnnotationLayer={false}
	//           renderTextLayer={false}
	// 					key={index}
	// 					pageNumber={index + 1}
	// 				/>
	// 			))}
	// 		</Document>
	// 	</div>
	// );

	return (
		<div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
			<TransformWrapper>
				<TransformComponent>
					<div
						style={{
							position: "relative",
							display: "inline-block",
						}}
					>
						{/* PDF Display */}
						<div
							ref={pageRef}
							style={{ width: "100%", height: "auto" }}
						>
							<Document file={pdfUrl}>
								<Page pageNumber={1} width={pdfSize.width} />
							</Document>
						</div>

						{/* SVG Overlay */}
						<svg
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: pdfSize.width,
								height: pdfSize.height,
							}}
						>
							{annotations.map((ann, index) => {
								const mapped = remapCoordinates(ann);
								return (
									<rect
										key={index}
										x={mapped.x}
										y={mapped.y}
										width={mapped.width}
										height={mapped.height}
										fill="none"
										stroke="red"
										strokeWidth="2"
									/>
								);
							})}
						</svg>
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};

export default PdfOverlay;
