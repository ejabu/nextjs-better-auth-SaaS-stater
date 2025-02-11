"use client";

import PdfOverlay from "@/app/(experiment)/pdf-overlay/components/pdf-overlay";
import React from "react";

const App = () => {
	const annotations = [
		{ x: 100, y: 150, width: 50, height: 30 },
		{ x: 300, y: 400, width: 100, height: 50 },
	];
	return (
		<div className="w-full flex">
			<PdfOverlay
				pdfUrl="/only-tables.pdf"
				annotations={annotations}
				pythonWidth={1000}
				pythonHeight={1400}
			/>
		</div>
	);
};

export default App;
