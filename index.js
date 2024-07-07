const apiUrl = '/mangas'; 

function addManga() {
    const nomeInput = document.getElementById('nome');
    const nome = nomeInput.value.trim();
    const precoInput = document.getElementById('preco');
    let preco = precoInput.value.trim();

    if (nome === '') {
        alert('Por favor, preencha o nome do mangá.');
        return;
    }

    if (!/^[\d,]+$/.test(preco)) {
        alert('Por favor, insira um valor numérico para o preço.');
        return;
    }

    preco = formatarPreco(preco);

    const img = document.getElementById('img').value.trim();

    if (!isValidURL(img)) {
        alert('URL de imagem inválida.');
        return;
    }

    const manga = {
        title: nome,
        price: preco,
        imageUrl: img
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(manga)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        getMangas();
    })
    .catch(error => console.error('Erro:', error));

    nomeInput.value = '';
    precoInput.value = '';
}

function formatarPreco(preco) {
    preco = preco.trim().replace('.', ','); 
    preco = parseFloat(preco).toFixed(2); 

    if (preco === '0.00') {
        alert('Por favor, insira um valor maior que zero para o preço.');
        return '';
    }

    preco = 'R$ ' + preco.replace('.', ',');

    return preco;
}

function isValidURL(url) {
    try {
        new URL(url); 
        return true;
    } catch (error) {
        return false;
    }
}

function getMangas() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const mangaList = document.getElementById('manga-list');
            mangaList.innerHTML = '';
            data.forEach(manga => {
                const mangaItem = document.createElement('li');
                mangaItem.innerHTML = `
                    <div>
                        <img src="${manga.imageUrl}" alt="${manga.title}" width="100">
                        <p>Título: ${manga.title}</p>
                        <p>Preço: ${manga.price}</p>
                        <button type="button" onclick="removeManga('${manga.id}')">Remover</button>
                    </div>
                `;
                mangaList.appendChild(mangaItem);
            });
        })
        .catch(error => console.error('Erro:', error));
}

function removeManga(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log(`Mangá com ID ${id} removido.`);
            getMangas(); 
        } else {
            console.error('Erro ao remover mangá.');
        }
    })
    .catch(error => console.error('Erro:', error));
}

document.addEventListener('DOMContentLoaded', getMangas);
