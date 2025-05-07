function contarHijosDeArchivo(archivoUrl) {
    fetch(archivoUrl)
    .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar el archivo');
        return response.text();
        })
    .then(htmlString => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const hijos = doc.body.children.length;

        document.getElementById('resultado').textContent = `El archivo "${archivoUrl}" tiene ${hijos} hijos directos en su <body>.`;
    })
}
  
