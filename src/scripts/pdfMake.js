//SOME DEPENDECIES
const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const printPDF = (doc) => {
  //
  const documentDefinition = { content: [{ text: [] }] };

  doc.forEach((e) => {
    //this block pushes those objects bolded and nonBolded that cames from index.js to the content array
    //this is just pdfMake issues ... to see more feel free to go to their playground and seek for more than one piece
    documentDefinition.content[0].text.push(e);
  });

  //create a pdf and open it in a new browser tabe...with the open method
  pdfMake.createPdf(documentDefinition).open();
};
