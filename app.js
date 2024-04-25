const config = {
    intervals: {
        '5sec': 5000,
        '5min': 300000,
        '1hour': 3600000
    },
    wsUrl: 'wss://stream.binance.com:9443/ws/btcusdt@kline_1m'
};

// Criar instâncias dos gráficos para cada intervalo de tempo
const charts = {
    '5sec': new Chart(document.getElementById('chart5sec').getContext('2d'), getChartConfig('5 Seconds')),
    '5min': new Chart(document.getElementById('chart5min').getContext('2d'), getChartConfig('5 Minutes')),
    '1hour': new Chart(document.getElementById('chart1hour').getContext('2d'), getChartConfig('1 Hour'))
};

// Configuração inicial dos gráficos
function getChartConfig(label) {
    return {
        type: 'line',
        data: {
            labels: [], // labels são atualizados com o tempo
            datasets: [{
                label: `Preço (${label})`,
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    };
}

// Função para processar os dados recebidos
function processData(data, interval) {
    const parsedData = JSON.parse(data);
    const price = parseFloat(parsedData.k.c); // preço de fechamento da kline
    const chart = charts[interval];
    if (chart.data.labels.length > 100) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(price);
    chart.update();
}

// Conectar ao WebSocket e definir os manipuladores de eventos
function setupWebSocket() {
    const ws = new WebSocket(config.wsUrl);
    ws.onmessage = (event) => {
        processData(event.data, '5sec'); // Exemplo de processamento para o intervalo de 5 segundos
        // Adicione lógica similar para 5min e 1hour usando setTimeout ou setInterval
    };
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

// Chamar a função de configuração na inicialização
setupWebSocket();
