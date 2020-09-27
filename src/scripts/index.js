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

        data.blocks.forEach((e) => {
          //REPLACE ALL htlm spaces (&nbsp;) with normal spaces
          e.data.text = e.data.text.replace(/&nbsp;/g, " ");
          //THIS TRICK HERE IS JUST TO WORK IN pdfMAKE ...because pdfmake does not work with just \t or space
          // to addd multiple spaces gotta add '\u200B ' first and then the \t's to work
          e.data.text = e.data.text.replace(" ", "\u200B ");
          //for some reason the editorJS creates break lines \n in middle of texts dont know why but becames weird on output
          // so to fix that removed all \n in the text to remove the middle \ts...and then just the added \n in the end to create a normal breakline
          e.data.text = e.data.text.replace(/\n/g, "");
          e.data.text = e.data.text.concat("\n\n");

          //split the text to  better work with words instead of work with the entire text
          //
          const word = e.data.text.split(" ");

          for (let i = 0; i < word.length; i++) {
            if (word[i].includes("<b>")) {
              /// if this block runs means that the word is bolded
              //create an object with bold set to true to add in pdfMake later
              const textObj = {
                bold: true,
                text: "",
                lineHeigth: 1.5,
              };

              //remove the tag that cames from the HTML that indicates a bolded text
              word[i] = word[i].replace("<b>", "");

              //this loop is for concatenate all the words that are in between the tags <b> BOLDED TEXT HERE </b>
              for (let j = i; j < word.length; j++) {
                //here checks the for the bold close tag..if a certain text ends with </b> so there is no need to continue
                //adding text on bolded object the loop will break and starts the cycle again (check if is bolded or not...)
                if (word[j].includes("</b>")) {
                  //remove the html tagg add text to object and end break the loop
                  word[j] = word[j].replace("</b>", "");
                  textObj.text = textObj.text.concat(" " + word[j]);

                  break;
                } else {
                  //if we didnt reach the last word or the word with the bold clos tag (</b>). it will continue concatenating the text in the object till finds the </b>
                  textObj.text = textObj.text.concat(" " + word[j]);

                  //the i++ is here because...when we process a certain word we need to go next in another...
                  //so if delete this..we will be checking the same word more tha once..
                  //so once checked we need to go on in the next
                  i++;
                }
              }

              //add bolded object to the content array that goes then to pdfMake
              content.push(textObj);
            } else {
              //if run this block means that the text or word is not bolded
              //it will keep concatenating till and check if the next word or text is bolded or not

              //nonBoldedOBject Default definition
              const nonBoldtextObj = {
                bold: false,
                text: "",
                lineHeigth: 1.5,
              };

              for (let j = i; j < word.length; j++) {
                //this if is just to prevent the OUT OF BOUND ERRORS that is common in arrays
                if (!(j + 1 === word.length)) {
                  //is here where is checjed if the next word is bolded or not
                  //if it is we break and let the other block for bold words handle it 'l'
                  if (word[j + 1].includes("<b>")) {
                    break;
                  }
                }
                //keep concatenating
                nonBoldtextObj.text = nonBoldtextObj.text.concat(
                  " " + word[j] + " "
                );
                //the i++ is here because...when we process a certain word we need to go next in another...
                //so if delete this..we will be checking the same word more tha once..
                //so once checked we need to go on in the next
                i++;
              }
              content.push(nonBoldtextObj);
            }
          }
        });

        //execute pdfMAke handler
        printPDF(content);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  });
