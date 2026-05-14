// const fs = require('fs');

// const text = fs.readFileSync('src/data/terms.html', 'utf8');
// const lines = text.split('\n');

// let htmlLines = [];
// let inList = false;
// let paragraphBuffer = [];

// function flushParagraph() {
//     if (paragraphBuffer.length > 0) {
//         const text = paragraphBuffer.join(' ');
//         htmlLines.push(`<p>${text}</p>`);
//         paragraphBuffer = [];
//     }
// }

// function closeList() {
//     if (inList) {
//         htmlLines.push('</ul>');
//         inList = false;
//     }
// }

// for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];
//     const trimmed = line.trim();
    
//     if (trimmed === '') {
//         flushParagraph();
//         closeList();
//         continue;
//     }

//     const isBullet = trimmed.startsWith('•') || trimmed.startsWith('') || (trimmed.startsWith('-') && trimmed.length > 1 && trimmed[1] === ' ');
//     const isMainHeading = /^\d+\.\s+[A-Z0-9\s&()/-]+$/.test(trimmed) || (/^[A-Z0-9\s&()/-]+$/.test(trimmed) && trimmed.length > 3 && trimmed.length < 80);
    
//     // Detect if the line starts with a lowercase letter or number/symbol, which usually means it's a continuation of the previous line
//     const startsWithLowercase = /^[a-z]/.test(trimmed) || /^[0-9]/.test(trimmed);

//     if (isBullet) {
//         flushParagraph();
//         if (!inList) {
//             htmlLines.push('<ul>');
//             inList = true;
//         }
//         let liContent = trimmed.substring(1).trim();
//         htmlLines.push(`  <li>${liContent}</li>`);
//     } else {
//         if (inList) {
//             if (startsWithLowercase) {
//                 // Continuation of previous list item
//                 let lastLi = htmlLines.pop();
//                 lastLi = lastLi.replace('</li>', ' ' + trimmed + '</li>');
//                 htmlLines.push(lastLi);
//             } else {
//                 // End of list
//                 closeList();
//                 if (isMainHeading) {
//                     htmlLines.push(`<h2>${trimmed}</h2>`);
//                 } else {
//                     paragraphBuffer.push(trimmed);
//                 }
//             }
//         } else {
//             if (isMainHeading) {
//                 flushParagraph();
//                 htmlLines.push(`<h2>${trimmed}</h2>`);
//             } else {
//                 // It's a paragraph line.
//                 // If it doesn't start with a lowercase letter, and the previous line ended with a period, it might be a new paragraph.
//                 if (paragraphBuffer.length > 0) {
//                     const lastText = paragraphBuffer[paragraphBuffer.length - 1];
//                     if (/[.!?:;]$/.test(lastText) && /^[A-Z0-9]/.test(trimmed)) {
//                         flushParagraph();
//                     }
//                 }
//                 paragraphBuffer.push(trimmed);
//             }
//         }
//     }
// }

// flushParagraph();
// closeList();

// const result = htmlLines.join('\n');
// fs.writeFileSync('src/data/terms.html', result);
// console.log("Formatted terms.html successfully");
