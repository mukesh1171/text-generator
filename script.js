let model;
var decoder = '';
var encoder = '';

fetch('encoder.json')
    .then(response => response.json())
    .then(data2 =>{
        encoder = data2;
    })

fetch('decoder.json')
        .then(response => response.json())
        .then(data1 =>{
            decoder = data1
            
        })
        

document.getElementById('story').innerHTML = ' '
        
function encode_sentence(input_sentence) {
    
    let encoded_sentence = []
    let split_sen = input_sentence.split(' ')
    for (let i = 0; i < split_sen.length; i++) {
        // console.log(encoder[split_sen[i]])
        encoded_sentence.push(encoder[split_sen[i]])        
    }
    return encoded_sentence
}

function pad_sentence(enc_sentence, seqencelength = 7){
    if (enc_sentence.length < seqencelength) {
        console.log('less than sequence length')
        let num_pad = seqencelength - enc_sentence.length
        for (let i = 0; i < num_pad; i++) {
            enc_sentence.push(0)            
        }
    }else{
        console.log('greater than sequence length')
        let num_rm = enc_sentence.length -seqencelength
        console.log(num_rm)
        for (let i = 0; i < num_rm; i++) {
            enc_sentence.shift()          
        }
    }
    return enc_sentence
}


async function start() {
    let num_words = document.getElementById('num_words').value;
    
    model = await tf.loadLayersModel('model/model.json')
    console.log('Model Loaded')
    var input_sentence = document.getElementById("input").value;
    console.log(input_sentence)
    if (input_sentence != " ") {
        story = input_sentence
        list_encoded = encode_sentence(input_sentence)
        paded_sentence = pad_sentence(list_encoded)
        let inp = tf.tensor([paded_sentence])
        
        for (let h = 0; h < num_words; h++) {
    
            let result = model.predict(inp).arraySync()[0]
            let index = result.indexOf(Math.max(...result));
            console.log(decoder[index])
            story = story +" "+ decoder[index]
    
            document.getElementById('story').innerHTML = story
    
            next = paded_sentence.push(index)
            paded_sentence.shift()
            inp = tf.tensor([paded_sentence])       
        }
        inp.dispose()   
    }else{
        alert('Give Some Inputs')
    }
}


