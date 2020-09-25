import EditorJs from '@editorjs/editorjs';
const save =  document.getElementById('save');
// import Header from '@editorjs/header'; 
// import List from '@editorjs/list';

const editor = new EditorJs({
    holder: 'editorjs',
    // tools: { 
    //     header: Header, 
    //     list: List 
    //   }, 
});
if(save)
    save.addEventListener('click', nevent=>{
        nevent.preventDefault();
        console.log(' clicou')
        editor.save().then((outputData) => {
            console.log('Article data: ', JSON.stringify(outputData, null, 2))
        }).catch((error) => {
            console.log('Saving failed: ', error)
        });
    })
