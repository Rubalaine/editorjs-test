const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const printPDF = (doc) => {
  const def = { content: [{ text: [] }] };

  console.log("CONT", def.content[0]);
  doc.forEach((e) => {
    console.log(e);
    def.content[0].text.push(e);
  });

  console.log("FINAALLY", def.content[0].text);

  pdfMake.createPdf(def).open();
};
