// Tela
document.getElementById('btnComecar').addEventListener('click', () => {
    document.getElementById('telaBoasVindas').style.display = 'none';
    document.getElementById('telaScanner').style.display = 'block';
});
(async () => {

    const video      = document.getElementById('video');
    const canvas     = document.getElementById('canvas');
    const output     = document.getElementById('output');
    const captureBtn = document.getElementById('capture');
    const actionButtons = document.getElementById('actionButtons');
    const copyBtn    = document.getElementById('copyBtn');
    const clearBtn   = document.getElementById('clearBtn');

    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });
        video.srcObject = stream;
    } catch (err) {
        output.textContent = 'Erro ao acessar a câmera: ' + err.message;
        return;
    }

    // Capturar 
    captureBtn.addEventListener('click', async () => {

        const ctx = canvas.getContext('2d');
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        output.textContent = 'Processando OCR...';
        actionButtons.style.display = 'none';

        try {
            const { data: { text } } = await Tesseract.recognize(canvas, 'por+eng');

            const resultado = text.trim();
            output.textContent = resultado || 'Nenhum texto detectado.';

            if (resultado) {
                actionButtons.style.display = 'block';
            }

        } catch (err) {
            output.textContent = 'Erro no OCR: ' + err.message;
        }
    });

    // Copiar 
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(output.textContent);
            copyBtn.textContent = 'Copiado!';
            setTimeout(() => copyBtn.textContent = 'Copiar Texto', 2000);
        } catch {
            alert('Não foi possível copiar o texto.');
        }
    });

    // Limpar 
    clearBtn.addEventListener('click', () => {
        output.textContent = 'Texto detectado aparecerá aqui...';
        actionButtons.style.display = 'none';
    });

})();
