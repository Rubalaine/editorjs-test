import EditorJs from "@editorjs/editorjs";

import { printPDF } from "./pdfMake";
const save = document.getElementById("save");

const editor = new EditorJs({
  holder: "editorjs",
});
if (save)
  save.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(" clicou");
    editor
      .save()
      .then((outputData) => {
        console.log("Article data: ", JSON.stringify(outputData, null, 2));
        const data = JSON.parse(JSON.stringify(outputData));
        const content = [];

        console.log("sizr", data.blocks.length);
        data.blocks.forEach((e) => {
          console.log("DATA BEFORE REPLACE", e.data.text);
          e.data.text = e.data.text.replace(/&nbsp;/g, " ");
          e.data.text = e.data.text.replace(" ", "\u200B ");
          console.log("COUNT SPACES", e.data.text.split(" "));
          console.log("DATA", e.data.text);

          // return;

          e.data.text = e.data.text.replace(/\n/g, "");
          e.data.text = e.data.text.concat("\n\n");
          const sp = e.data.text.split(" ");
          //   console.log(sp);
          for (let i = 0; i < sp.length; i++) {
            if (sp[i].includes("<b>")) {
              const textObj = {
                bold: true,
                text: "",
                lineHeigth: 1.5,
              };
              let spaces = 0;

              sp[i] = sp[i].replace("<b>", "");
              ///loop till </b>

              for (let j = i; j < sp.length; j++) {
                //concatenado no OBJ

                if (sp[j].includes("</b>")) {
                  sp[j] = sp[j].replace("</b>", "");
                  //   console.log(sp[j]);
                  textObj.text = textObj.text.concat(" " + sp[j]);
                  spaces = textObj.text.search(/\S|$/);

                  break;
                } else {
                  textObj.text = textObj.text.concat(" " + sp[j]);
                  spaces = textObj.text.search(/\S|$/);

                  i++;
                }
              }
              // textObj.margin = [spaces, 0];
              content.push(textObj);
            } else {
              const nonBoldtextObj = {
                bold: false,
                text: "",
                lineHeigth: 1.5,
              };
              let spaces = 0;
              for (let j = i; j < sp.length; j++) {
                if (!(j + 1 === sp.length)) {
                  if (sp[j + 1].includes("<b>")) {
                    break;
                  }
                }

                nonBoldtextObj.text = nonBoldtextObj.text.concat(
                  " " + sp[j] + " "
                );
                spaces = nonBoldtextObj.text.search(/\S|$/);

                i++;
              }
              // nonBoldtextObj.margin = [spaces, 0];
              content.push(nonBoldtextObj);
            }
          }
          //   console.log(content);
        });
        printPDF(content);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  });
s;
