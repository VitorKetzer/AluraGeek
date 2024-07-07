const apiUrl = 'http://localhost:3000/mangas';


function formatPrice(preco) {
    
    preco = preco.replace(/[^\d,]/g, '');

    
    preco = preco.replace('.', ',');

    
    if (preco.length <= 2) {
        return `R$ ${preco},00`;
    } else {
        
        const parts = preco.split(',');
        if (parts.length === 2) {
            return `R$ ${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${parts[1].slice(0, 2)}`;
        } else {
            return `R$ ${preco.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const precoInput = document.getElementById('preco');

    if (precoInput) {
        precoInput.addEventListener('input', function(event) {
            const { value } = event.target;
            const lastChar = value.slice(-1);
            
            
            if (!/[\d,]/.test(lastChar)) {
                event.target.value = value.slice(0, -1);
            }
        });
    }

    const enviarBtn = document.getElementById('enviar-btn');
    if (enviarBtn) {
        enviarBtn.addEventListener('click', function() {
            const preco = document.getElementById('preco').value;
            const precoFormatado = formatPrice(preco);

            
            if (precoFormatado === 'R$ 0,00') {
                console.error('Preço inválido. Insira um preço válido.');
                return;
            }

            
            document.getElementById('preco').value = precoFormatado;

            
            addManga();
        });
    }

    
    getMangas();
});

function addManga() {
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const imageUrl = document.getElementById('img').value; 

    
    if (preco === 'R$ 0,00') {
        console.error('Preço inválido. Insira um preço válido.');
        return;
    }

    if (!nome || !preco || !imageUrl) {
        console.error('Por favor, preencha todos os campos.');
        return;
    }

    const manga = {
        title: nome,
        price: preco,
        imageUrl: imageUrl
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
        console.log('Mangá adicionado:', data);
        getMangas();
    })
    .catch(error => console.error('Erro ao adicionar mangá:', error));
}

function getMangas() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Lista de mangás:', data);
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
        .catch(error => console.error('Erro ao obter lista de mangás:', error));
}

function removeManga(id) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Mangá removido com sucesso');
            getMangas(); 
            console.error('Erro ao remover mangá:', response.status);
        }
    })
    .catch(error => console.error('Erro ao remover mangá:', error));
}
